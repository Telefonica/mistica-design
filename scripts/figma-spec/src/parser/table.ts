import type { AnyNode } from "../figma/types.ts";
import { getSpecSections } from "./walk.ts";

export const TABLE_PREFIX = "table::";
const VALID_SLUG_RE = /^[\w-]+$/;

export interface TableFrame {
  slug: string;
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
  const seen = new Set<string>();
  for (const section of sections) {
    for (const t of getTableFramesInSection(section, warnings)) {
      if (seen.has(t.slug)) {
        warnings.push(
          `Duplicate table slug "${t.slug}" — only the first occurrence will be exported.`,
        );
        continue;
      }
      seen.add(t.slug);
      all.push(t);
    }
  }
  return all;
}
