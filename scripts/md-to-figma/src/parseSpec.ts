import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Root, RootContent, Image, Paragraph, Table } from "mdast";
import type { SpecBlock, SpecDocument, SpecSection } from "./types.ts";

const CHANGELOG_HEADING = "changelog";

function isImageOnlyParagraph(node: RootContent): node is Paragraph {
  return (
    node.type === "paragraph" &&
    node.children.length === 1 &&
    node.children[0]?.type === "image"
  );
}

function isEmphasisOnlyParagraph(node: RootContent): boolean {
  return (
    node.type === "paragraph" &&
    node.children.length === 1 &&
    node.children[0]?.type === "emphasis"
  );
}

function tableToRows(node: Table): string[][] {
  return node.children.map((row) =>
    row.children.map((cell) => mdastToString(cell).trim()),
  );
}

function newBlock(heading?: string): SpecBlock {
  return { heading, body: [], figures: [], table: undefined };
}

/**
 * Parses a figma-spec-generated markdown file (H2 sections, H3/H4 prose
 * blocks, inline figures, GFM tables) into structured JSON. The Changelog
 * section is dropped — it documents the generation pipeline, not the
 * component's design.
 */
export function parseSpecMarkdown(markdown: string): SpecDocument {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;

  let title = "";
  const sections: SpecSection[] = [];
  let currentSection: SpecSection | null = null;
  let currentBlock: SpecBlock | null = null;
  let previousWasFigure = false;

  function flushBlock() {
    if (currentSection && currentBlock) {
      currentSection.blocks.push(currentBlock);
    }
    currentBlock = null;
  }

  function ensureBlock(): SpecBlock {
    if (!currentBlock) {
      currentBlock = newBlock();
    }
    return currentBlock;
  }

  for (const node of tree.children) {
    if (node.type === "html") {
      // Generated-by comment or other raw HTML — not design content.
      previousWasFigure = false;
      continue;
    }

    if (node.type === "heading" && node.depth === 1) {
      title = mdastToString(node).trim();
      previousWasFigure = false;
      continue;
    }

    if (node.type === "heading" && node.depth === 2) {
      flushBlock();
      const heading = mdastToString(node).trim();
      if (heading.toLowerCase() === CHANGELOG_HEADING) {
        currentSection = null; // skip content until the next H2
      } else {
        currentSection = { heading, blocks: [] };
        sections.push(currentSection);
      }
      previousWasFigure = false;
      continue;
    }

    if (!currentSection) {
      // Inside a skipped section (e.g. Changelog) — ignore everything.
      continue;
    }

    if (node.type === "heading" && node.depth >= 3) {
      flushBlock();
      currentBlock = newBlock(mdastToString(node).trim());
      previousWasFigure = false;
      continue;
    }

    if (isImageOnlyParagraph(node)) {
      const image = node.children[0] as Image;
      ensureBlock().figures.push({ caption: image.alt ?? "", src: image.url });
      previousWasFigure = true;
      continue;
    }

    if (isEmphasisOnlyParagraph(node) && previousWasFigure) {
      // Italic caption line echoing the figure's alt text — already captured.
      previousWasFigure = false;
      continue;
    }

    if (node.type === "table") {
      ensureBlock().table = tableToRows(node as Table);
      previousWasFigure = false;
      continue;
    }

    if (node.type === "list") {
      const block = ensureBlock();
      for (const item of node.children) {
        const text = mdastToString(item).trim();
        if (text) block.body.push(`- ${text}`);
      }
      previousWasFigure = false;
      continue;
    }

    // Regular prose (paragraph, blockquote, etc.) — flatten to text.
    const text = mdastToString(node).trim();
    if (text) {
      ensureBlock().body.push(text);
    }
    previousWasFigure = false;
  }
  flushBlock();

  return { title, sections };
}
