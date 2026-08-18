// @ts-check
'use strict';

const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

// ── GitHub Actions context ────────────────────────────────────────────
const token = process.env.GITHUB_TOKEN;
const [repoOwner, repoName] = (process.env.GITHUB_REPOSITORY || '').split('/');
const eventPayload = JSON.parse(fs.readFileSync(/** @type {string} */ (process.env.GITHUB_EVENT_PATH), 'utf8'));

// ── Actions log helpers ───────────────────────────────────────────────
/** @param {string} msg */
function info(msg)      { console.log(msg); }
/** @param {string} msg */
function warning(msg)   { console.warn(`::warning::${msg}`); }
/** @param {string} msg */
function setFailed(msg) { console.error(`::error::${msg}`); process.exitCode = 1; }

// ── GitHub REST helper ────────────────────────────────────────────────
/**
 * @param {string} method
 * @param {string} path
 * @param {object|null} [body]
 * @returns {Promise<{ status: number, data: any }>}
 */
function ghApi(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: 'api.github.com',
        path,
        method,
        headers: {
          Authorization:  `token ${token}`,
          'User-Agent':   'mistica-design/check-token-import',
          Accept:         'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: /** @type {number} */ (res.statusCode), data: raw ? JSON.parse(raw) : null });
          } catch {
            resolve({ status: /** @type {number} */ (res.statusCode), data: raw });
          }
        });
      },
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── main ──────────────────────────────────────────────────────────────
(async () => {
  const WAITING_LABEL = 'waiting-for-mistica-web';
  const SKIP_LABEL    = 'skip-web-check';
  const WEB_OWNER     = 'Telefonica';
  const WEB_REPO      = 'mistica-web';
  const CONTRACT_PATH = 'src/skins/skin-contract.css.ts';
  const WEB_REF       = 'master';

  // ── resolve PR context ────────────────────────────────────────────
  // `pull_request` events carry the PR inline. A manual `workflow_dispatch`
  // re-run (used after the paired mistica-web PR merges) only carries the PR
  // number as an input, so the PR is fetched to obtain its base sha and labels.
  let prNumber, baseSha, currentLabels;
  if (eventPayload.pull_request) {
    prNumber      = eventPayload.pull_request.number;
    baseSha       = eventPayload.pull_request.base.sha;
    currentLabels = eventPayload.pull_request.labels.map((/** @type {{ name: string }} */ l) => l.name);
  } else {
    prNumber = Number(eventPayload.inputs?.pr);
    if (!Number.isInteger(prNumber) || prNumber <= 0) {
      setFailed(`Expected a numeric "pr" input for a manual run, received: ${eventPayload.inputs?.pr}`);
      return;
    }
    const prRes = await ghApi('GET', `/repos/${repoOwner}/${repoName}/pulls/${prNumber}`);
    if (prRes.status !== 200) {
      setFailed(`Could not fetch PR #${prNumber} (HTTP ${prRes.status}).`);
      return;
    }
    baseSha       = prRes.data.base.sha;
    currentLabels = (prRes.data.labels ?? []).map((/** @type {{ name: string }} */ l) => l.name);
    info(`Manual re-check of PR #${prNumber} (base ${baseSha}).`);
  }

  // ── helpers ───────────────────────────────────────────────────────
  // Label bookkeeping is best-effort: a transport error or a read-only token
  // (fork PRs) must never turn an otherwise passing check red.
  /**
   * @param {string} name
   * @param {string} color
   * @param {string} description
   */
  async function ensureLabel(name, color, description) {
    try {
      const get = await ghApi('GET', `/repos/${repoOwner}/${repoName}/labels/${encodeURIComponent(name)}`);
      if (get.status === 404) {
        const created = await ghApi('POST', `/repos/${repoOwner}/${repoName}/labels`, { name, color, description });
        if (created.status >= 400) {
          warning(`Could not create label "${name}": HTTP ${created.status}`);
        }
      } else if (get.status >= 400) {
        warning(`Could not look up label "${name}": HTTP ${get.status}`);
      }
    } catch (e) {
      warning(`Could not ensure label "${name}": ${/** @type {Error} */ (e).message}`);
    }
  }

  /** @param {string} label */
  async function addLabel(label) {
    try {
      const res = await ghApi('POST', `/repos/${repoOwner}/${repoName}/issues/${prNumber}/labels`, { labels: [label] });
      if (res.status >= 400) {
        warning(`Could not add label "${label}": HTTP ${res.status}`);
      }
    } catch (e) {
      warning(`Could not add label "${label}": ${/** @type {Error} */ (e).message}`);
    }
  }

  /** @param {string} label */
  async function removeLabel(label) {
    try {
      const res = await ghApi('DELETE', `/repos/${repoOwner}/${repoName}/issues/${prNumber}/labels/${encodeURIComponent(label)}`);
      if (res.status >= 400 && res.status !== 404) {
        warning(`Could not remove label "${label}": HTTP ${res.status}`);
      }
    } catch (e) {
      warning(`Could not remove label "${label}": ${/** @type {Error} */ (e).message}`);
    }
  }

  // ── ensure labels exist in the repo ──────────────────────────────
  await ensureLabel(WAITING_LABEL, 'e4e669', 'New tokens require a paired mistica-web PR');
  await ensureLabel(SKIP_LABEL,    'bfd4f2', 'Bypass the mistica-web token import check');

  // ── step 1: honour skip label ─────────────────────────────────────
  // Checked before anything else so the bypass works even when the diff or the
  // contract fetch below cannot be computed.
  if (currentLabels.includes(SKIP_LABEL)) {
    warning(`"${SKIP_LABEL}" label is set. Skipping mistica-web validation.`);
    await removeLabel(WAITING_LABEL);
    return;
  }

  // ── step 2: get base schema ───────────────────────────────────────
  // An unreadable base is reported as its own failure. Falling back to an empty
  // set would mark every existing token as new and block the PR with a wall of
  // unrelated names.
  let baseRequired = new Set();
  try {
    const raw = execSync(`git show ${baseSha}:tokens/schema/skin-schema.json`, { encoding: 'utf8' });
    const parsed = JSON.parse(raw);
    for (const token of parsed?.global?.constants?.required ?? []) {
      baseRequired.add(token);
    }
  } catch (e) {
    setFailed(
      `Could not read the base schema at ${baseSha}:tokens/schema/skin-schema.json ` +
      `(${/** @type {Error} */ (e).message}). Without it the set of new tokens cannot be determined. ` +
      `Rebase the PR onto an up-to-date "${eventPayload.pull_request.base.ref}" and push again, ` +
      `or apply the "${SKIP_LABEL}" label to bypass this check with justification.`
    );
    return;
  }

  // ── step 3: get PR schema ─────────────────────────────────────────
  const prRaw      = fs.readFileSync('tokens/schema/skin-schema.json', 'utf8');
  const prSchema   = JSON.parse(prRaw);
  const prRequired = prSchema?.global?.constants?.required ?? [];

  // ── step 4: find genuinely new tokens ────────────────────────────
  const newTokens = prRequired.filter((/** @type {string} */ t) => !baseRequired.has(t));

  if (newTokens.length === 0) {
    info('No new tokens detected. Check passes.');
    await removeLabel(WAITING_LABEL);
    return;
  }

  info(`New tokens detected: ${newTokens.join(', ')}`);

  // ── step 5: fetch mistica-web contract via GitHub API ─────────────
  /** Describes why the contract could not be read, or null when it was read. */
  let fetchProblem = null;
  let contractContent = '';

  let contentRes;
  try {
    contentRes = await ghApi('GET', `/repos/${WEB_OWNER}/${WEB_REPO}/contents/${CONTRACT_PATH}?ref=${WEB_REF}`);
  } catch (e) {
    contentRes = null;
    fetchProblem = `request failed: ${/** @type {Error} */ (e).message}`;
  }

  if (contentRes && contentRes.status !== 200) {
    fetchProblem = `HTTP ${contentRes.status}`;
  } else if (contentRes) {
    const body = contentRes.data;
    // A 200 is not sufficient: the contents API answers with an array for
    // directories, and with `encoding: "none"` and empty content for files
    // over 1 MB. Both would otherwise read as "every token is missing".
    if (Array.isArray(body)) {
      fetchProblem = 'path resolved to a directory, not a file';
    } else if (body?.encoding !== 'base64' || typeof body?.content !== 'string' || body.content.length === 0) {
      fetchProblem = `unusable response body (encoding: ${body?.encoding ?? 'missing'})`;
    } else {
      contractContent = Buffer.from(body.content, 'base64').toString('utf8');
      if (contractContent.trim().length === 0) {
        fetchProblem = 'contract file is empty';
      }
    }
  }

  if (fetchProblem) {
    setFailed(
      `Could not read ${WEB_OWNER}/${WEB_REPO}@${WEB_REF}:${CONTRACT_PATH} (${fetchProblem}). ` +
      `Cannot validate new tokens: ${newTokens.join(', ')}. ` +
      `Re-run this workflow once the file is accessible, or apply the "${SKIP_LABEL}" label with justification to bypass.`
    );
    return;
  }

  // ── step 6: cross-reference ───────────────────────────────────────
  const escapeRegExp = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tokenRegexes  = newTokens.map((/** @type {string} */ t) => new RegExp(`(^|[^A-Za-z0-9_$])${escapeRegExp(t)}([^A-Za-z0-9_$]|$)`));
  const missingTokens = newTokens.filter((/** @type {string} */ _t, /** @type {number} */ i) => !tokenRegexes[i].test(contractContent));

  if (missingTokens.length === 0) {
    info('All new tokens are present in mistica-web. Check passes.');
    await removeLabel(WAITING_LABEL);
    return;
  }

  // ── step 7: block and label ───────────────────────────────────────
  await addLabel(WAITING_LABEL);
  setFailed(
    `${missingTokens.length} token(s) are not yet imported in mistica-web:\n` +
    missingTokens.map((/** @type {string} */ t) => `  • ${t}`).join('\n') + '\n\n' +
    `Update \`${CONTRACT_PATH}\` in ${WEB_OWNER}/${WEB_REPO} ` +
    `and push a new commit to re-run this check.\n` +
    `Alternatively, apply the "${SKIP_LABEL}" label to bypass this check with justification.`
  );
})().catch((e) => {
  // Any unexpected throw is surfaced as a workflow error rather than an opaque
  // unhandled-rejection stack trace.
  setFailed(`check-token-import failed unexpectedly: ${/** @type {Error} */ (e).stack || e}`);
});
