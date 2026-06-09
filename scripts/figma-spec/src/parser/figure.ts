import type { AnyNode, TextNode } from "../figma/types.ts";
import { slugifyName } from "../figma/url.ts";
import { byCanvasY, getDirectTextChildren, getSpecSections } from "./walk.ts";

export const FIG_PREFIX = "fig::";
const VALID_SLUG_RE = /^[\w-]+$/;

export interface FigureFrame {
  slug: string;
  /** Slug of the H2 section this figure belongs to. Used to disambiguate
   *  duplicate slugs across different sections (artboards). */
  sectionSlug: string;
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
  for (const section of sections) {
    // Dedup per-section only: the same slug can appear in different sections
    // (e.g. `fig::floating-panel` in both Typology and Tokens) and each is a
    // distinct figure with its own image.
    const seenInSection = new Set<string>();
    for (const fig of getFigureFramesInSection(section, warnings)) {
      if (seenInSection.has(fig.slug)) {
        warnings.push(
          `Duplicate figure slug "${fig.slug}" within section "${section.name}" — only the first occurrence will be exported.`,
        );
        continue;
      }
      seenInSection.add(fig.slug);
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
  const sectionSlug = slugifyName(section.name);
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
      sectionSlug,
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
