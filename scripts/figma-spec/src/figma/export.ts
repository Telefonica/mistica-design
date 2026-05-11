import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { FigmaClient, FigmaError } from "./client.ts";

export interface FigureExportRequest {
  slug: string;
  nodeId: string;
}

export interface FigureExportResult {
  slug: string;
  nodeId: string;
  /** Relative to outputDir, suitable for use as a Markdown image src. */
  relativePath: string;
  /** Absolute filesystem path. */
  destPath: string;
}

export interface ExportFiguresOptions {
  client: FigmaClient;
  fileKey: string;
  componentSlug: string;
  outputDirAbs: string;
  figures: FigureExportRequest[];
  scale?: number;
  warnings?: string[];
}

export async function exportFigures(
  opts: ExportFiguresOptions,
): Promise<FigureExportResult[]> {
  const { client, fileKey, componentSlug, outputDirAbs, figures } = opts;
  const warnings = opts.warnings ?? [];
  if (figures.length === 0) return [];

  const figuresDirAbs = resolve(outputDirAbs, componentSlug, "figures");
  await mkdir(figuresDirAbs, { recursive: true });

  const ids = figures.map((f) => f.nodeId);
  const images = await client.getImages(fileKey, ids, {
    format: "png",
    scale: opts.scale ?? 2,
  });

  const results: FigureExportResult[] = [];
  for (const fig of figures) {
    const url = images[fig.nodeId];
    if (!url) {
      warnings.push(
        `Figma did not return an image URL for fig::${fig.slug} (${fig.nodeId}).`,
      );
      continue;
    }
    let buf: Buffer;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new FigmaError(
          `Image download for fig::${fig.slug} returned ${res.status}`,
          res.status,
        );
      }
      buf = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      warnings.push(
        `Could not download fig::${fig.slug}: ${(err as Error).message}`,
      );
      continue;
    }
    const filename = `${fig.slug}.png`;
    const destPath = resolve(figuresDirAbs, filename);
    await writeFile(destPath, buf);
    results.push({
      slug: fig.slug,
      nodeId: fig.nodeId,
      destPath,
      relativePath: `${componentSlug}/figures/${filename}`,
    });
  }
  return results;
}

export interface TableExportRequest {
  slug: string;
  nodeId: string;
}

export interface TableExportResult {
  slug: string;
  nodeId: string;
  /** Absolute path to the cached PNG, used as input for OCR. */
  destPath: string;
}

export interface ExportTablesOptions {
  client: FigmaClient;
  fileKey: string;
  cacheDirAbs: string;
  tables: TableExportRequest[];
  scale?: number;
  warnings?: string[];
}

export async function exportTables(
  opts: ExportTablesOptions,
): Promise<TableExportResult[]> {
  const { client, fileKey, cacheDirAbs, tables } = opts;
  const warnings = opts.warnings ?? [];
  if (tables.length === 0) return [];

  await mkdir(cacheDirAbs, { recursive: true });

  const ids = tables.map((t) => t.nodeId);
  const images = await client.getImages(fileKey, ids, {
    format: "png",
    scale: opts.scale ?? 2,
  });

  const results: TableExportResult[] = [];
  for (const t of tables) {
    const url = images[t.nodeId];
    if (!url) {
      warnings.push(
        `Figma did not return an image URL for table::${t.slug} (${t.nodeId}).`,
      );
      continue;
    }
    let buf: Buffer;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new FigmaError(
          `Image download for table::${t.slug} returned ${res.status}`,
          res.status,
        );
      }
      buf = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      warnings.push(
        `Could not download table::${t.slug}: ${(err as Error).message}`,
      );
      continue;
    }
    const destPath = resolve(cacheDirAbs, `${t.slug}.png`);
    await writeFile(destPath, buf);
    results.push({ slug: t.slug, nodeId: t.nodeId, destPath });
  }
  return results;
}
