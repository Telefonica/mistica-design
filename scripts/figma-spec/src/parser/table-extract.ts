/**
 * Reconstruct a markdown table from a Figma frame's node tree, without OCR.
 *
 * Approach: collect every TEXT descendant of the table frame, cluster them
 * into rows by Y position, then assign each cell to a column based on
 * X-position proximity to the widest row's anchors. This bypasses OCR
 * entirely (no rate limits, no provider cost, exact text). Falls back
 * gracefully — returns null if the frame's structure doesn't look like a
 * regular grid, in which case the caller can drop down to the OCR pipeline.
 *
 * Handles "sparse" rows where some columns are empty (e.g. a header row
 * with 5 columns but a body row only filling 2 of them) by snapping each
 * cell to its nearest column and leaving the rest blank.
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

  // Pick the widest row to anchor the columns. For tables where some rows
  // are sparse (only fill a subset of columns), the widest row reveals the
  // full column layout.
  let widestRow = rows[0]!;
  for (const row of rows) {
    if (row.length > widestRow.length) widestRow = row;
  }
  const nCols = widestRow.length;
  if (nCols < 2) return null;
  const columnAnchors = widestRow.map((c) => xOf(c));

  // Reject if cells can't be confidently assigned: each cell's nearest
  // column anchor must be closer than the gap to the next anchor. Use half
  // the minimum inter-anchor gap as the tolerance.
  const anchorGaps: number[] = [];
  for (let i = 1; i < nCols; i++) {
    anchorGaps.push(columnAnchors[i]! - columnAnchors[i - 1]!);
  }
  const minGap = anchorGaps.length ? Math.min(...anchorGaps) : Infinity;
  const tolerance = minGap === Infinity ? Infinity : minGap;

  const escape = (s: string): string =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/\|/g, "\\|")
      .replace(/\r?\n/g, "<br>")
      .trim();

  const grid: string[][] = [];
  for (const row of rows) {
    const cols: string[] = new Array(nCols).fill("");
    for (const cell of row) {
      const x = xOf(cell);
      let best = 0;
      let bestDist = Math.abs(x - columnAnchors[0]!);
      for (let i = 1; i < nCols; i++) {
        const d = Math.abs(x - columnAnchors[i]!);
        if (d < bestDist) {
          best = i;
          bestDist = d;
        }
      }
      if (bestDist > tolerance) return null; // cell doesn't fit any column
      const text = escape(cell.characters ?? "");
      cols[best] = cols[best] ? `${cols[best]} ${text}` : text;
    }
    grid.push(cols);
  }

  const fmt = (cols: string[]) => `| ${cols.join(" | ")} |`;
  const header = grid[0]!;
  const sep = header.map(() => "---");
  const body = grid.slice(1).map(fmt);
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
