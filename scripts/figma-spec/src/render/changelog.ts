/**
 * Per-spec changelog: tracks every (branch, lastModified) pair that has
 * generated this file. Most recent entry first.
 *
 * - "Branch" = the Figma branch's display name, or "main" when generated
 *   from the main file. Branch names usually carry the task ticket so the
 *   changelog doubles as a list of tasks that touched this spec.
 * - A new row is appended only when (branch, lastModified) differs from the
 *   most recent existing row — same branch re-running the script without
 *   changing the file in Figma is not noise-worthy.
 */

export interface ChangelogEntry {
  branch: string;
  lastModified: string;
  generatedAt: string;
}

const HEADING = "## Changelog";
const TABLE_HEADER = "| Branch | Figma last modified | Generated |";
const TABLE_SEP = "| --- | --- | --- |";

/** Parse the changelog table out of a previously rendered spec, if any. */
export function parseChangelog(markdown: string): ChangelogEntry[] {
  const lines = markdown.split(/\r?\n/);
  const headingIdx = lines.findIndex((l) => l.trim() === HEADING);
  if (headingIdx === -1) return [];

  const entries: ChangelogEntry[] = [];
  for (let i = headingIdx + 1; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? "";
    if (line.startsWith("## ")) break; // hit the next H2
    if (!line.startsWith("|")) continue;
    if (line.startsWith("| ---") || line === TABLE_HEADER) continue;

    const cells = line
      .slice(1, line.endsWith("|") ? -1 : undefined)
      .split("|")
      .map((c) => c.trim());
    if (cells.length < 3) continue;
    const [branch, lastModified, generatedAt] = cells;
    if (!branch || !lastModified) continue;
    entries.push({
      branch,
      lastModified,
      generatedAt: generatedAt ?? "",
    });
  }
  return entries;
}

/**
 * Produce the new entry list. Returns the existing list unchanged when the
 * incoming run matches the most recent entry on (branch, lastModified).
 */
export function appendIfChanged(
  previous: ChangelogEntry[],
  next: ChangelogEntry,
): ChangelogEntry[] {
  const head = previous[0];
  if (head && head.branch === next.branch && head.lastModified === next.lastModified) {
    return previous;
  }
  return [next, ...previous];
}

export function emitChangelog(entries: ChangelogEntry[]): string {
  if (entries.length === 0) return "";
  const rows = entries.map(
    (e) => `| ${e.branch} | ${e.lastModified} | ${e.generatedAt} |`,
  );
  return [HEADING, "", TABLE_HEADER, TABLE_SEP, ...rows].join("\n");
}
