/**
 * A markdown table needs at least:
 *   - a header row containing |
 *   - a separator row of the form | --- | --- | (dashes, optional colons)
 *   - one body row
 */
const SEPARATOR_RE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;

export function isValidMarkdownTable(content: string): boolean {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 3) return false;

  let separatorIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line && SEPARATOR_RE.test(line)) {
      separatorIdx = i;
      break;
    }
  }
  if (separatorIdx === -1) return false;

  const header = lines[separatorIdx - 1];
  if (!header || !header.includes("|")) return false;

  const bodyRows = lines.slice(separatorIdx + 1).filter((l) => l.includes("|"));
  return bodyRows.length >= 1;
}

/**
 * Strip code fences and surrounding chatter so we keep only the table portion.
 */
export function cleanMarkdownTable(raw: string): string {
  let s = raw.trim();
  // Strip ```markdown / ``` fences.
  s = s.replace(/^```(?:\w+)?\s*\n?/i, "").replace(/\n?```$/i, "");
  // Drop any leading non-table chatter — keep from first line containing "|".
  const lines = s.split(/\r?\n/);
  const start = lines.findIndex((l) => l.includes("|"));
  if (start === -1) return s.trim();
  let end = lines.length;
  for (let i = lines.length - 1; i >= start; i--) {
    const line = lines[i];
    if (line && line.includes("|")) {
      end = i + 1;
      break;
    }
  }
  return lines.slice(start, end).join("\n").trim();
}
