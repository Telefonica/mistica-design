import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { OcrEngine } from "./interface.ts";
import { isValidMarkdownTable } from "./validate.ts";

const execFileAsync = promisify(execFile);

/**
 * Best-effort fallback — runs the local `tesseract` binary and tries to
 * reconstruct a markdown table from whitespace gaps. If columns can't be
 * inferred reliably, returns null and the orchestrator falls through.
 */
export class TesseractOcrEngine implements OcrEngine {
  readonly name = "tesseract";

  async extractTable(pngPath: string): Promise<string | null> {
    let raw: string;
    try {
      // execFile (no shell) — pngPath is constructed from validated [\w-]+ slugs.
      const { stdout } = await execFileAsync(
        "tesseract",
        [pngPath, "stdout", "--psm", "6"],
        { timeout: 30_000, maxBuffer: 10 * 1024 * 1024 },
      );
      raw = stdout;
    } catch {
      return null;
    }

    const md = textToMarkdownTable(raw);
    return md && isValidMarkdownTable(md) ? md : null;
  }
}

/**
 * Heuristic: split each non-empty line at runs of 2+ spaces. If the row
 * counts agree across most lines, treat the first row as the header and emit
 * a markdown table.
 */
export function textToMarkdownTable(raw: string): string | null {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/\t/g, "  ").trimEnd())
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return null;

  const rows = lines.map((l) => l.trim().split(/\s{2,}/));
  const counts = new Map<number, number>();
  for (const r of rows) {
    counts.set(r.length, (counts.get(r.length) ?? 0) + 1);
  }
  let modeCount = 0;
  let modeLength = 0;
  for (const [len, n] of counts) {
    if (n > modeCount) {
      modeCount = n;
      modeLength = len;
    }
  }
  if (modeLength < 2) return null;
  if (modeCount / rows.length < 0.6) return null;

  const aligned = rows
    .filter((r) => r.length === modeLength)
    .map((r) => r.map((c) => c.replace(/\|/g, "\\|").trim()));
  if (aligned.length < 2) return null;

  const [header, ...body] = aligned;
  if (!header) return null;
  const sep = header.map(() => "---");
  const fmt = (cols: string[]) => `| ${cols.join(" | ")} |`;
  return [fmt(header), fmt(sep), ...body.map(fmt)].join("\n");
}
