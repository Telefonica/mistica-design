import type { TextNode } from "../figma/types.ts";

export interface LinkRun {
  /** Start index in `characters` (inclusive). */
  start: number;
  /** End index in `characters` (exclusive). */
  end: number;
  url: string;
}

/**
 * Extracts hyperlink runs from a text node's character style overrides.
 *
 * Consecutive characters that share the same override key resolving to a
 * URL hyperlink are merged into a single run. Adjacent runs with the same
 * URL are also merged.
 *
 * Returns an empty array when the node carries no hyperlink data.
 */
export function extractLinkRuns(node: TextNode): LinkRun[] {
  const overrides = node.characterStyleOverrides;
  const table = node.styleOverrideTable;
  if (!overrides || !table || overrides.length === 0) return [];

  const runs: LinkRun[] = [];
  let current: LinkRun | null = null;

  for (let i = 0; i < overrides.length; i++) {
    const key = overrides[i] ?? 0;
    const url = key !== 0 ? (table[key]?.hyperlink?.url ?? null) : null;

    if (url !== null) {
      if (current && current.url === url) {
        // Extend the existing run.
        current.end = i + 1;
      } else {
        // Start a new run.
        current = { start: i, end: i + 1, url };
        runs.push(current);
      }
    } else {
      current = null;
    }
  }

  return runs;
}

/**
 * Returns a slice of `node.characters` starting at `startOffset` with every
 * hyperlinked run replaced by a Markdown inline link `[anchor text](url)`.
 *
 * `startOffset` is used to skip the heading title line so that URL slashes
 * in link hrefs do not interfere with `PATH_SEPARATOR_RE` in the H3 parser.
 * Runs that begin before `startOffset` are excluded entirely — a link that
 * straddles the heading/body boundary is unusual and not worth preserving.
 *
 * When there are no qualifying runs the plain slice is returned unchanged.
 */
export function renderCharactersWithLinks(
  node: TextNode,
  startOffset = 0,
): string {
  const full = node.characters ?? "";
  const text = full.slice(startOffset);
  const runs = extractLinkRuns(node)
    .filter((r) => r.start >= startOffset)
    .map((r) => ({ start: r.start - startOffset, end: r.end - startOffset, url: r.url }));

  if (runs.length === 0) return text;

  // Apply substitutions back-to-front to avoid index drift.
  let result = text;
  for (let i = runs.length - 1; i >= 0; i--) {
    const run = runs[i]!;
    const anchor = result.slice(run.start, run.end);
    const replacement = `[${anchor}](${run.url})`;
    result = result.slice(0, run.start) + replacement + result.slice(run.end);
  }
  return result;
}
