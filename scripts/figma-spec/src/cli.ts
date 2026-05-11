import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Command } from "commander";
import { config as loadEnv } from "dotenv";
import { getRepoRoot, getScriptRoot, loadConfig } from "./config.ts";
import { FigmaClient, normalizeNodeId } from "./figma/client.ts";
import { exportFigures, exportTables } from "./figma/export.ts";
import {
  looksLikeFigmaUrl,
  parseFigmaUrl,
  slugifyName,
} from "./figma/url.ts";
import { getAllFigureFrames } from "./parser/figure.ts";
import { getAllTableFrames } from "./parser/table.ts";
import { extractTableFromFrame } from "./parser/table-extract.ts";
import type { FigureRef } from "./parser/inline.ts";
import { OcrOrchestrator } from "./ocr/orchestrator.ts";
import { renderMarkdown } from "./render/markdown.ts";
import { parseChangelog } from "./render/changelog.ts";

loadEnv({ path: resolve(getRepoRoot(), ".env") });
loadEnv({ path: resolve(getScriptRoot(), ".env"), override: false });

const CACHE_DIR_ABS = resolve(getScriptRoot(), ".cache");

const program = new Command();

program
  .name("spec-md")
  .description("Generate Markdown specs from a Figma documentation page.")
  .version("0.1.0");

program
  .command("generate <componentOrUrl>")
  .description(
    "Generate a spec from either a registered slug (specs.config.json) or a Figma page URL.",
  )
  .option(
    "--slug <slug>",
    "Override the output filename slug (URL mode only).",
  )
  .action(async (input: string, opts: { slug?: string }) => {
    await runGenerate(input, opts);
  });

program
  .command("validate <component>")
  .description("(Phase 4) Run preflight checks against the Figma file.")
  .action(() => {
    console.error("validate is not implemented yet (Phase 4).");
    process.exit(2);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

async function runGenerate(
  input: string,
  opts: { slug?: string },
): Promise<void> {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error(
      "FIGMA_TOKEN not set. Add it to <repo>/.env or scripts/figma-spec/.env.",
    );
  }

  const config = await loadConfig();
  const client = new FigmaClient(token);

  const source = resolveSource(input, opts, config.components);
  const pageId = normalizeNodeId(source.pageId);

  process.stderr.write(
    `→ fetching ${source.label} from Figma (file ${source.fileKey}, page ${pageId})\n`,
  );
  const [meta, page] = await Promise.all([
    client.getFileMeta(source.fileKey),
    client.getPageDocument(source.fileKey, pageId),
  ]);
  const branchLabel = meta.mainFileKey ? meta.name : "main";
  process.stderr.write(
    `  branch: ${branchLabel} (Figma lastModified ${meta.lastModified})\n`,
  );

  const slug = source.slug ?? slugifyName(page.name);
  if (!slug) {
    throw new Error(
      `Could not derive a slug from page name "${page.name}". Pass --slug explicitly.`,
    );
  }

  const warnings: string[] = [];

  // ── Figures ────────────────────────────────────────────────────────────
  const figureFrames = getAllFigureFrames(page, warnings);
  process.stderr.write(
    `  found ${figureFrames.length} figure frame(s)` +
      (figureFrames.length > 0
        ? `: ${figureFrames.map((f) => f.slug).join(", ")}`
        : "") +
      "\n",
  );
  const figureExports = await exportFigures({
    client,
    fileKey: source.fileKey,
    componentSlug: slug,
    outputDirAbs: config.outputDirAbs,
    figures: figureFrames.map((f) => ({ slug: f.slug, nodeId: f.nodeId })),
    warnings,
  });
  const figuresBySlug = new Map<string, FigureRef>();
  for (const fig of figureFrames) {
    const exp = figureExports.find((e) => e.slug === fig.slug);
    if (!exp) continue;
    figuresBySlug.set(fig.slug, {
      slug: fig.slug,
      caption: fig.caption,
      relativePath: exp.relativePath,
    });
  }

  // ── Tables: try node-tree extraction first, fall back to OCR ─────────
  const tableFrames = getAllTableFrames(page, warnings);
  process.stderr.write(
    `  found ${tableFrames.length} table frame(s)` +
      (tableFrames.length > 0
        ? `: ${tableFrames.map((t) => t.slug).join(", ")}`
        : "") +
      "\n",
  );
  const tablesBySlug = new Map<string, string>();
  const needsOcr: typeof tableFrames = [];
  for (const t of tableFrames) {
    const structured = extractTableFromFrame(t.node);
    if (structured) {
      process.stderr.write(`  table::${t.slug} … ok (structural)\n`);
      tablesBySlug.set(t.slug, structured);
    } else {
      needsOcr.push(t);
    }
  }

  if (needsOcr.length > 0) {
    const tableExports = await exportTables({
      client,
      fileKey: source.fileKey,
      cacheDirAbs: CACHE_DIR_ABS,
      tables: needsOcr.map((t) => ({ slug: t.slug, nodeId: t.nodeId })),
      warnings,
    });
    const ocr = new OcrOrchestrator({ geminiApiKey: process.env.GEMINI_API_KEY });
    for (const exp of tableExports) {
      process.stderr.write(`  ocr table::${exp.slug} … `);
      const result = await ocr.extractTable(exp.slug, exp.destPath);
      if (result.ok) {
        process.stderr.write(`ok (${result.engineUsed})\n`);
      } else {
        const tried = result.attempts.map((a) => a.engine).join(", ") ||
          "(none)";
        process.stderr.write(`fallback (tried ${tried})\n`);
        warnings.push(
          `OCR failed for table::${exp.slug} — left an HTML-comment placeholder.`,
        );
      }
      tablesBySlug.set(exp.slug, result.rendered);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  await mkdir(config.outputDirAbs, { recursive: true });
  const outPath = resolve(config.outputDirAbs, `${slug}.md`);

  const previousChangelog = await readFile(outPath, "utf8")
    .then(parseChangelog)
    .catch(() => []);

  const generatedAt = new Date();
  const markdown = renderMarkdown({
    componentSlug: slug,
    fileKey: source.fileKey,
    pageId,
    page,
    generatedAt,
    figuresBySlug,
    tablesBySlug,
    changelog: {
      previous: previousChangelog,
      current: {
        branch: branchLabel,
        lastModified: meta.lastModified,
        generatedAt: generatedAt.toISOString(),
      },
    },
    warnings,
  });

  await writeFile(outPath, markdown, "utf8");
  process.stderr.write(`✓ wrote ${outPath}\n`);

  if (warnings.length > 0) {
    process.stderr.write(`\n${warnings.length} warning(s):\n`);
    for (const w of warnings) process.stderr.write(`  - ${w}\n`);
  }
}

interface ResolvedSource {
  fileKey: string;
  pageId: string;
  /** Final slug, or undefined to derive from the fetched page name. */
  slug: string | undefined;
  /** Human-friendly label for log lines. */
  label: string;
}

function resolveSource(
  input: string,
  opts: { slug?: string },
  components: Record<string, { fileKey: string; pageId: string }>,
): ResolvedSource {
  if (looksLikeFigmaUrl(input)) {
    const parsed = parseFigmaUrl(input);
    if (!parsed) {
      throw new Error(
        `Could not parse Figma URL: ${input}\n` +
          `Expected something like https://www.figma.com/design/<fileKey>/<name>?node-id=<id>.`,
      );
    }
    return {
      fileKey: parsed.fileKey,
      pageId: parsed.pageId,
      slug: opts.slug,
      label: opts.slug ?? "(slug from page name)",
    };
  }

  if (opts.slug) {
    throw new Error("--slug is only supported with a Figma URL input.");
  }

  const entry = components[input];
  if (!entry) {
    const known = Object.keys(components).join(", ") || "(none)";
    throw new Error(
      `Unknown component "${input}". Known: ${known}. ` +
        `Add it to specs.config.json or pass a Figma URL.`,
    );
  }
  if (
    entry.fileKey.startsWith("REPLACE_") ||
    entry.pageId.startsWith("REPLACE_")
  ) {
    throw new Error(
      `Component "${input}" still has placeholder fileKey/pageId in specs.config.json.`,
    );
  }
  return {
    fileKey: entry.fileKey,
    pageId: entry.pageId,
    slug: input,
    label: input,
  };
}
