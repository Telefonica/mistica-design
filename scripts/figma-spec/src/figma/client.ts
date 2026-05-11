import type { FilesNodesResponse, AnyNode } from "./types.ts";

const FIGMA_API = "https://api.figma.com";

export interface FileMeta {
  /** File or branch display name. */
  name: string;
  /** ISO-8601 timestamp of the last change. */
  lastModified: string;
  /** Present only when the file is a Figma branch — points to its parent. */
  mainFileKey?: string;
}

export class FigmaError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: string,
  ) {
    super(message);
    this.name = "FigmaError";
  }
}

export class FigmaClient {
  constructor(private readonly token: string) {
    if (!token) throw new FigmaError("FIGMA_TOKEN is required");
  }

  async getNodes(fileKey: string, ids: string[]): Promise<FilesNodesResponse> {
    if (ids.length === 0) throw new FigmaError("ids must not be empty");
    const url = new URL(`${FIGMA_API}/v1/files/${fileKey}/nodes`);
    url.searchParams.set("ids", ids.join(","));
    const res = await fetch(url, {
      headers: { "X-Figma-Token": this.token },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new FigmaError(
        `Figma API ${res.status} ${res.statusText} for ${fileKey}`,
        res.status,
        body,
      );
    }
    return (await res.json()) as FilesNodesResponse;
  }

  async getFileMeta(fileKey: string): Promise<FileMeta> {
    const url = new URL(`${FIGMA_API}/v1/files/${fileKey}`);
    // depth=1 keeps the payload tiny — we only need top-level fields.
    url.searchParams.set("depth", "1");
    const res = await fetch(url, {
      headers: { "X-Figma-Token": this.token },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new FigmaError(
        `Figma API ${res.status} ${res.statusText} for file meta ${fileKey}`,
        res.status,
        body,
      );
    }
    const data = (await res.json()) as {
      name?: string;
      lastModified?: string;
      mainFileKey?: string;
    };
    return {
      name: data.name ?? "",
      lastModified: data.lastModified ?? "",
      mainFileKey: data.mainFileKey,
    };
  }

  async getPageDocument(fileKey: string, pageId: string): Promise<AnyNode> {
    const response = await this.getNodes(fileKey, [pageId]);
    const entry = response.nodes[pageId];
    if (!entry) {
      throw new FigmaError(
        `Page node ${pageId} not found in file ${fileKey}`,
      );
    }
    return entry.document;
  }

  async getImages(
    fileKey: string,
    ids: string[],
    opts: { scale?: number; format?: "png" | "jpg" | "svg" | "pdf" } = {},
  ): Promise<Record<string, string | null>> {
    if (ids.length === 0) return {};
    const url = new URL(`${FIGMA_API}/v1/images/${fileKey}`);
    url.searchParams.set("ids", ids.join(","));
    url.searchParams.set("format", opts.format ?? "png");
    url.searchParams.set("scale", String(opts.scale ?? 2));
    const res = await fetch(url, {
      headers: { "X-Figma-Token": this.token },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new FigmaError(
        `Figma images API ${res.status} ${res.statusText} for ${fileKey}`,
        res.status,
        body,
      );
    }
    const data = (await res.json()) as {
      images?: Record<string, string | null>;
      err?: string | null;
    };
    if (data.err) {
      throw new FigmaError(`Figma images API error: ${data.err}`);
    }
    return data.images ?? {};
  }
}

export function normalizeNodeId(id: string): string {
  // Figma URLs use "12-34", API expects "12:34".
  return id.includes(":") ? id : id.replace(/-/g, ":");
}
