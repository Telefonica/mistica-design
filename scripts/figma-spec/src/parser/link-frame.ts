import type { AnyNode } from "../figma/types.ts";
import { slugifyName } from "../figma/url.ts";
import { byCanvasY, getDirectTextChildren, getSpecSections, isTextNode } from "./walk.ts";
import { renderCharactersWithLinks } from "./link.ts";

export const LINK_PREFIX = "link::";
const VALID_SLUG_RE = /^[\w-]+$/;

export interface LinkFrame {
  slug: string;
  /** Slug of the H2 section this link belongs to. */
  sectionSlug: string;
  nodeId: string;
  /** Canvas Y used to interleave with H3 blocks and tables. */
  y: number;
  /**
   * Rendered Markdown text extracted from the frame's text node.
   * Hyperlinked runs are already converted to `[text](url)`.
   * Empty string when the frame has no readable text.
   */
  text: string;
  node: AnyNode;
}

export function isLinkFrame(node: AnyNode): boolean {
  return typeof node.name === "string" && node.name.startsWith(LINK_PREFIX);
}

export function extractLinkFrameSlug(node: AnyNode): string | null {
  if (!isLinkFrame(node)) return null;
  const slug = node.name.slice(LINK_PREFIX.length).trim();
  return VALID_SLUG_RE.test(slug) ? slug : null;
}

/**
 * Extracts the rendered text from a link node.
 *
 * Supports two Figma authoring patterns:
 * - A TEXT node named `link::<slug>` directly (the node itself carries the
 *   text and hyperlink data).
 * - A FRAME named `link::<slug>` that contains one or more TEXT children
 *   (the first child by canvas Y is used).
 */
function extractLinkText(node: AnyNode): string {
  if (isTextNode(node)) {
    return renderCharactersWithLinks(node).trim();
  }
  const texts = getDirectTextChildren(node).slice().sort(byCanvasY);
  if (texts.length === 0) return "";
  return renderCharactersWithLinks(texts[0]!).trim();
}

export function getLinkFramesInSection(
  section: AnyNode,
  warnings: string[] = [],
): LinkFrame[] {
  const children = section.children ?? [];
  const sectionSlug = slugifyName(section.name);
  const links: LinkFrame[] = [];

  for (const child of children) {
    if (!isLinkFrame(child)) continue;
    const slug = extractLinkFrameSlug(child);
    if (!slug) {
      warnings.push(
        `Frame "${child.name}" looks like a link but its slug is invalid (must match [\\w-]+).`,
      );
      continue;
    }
    const text = extractLinkText(child);
    if (!text) {
      warnings.push(
        `Link frame "${child.name}" in section "${section.name}" has no readable text — skipping.`,
      );
      continue;
    }
    links.push({
      slug,
      sectionSlug,
      nodeId: child.id,
      y: child.absoluteBoundingBox?.y ?? 0,
      text,
      node: child,
    });
  }

  return links.slice().sort((a, b) => a.y - b.y);
}

export function getAllLinkFrames(
  page: AnyNode,
  warnings: string[] = [],
): LinkFrame[] {
  const sections = getSpecSections(page);
  const all: LinkFrame[] = [];

  for (const section of sections) {
    const seenInSection = new Set<string>();
    for (const link of getLinkFramesInSection(section, warnings)) {
      if (seenInSection.has(link.slug)) {
        warnings.push(
          `Duplicate link slug "${link.slug}" within section "${section.name}" — only the first occurrence will be rendered.`,
        );
        continue;
      }
      seenInSection.add(link.slug);
      all.push(link);
    }
  }

  return all;
}

/**
 * Emits a standalone link frame as a Markdown blockquote.
 *
 * Example output:
 * ```
 * > See also: [Menu component specs](https://figma.com/…)
 * ```
 *
 * When the text already contains a Markdown link the label is used as-is.
 * When it contains plain text with no link markup a warning is added and
 * the text is still emitted so the author can fix it in Figma.
 */
export function emitLinkFrame(frame: LinkFrame, warnings: string[]): string {
  const hasLink = frame.text.includes("](");
  if (!hasLink) {
    warnings.push(
      `Link frame "link::${frame.slug}" in section "${frame.sectionSlug}" has text but no hyperlink set in Figma — the output will be plain text.`,
    );
  }
  return `> See also: ${frame.text}`;
}
