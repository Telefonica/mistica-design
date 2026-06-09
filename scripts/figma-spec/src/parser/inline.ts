export interface FigureRef {
  slug: string;
  caption: string;
  relativePath: string;
}

const INLINE_FIG_RE = /\(fig\.\s*([\w-]+)\)/g;

export function emitFigure(ref: FigureRef): string {
  if (!ref.caption) {
    return `![${ref.slug}](${ref.relativePath})`;
  }
  return `![${ref.caption}](${ref.relativePath})\n\n*${ref.caption}*`;
}

export function replaceInlineFigures(
  body: string,
  figuresByKey: Map<string, FigureRef>,
  sectionSlug: string,
  consumed: Set<string>,
  warnings: string[],
): string {
  return body.replace(INLINE_FIG_RE, (match, slug: string) => {
    const key = `${sectionSlug}::${slug}`;
    const fig = figuresByKey.get(key);
    if (!fig) {
      warnings.push(
        `Inline marker (fig. ${slug}) has no matching fig::${slug} frame in section "${sectionSlug}".`,
      );
      return match;
    }
    if (consumed.has(key)) {
      warnings.push(
        `Inline marker (fig. ${slug}) appears more than once; figure will be embedded twice.`,
      );
    }
    consumed.add(key);
    return `\n\n${emitFigure(fig)}\n\n`;
  });
}
