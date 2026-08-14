// @ts-check
'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

/**
 * @param {{ github: import('@octokit/rest').Octokit, context: object, core: object }} params
 */
module.exports = async ({ github, context, core }) => {
  const WAITING_LABEL  = 'waiting-for-mistica-web';
  const SKIP_LABEL     = 'skip-web-check';
  const WEB_OWNER      = 'Telefonica';
  const WEB_REPO       = 'mistica-web';
  const CONTRACT_PATH  = 'src/skins/skin-contract.css.ts';
  const WEB_REF        = 'master';

  const prNumber = context.payload.pull_request.number;
  const baseSha  = context.payload.pull_request.base.sha;

  // ── helpers ──────────────────────────────────────────────────────
  async function ensureLabel(name, color, description) {
    try {
      await github.rest.issues.getLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        name,
      });
    } catch (e) {
      if (e.status === 404) {
        await github.rest.issues.createLabel({
          owner: context.repo.owner,
          repo: context.repo.repo,
          name,
          color,
          description,
        });
      }
    }
  }

  async function addLabel(label) {
    try {
      await github.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        labels: [label],
      });
    } catch (e) {
      core.warning(`Could not add label "${label}": ${e.message}`);
    }
  }

  async function removeLabel(label) {
    try {
      await github.rest.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        name: label,
      });
    } catch (e) {
      if (e.status !== 404) {
        core.warning(`Could not remove label "${label}": ${e.message}`);
      }
    }
  }

  // ── ensure labels exist in the repo ──────────────────────────────
  await ensureLabel(WAITING_LABEL, 'e4e669', 'New tokens require a paired mistica-web PR');
  await ensureLabel(SKIP_LABEL,    'bfd4f2', 'Bypass the mistica-web token import check');

  // ── step 1: get base schema ───────────────────────────────────────
  let baseRequired = new Set();
  try {
    const raw = execSync(`git show ${baseSha}:tokens/schema/skin-schema.json`, { encoding: 'utf8' });
    const parsed = JSON.parse(raw);
    for (const token of parsed?.global?.constants?.required ?? []) {
      baseRequired.add(token);
    }
  } catch (e) {
    core.info(`Could not retrieve base schema (${e.message}); treating base as empty.`);
  }

  // ── step 2: get PR schema ─────────────────────────────────────────
  const prRaw    = fs.readFileSync('tokens/schema/skin-schema.json', 'utf8');
  const prSchema = JSON.parse(prRaw);
  const prRequired = prSchema?.global?.constants?.required ?? [];

  // ── step 3: find genuinely new tokens ────────────────────────────
  const newTokens = prRequired.filter(t => !baseRequired.has(t));

  if (newTokens.length === 0) {
    core.info('No new tokens detected. Check passes.');
    await removeLabel(WAITING_LABEL);
    return;
  }

  core.info(`New tokens detected: ${newTokens.join(', ')}`);

  // ── step 4: honour skip label ─────────────────────────────────────
  const currentLabels = context.payload.pull_request.labels.map(l => l.name);
  if (currentLabels.includes(SKIP_LABEL)) {
    core.warning(
      `"${SKIP_LABEL}" label is set. Skipping mistica-web validation.\n` +
      `Bypassed tokens: ${newTokens.join(', ')}`
    );
    await removeLabel(WAITING_LABEL);
    return;
  }

  // ── step 5: fetch mistica-web contract via GitHub API ─────────────
  let contractContent;
  try {
    const { data } = await github.rest.repos.getContent({
      owner: WEB_OWNER,
      repo:  WEB_REPO,
      path:  CONTRACT_PATH,
      ref:   WEB_REF,
    });
    contractContent = Buffer.from(data.content, 'base64').toString('utf8');
  } catch (e) {
    core.setFailed(
      `Could not fetch ${WEB_OWNER}/${WEB_REPO}@${WEB_REF}:${CONTRACT_PATH} (${e.message}). ` +
      `Cannot validate new tokens: ${newTokens.join(', ')}. ` +
      `Re-run this workflow once the file is accessible, or apply the "${SKIP_LABEL}" label with justification to bypass.`
    );
    return;
  }

  // ── step 6: cross-reference ───────────────────────────────────────
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tokenRegexes = newTokens.map(t => new RegExp(`(^|[^A-Za-z0-9_$])${escapeRegExp(t)}([^A-Za-z0-9_$]|$)`));
  const missingTokens = newTokens.filter((t, i) => !tokenRegexes[i].test(contractContent));

  if (missingTokens.length === 0) {
    core.info('All new tokens are present in mistica-web. Check passes.');
    await removeLabel(WAITING_LABEL);
    return;
  }

  // ── step 7: block and label ───────────────────────────────────────
  await addLabel(WAITING_LABEL);
  core.setFailed(
    `${missingTokens.length} token(s) are not yet imported in mistica-web:\n` +
    missingTokens.map(t => `  • ${t}`).join('\n') + '\n\n' +
    `Update \`${CONTRACT_PATH}\` in ${WEB_OWNER}/${WEB_REPO} ` +
    `and push a new commit to re-run this check.\n` +
    `Alternatively, apply the "${SKIP_LABEL}" label to bypass this check with justification.`
  );
};
