/**
 * Reconstruct a markdown table from a Figma frame's node tree, without OCR.
 *
 * Approach: collect every TEXT descendant of the table frame, cluster them
 * into rows by Y position, sort each row by X, and emit pipe-delimited
 * markdown. This bypasses OCR entirely (no rate limits, no provider cost,
 * exact text). Falls back gracefully — returns null if the frame's structure
 * doesn't look like a regular grid, in which case the caller can drop down
 * to the OCR pipeline.
 */
import type { AnyNode, TextNode } from "../figma/types.ts";

export function extractTableFromFrame(frame: AnyNode): string | null {
  const cells = collectTextNodes(frame).filter(
    (c) => !!c.absoluteBoundingBox,
  );
  if (cells.length < 4) return null; // need at least header + 1 row × 2 cols

  // Cluster into rows by vertical bounding-box overlap. Two cells share a
  // row when their Y ranges intersect — this handles columns that aren't
  // baseline-aligned (e.g. one centered, one top-aligned) without needing a
  // tunable threshold.
  const sorted = cells
    .slice()
    .sort((a, b) => yOf(a) - yOf(b) || xOf(a) - xOf(b));

  const rows: TextNode[][] = [];
  for (const c of sorted) {
    const cTop = yOf(c);
    const cBot = cTop + (c.absoluteBoundingBox?.height ?? 0);
    let placed = false;
    for (const row of rows) {
      let rowTop = Infinity;
      let rowBot = -Infinity;
      for (const r of row) {
        rowTop = Math.min(rowTop, yOf(r));
        rowBot = Math.max(rowBot, yOf(r) + (r.absoluteBoundingBox?.height ?? 0));
      }
      if (cTop < rowBot && rowTop < cBot) {
        row.push(c);
        placed = true;
        break;
      }
    }
    if (!placed) rows.push([c]);
  }

  rows.sort((a, b) => avgY(a) - avgY(b));
  if (rows.length < 2) return null;

  for (const row of rows) row.sort((a, b) => xOf(a) - xOf(b));

  // All rows should have the same column count for a "regular" table. Some
  // tolerance: allow rows that differ by 1 (e.g. an empty trailing cell that
  // wasn't drawn) by padding with empty strings.
  const counts = rows.map((r) => r.length);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  if (maxCount < 2) return null;
  if (maxCount - minCount > 1) return null;

  const escape = (s: string): string =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/\|/g, "\\|")
      .replace(/\r?\n/g, "<br>")
      .trim();

  const padRow = (row: TextNode[]): string[] => {
    const cells = row.map((c) => escape(c.characters ?? ""));
    while (cells.length < maxCount) cells.push("");
    return cells;
  };

  const fmt = (cols: string[]) => `| ${cols.join(" | ")} |`;
  const header = padRow(rows[0]!);
  const sep = header.map(() => "---");
  const body = rows.slice(1).map((r) => fmt(padRow(r)));
  return [fmt(header), fmt(sep), ...body].join("\n");
}

function collectTextNodes(node: AnyNode): TextNode[] {
  if (node.type === "TEXT") return [node as TextNode];
  const out: TextNode[] = [];
  for (const child of node.children ?? []) {
    out.push(...collectTextNodes(child));
  }
  return out;
}

function yOf(node: TextNode): number {
  return node.absoluteBoundingBox?.y ?? 0;
}

function xOf(node: TextNode): number {
  return node.absoluteBoundingBox?.x ?? 0;
}

function avgY(row: TextNode[]): number {
  let sum = 0;
  for (const c of row) sum += yOf(c);
  return row.length === 0 ? 0 : sum / row.length;
}
