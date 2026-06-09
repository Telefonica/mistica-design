import type { AnyNode, LineType, TextNode } from "../figma/types.ts";
import { byCanvasY, getDirectTextChildren, SPECS_HEADER_NAME } from "./walk.ts";

const PROSE_X_THRESHOLD = 900;

export interface H3Block {
  /** Heading level: 3 for `### …`, 4 for `#### …`, capped at 6. */
  level: number;
  /** Last segment of the path — the rendered heading text. */
  title: string;
  /**
   * All path segments parsed from the heading. For a node titled
   * `Default/Header` this is `["Default", "Header"]`, used to match
   * figures whose slug encodes the full path (e.g. `fig::default-header`).
   */
  pathSegments: string[];
  body: string;
  node: TextNode;
}

/**
 * Splits a heading path on bare `/` (no whitespace on either side).
 * `Body region/Section item` → ["Body region", "Section item"]
 * `Collapse / Uncollapse`    → ["Collapse / Uncollapse"]  (preserved)
 */
const PATH_SEPARATOR_RE = /(?<!\s)\/(?!\s)/;

export function getH3TextNodes(section: AnyNode): TextNode[] {
  return getDirectTextChildren(section)
    .filter((node) => node.name !== SPECS_HEADER_NAME)
    .filter((node) => {
      const x = node.absoluteBoundingBox?.x;
      return typeof x === "number" && x < PROSE_X_THRESHOLD;
    })
    .slice()
    .sort(byCanvasY);
}

export function toH3Block(node: TextNode): H3Block {
  const raw = node.characters ?? "";
  const lines = raw.split("\n");
  if (lines.length === 0) return { level: 3, title: "", pathSegments: [], body: "", node };

  const firstLine = (lines[0] ?? "").trim();
  const segments = firstLine.split(PATH_SEPARATOR_RE).map((s) => s.trim()).filter(Boolean);
  const depth = Math.max(1, segments.length);
  const level = Math.min(6, 2 + depth);
  const title = segments[segments.length - 1] ?? firstLine;
  const pathSegments = segments.length > 0 ? segments : [title];

  if (lines.length === 1) return { level, title, pathSegments, body: "", node };

  const types = node.lineTypes ?? [];
  const indents = node.lineIndentations ?? [];
  const bodyLines = lines.slice(1).map((line, i) => {
    const idx = i + 1;
    return formatBodyLine(line, types[idx] ?? "NONE", indents[idx] ?? 0);
  });
  const body = bodyLines.join("\n").replace(/\s+$/u, "");
  return { level, title, pathSegments, body, node };
}

function formatBodyLine(line: string, type: LineType, indent: number): string {
  if (line === "") return line;
  if (type === "NONE") return line;
  // Figma reports the first level of a list as indent=1, so subtract one to
  // produce idiomatic Markdown where top-level bullets sit at column zero.
  const pad = "  ".repeat(Math.max(0, indent - 1));
  const marker = type === "ORDERED" ? "1." : "-";
  return `${pad}${marker} ${line}`;
}

export function emitH3(block: H3Block): string {
  const hashes = "#".repeat(block.level);
  const heading = `${hashes} ${block.title}`;
  if (!block.body) return heading;
  return `${heading}\n\n${block.body}`;
}
