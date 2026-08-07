import type { AnyNode, LineType, TextNode } from "../figma/types.ts";
import { byCanvasY, getDirectTextChildren, SPECS_HEADER_NAME } from "./walk.ts";
import { renderCharactersWithLinks } from "./link.ts";
import { LINK_PREFIX } from "./link-frame.ts";

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
    .filter((node) => !node.name.startsWith(LINK_PREFIX))
    .filter((node) => {
      const x = node.absoluteBoundingBox?.x;
      return typeof x === "number" && x < PROSE_X_THRESHOLD;
    })
    .slice()
    .sort(byCanvasY);
}

export function toH3Block(node: TextNode): H3Block {
  // Use the raw characters for the heading title so that PATH_SEPARATOR_RE
  // is never confused by `/` characters inside Markdown link URLs.
  const raw = node.characters ?? "";
  const rawLines = raw.split("\n");
  if (rawLines.length === 0) return { level: 3, title: "", pathSegments: [], body: "", node };

  const firstLine = (rawLines[0] ?? "").trim();
  const segments = firstLine.split(PATH_SEPARATOR_RE).map((s) => s.trim()).filter(Boolean);
  const depth = Math.max(1, segments.length);
  const level = Math.min(6, 2 + depth);
  const title = segments[segments.length - 1] ?? firstLine;
  const pathSegments = segments.length > 0 ? segments : [title];

  if (rawLines.length === 1) return { level, title, pathSegments, body: "", node };

  // Render body lines with hyperlink substitution. The offset skips past the
  // heading line (its length + 1 for the newline character) so that run
  // indices from characterStyleOverrides remain accurate.
  const headingByteLen = (rawLines[0] ?? "").length + 1;
  const bodyText = renderCharactersWithLinks(node, headingByteLen);
  const bodyLines = bodyText.split("\n");

  const types = node.lineTypes ?? [];
  const indents = node.lineIndentations ?? [];
  const formattedLines = bodyLines.map((line, i) => {
    const idx = i + 1; // +1 because line 0 is the heading
    return formatBodyLine(line, types[idx] ?? "NONE", indents[idx] ?? 0);
  });
  const body = formattedLines.join("\n").replace(/\s+$/u, "");
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
