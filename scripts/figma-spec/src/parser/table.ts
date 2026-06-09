import type { AnyNode } from "../figma/types.ts";
import { slugifyName } from "../figma/url.ts";
import { getSpecSections } from "./walk.ts";

export const TABLE_PREFIX = "table::";
const VALID_SLUG_RE = /^[\w-]+$/;

export interface TableFrame {
  slug: string;
  /** Slug of the H2 section this table belongs to. Used to disambiguate
   *  duplicate slugs across different sections (artboards). */
  sectionSlug: string;
  nodeId: string;
  y: number;
  node: AnyNode;
}

export function isTableFrame(node: AnyNode): boolean {
  return typeof node.name === "string" && node.name.startsWith(TABLE_PREFIX);
}

export function extractTableSlug(node: AnyNode): string | null {
  if (!isTableFrame(node)) return null;
  const slug = node.name.slice(TABLE_PREFIX.length).trim();
  return VALID_SLUG_RE.test(slug) ? slug : null;
}

export function getTableFramesInSection(
  section: AnyNode,
  warnings: string[] = [],
): TableFrame[] {
  const children = section.children ?? [];
  const sectionSlug = slugifyName(section.name);
  const tables: TableFrame[] = [];
  for (const child of children) {
    if (!isTableFrame(child)) continue;
    const slug = extractTableSlug(child);
    if (!slug) {
      warnings.push(
        `Frame "${child.name}" looks like a table but its slug is invalid (must match [\\w-]+).`,
      );
      continue;
    }
    tables.push({
      slug,
      sectionSlug,
      nodeId: child.id,
      y: child.absoluteBoundingBox?.y ?? 0,
      node: child,
    });
  }
  return tables.slice().sort((a, b) => a.y - b.y);
}

export function getAllTableFrames(
  page: AnyNode,
  warnings: string[] = [],
): TableFrame[] {
  const sections = getSpecSections(page);
  const all: TableFrame[] = [];
  for (const section of sections) {
    // Dedup per-section only: the same slug can appear in different sections
    // and each is a distinct table.
    const seenInSection = new Set<string>();
    for (const t of getTableFramesInSection(section, warnings)) {
      if (seenInSection.has(t.slug)) {
        warnings.push(
          `Duplicate table slug "${t.slug}" within section "${section.name}" — only the first occurrence will be exported.`,
        );
        continue;
      }
      seenInSection.add(t.slug);
      all.push(t);
    }
  }
  return all;
}
