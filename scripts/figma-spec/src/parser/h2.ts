import type { AnyNode } from "../figma/types.ts";

export function emitH2(section: AnyNode): string {
  return `## ${section.name.trim()}`;
}
