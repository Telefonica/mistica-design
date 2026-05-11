import type { OcrEngine } from "./interface.ts";
import { GeminiOcrEngine } from "./gemini.ts";
import { TesseractOcrEngine } from "./tesseract.ts";

export interface OcrOrchestratorOptions {
  geminiApiKey?: string;
  /** Override engines (mainly for testing). */
  engines?: OcrEngine[];
}

export interface OcrAttempt {
  engine: string;
  ok: boolean;
}

export interface OcrResult {
  /** Final markdown — either a real table or an HTML comment fallback. */
  rendered: string;
  ok: boolean;
  attempts: OcrAttempt[];
  engineUsed?: string;
}

export class OcrOrchestrator {
  private readonly engines: OcrEngine[];

  constructor(opts: OcrOrchestratorOptions = {}) {
    if (opts.engines) {
      this.engines = opts.engines;
    } else {
      const list: OcrEngine[] = [];
      if (opts.geminiApiKey) {
        list.push(new GeminiOcrEngine(opts.geminiApiKey));
      }
      list.push(new TesseractOcrEngine());
      this.engines = list;
    }
  }

  async extractTable(slug: string, pngPath: string): Promise<OcrResult> {
    const attempts: OcrAttempt[] = [];
    for (const engine of this.engines) {
      const md = await engine.extractTable(pngPath);
      const ok = md !== null;
      attempts.push({ engine: engine.name, ok });
      if (ok && md) {
        return {
          rendered: md,
          ok: true,
          attempts,
          engineUsed: engine.name,
        };
      }
    }
    return {
      rendered: buildFallbackComment(slug, pngPath, attempts),
      ok: false,
      attempts,
    };
  }
}

function buildFallbackComment(
  slug: string,
  pngPath: string,
  attempts: OcrAttempt[],
): string {
  const tried = attempts.map((a) => a.engine).join(", ") || "(none)";
  return [
    "<!--",
    `  table::${slug} — OCR failed (engines tried: ${tried}).`,
    `  Source PNG saved at: ${pngPath}`,
    `  Transcribe manually and replace this comment.`,
    "-->",
  ].join("\n");
}
