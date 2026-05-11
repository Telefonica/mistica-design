import type { AnyNode, TextNode } from "../figma/types.ts";

export const SPECS_HEADER_NAME = "Specs Header";

export function isSpecSection(node: AnyNode): boolean {
  if (!node.children || node.children.length === 0) return false;
  return node.children.some((child) => child.name === SPECS_HEADER_NAME);
}

export function getSpecSections(page: AnyNode): AnyNode[] {
  const children = page.children ?? [];
  return children
    .filter(isSpecSection)
    .slice()
    .sort(byCanvasY);
}

export function byCanvasY(a: AnyNode, b: AnyNode): number {
  const ay = a.absoluteBoundingBox?.y ?? 0;
  const by = b.absoluteBoundingBox?.y ?? 0;
  return ay - by;
}

export function isTextNode(node: AnyNode): node is TextNode {
  return node.type === "TEXT";
}

export function getDirectTextChildren(frame: AnyNode): TextNode[] {
  const children = frame.children ?? [];
  return children.filter(isTextNode);
}
