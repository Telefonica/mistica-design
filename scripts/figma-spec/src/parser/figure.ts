import type { AnyNode, TextNode } from "../figma/types.ts";
import { byCanvasY, getDirectTextChildren, getSpecSections } from "./walk.ts";

export const FIG_PREFIX = "fig::";
const VALID_SLUG_RE = /^[\w-]+$/;

export interface FigureFrame {
  slug: string;
  nodeId: string;
  caption: string;
  node: AnyNode;
}

export function isFigureFrame(node: AnyNode): boolean {
  return typeof node.name === "string" && node.name.startsWith(FIG_PREFIX);
}

export function extractFigureSlug(node: AnyNode): string | null {
  if (!isFigureFrame(node)) return null;
  const slug = node.name.slice(FIG_PREFIX.length).trim();
  return VALID_SLUG_RE.test(slug) ? slug : null;
}

export function extractCaption(frame: AnyNode): string {
  const texts: TextNode[] = getDirectTextChildren(frame).slice().sort(byCanvasY);
  return texts
    .map((t) => (t.characters ?? "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAllFigureFrames(
  page: AnyNode,
  warnings: string[] = [],
): FigureFrame[] {
  const sections: AnyNode[] = getSpecSections(page);
  const all: FigureFrame[] = [];
  const seen = new Set<string>();
  for (const section of sections) {
    for (const fig of getFigureFramesInSection(section, warnings)) {
      if (seen.has(fig.slug)) {
        warnings.push(
          `Duplicate figure slug "${fig.slug}" — only the first occurrence will be exported.`,
        );
        continue;
      }
      seen.add(fig.slug);
      all.push(fig);
    }
  }
  return all;
}

export function getFigureFramesInSection(
  section: AnyNode,
  warnings: string[] = [],
): FigureFrame[] {
  const children = section.children ?? [];
  const figs: FigureFrame[] = [];
  for (const child of children) {
    if (!isFigureFrame(child)) continue;
    const slug = extractFigureSlug(child);
    if (!slug) {
      warnings.push(
        `Frame "${child.name}" looks like a figure but its slug is invalid (must match [\\w-]+).`,
      );
      continue;
    }
    figs.push({
      slug,
      nodeId: child.id,
      caption: extractCaption(child),
      node: child,
    });
  }
  return figs.slice().sort((a, b) => {
    const ay = a.node.absoluteBoundingBox?.y ?? 0;
    const by = b.node.absoluteBoundingBox?.y ?? 0;
    return ay - by;
  });
}
