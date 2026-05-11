export interface ParsedFigmaUrl {
  fileKey: string;
  pageId: string;
}

const FIGMA_PATH_KINDS = new Set([
  "design",
  "file",
  "board",
  "slides",
  "make",
]);

export function looksLikeFigmaUrl(input: string): boolean {
  return /^https?:\/\//i.test(input);
}

export function parseFigmaUrl(input: string): ParsedFigmaUrl | null {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (!/(^|\.)figma\.com$/.test(url.hostname)) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  // Expected forms:
  //   <kind>/<fileKey>/<fileName>
  //   <kind>/<fileKey>/branch/<branchKey>/<fileName>
  const kind = segments[0];
  if (!kind || !FIGMA_PATH_KINDS.has(kind)) return null;

  let fileKey = segments[1];
  if (!fileKey) return null;
  if (segments[2] === "branch" && segments[3]) {
    // Branch URLs route through the branch's own fileKey.
    fileKey = segments[3];
  }

  const nodeId = url.searchParams.get("node-id");
  if (!nodeId) return null;
  return { fileKey, pageId: nodeId };
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
