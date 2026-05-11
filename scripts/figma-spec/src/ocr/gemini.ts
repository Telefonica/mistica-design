import { readFile } from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";
import type { OcrEngine } from "./interface.ts";
import { cleanMarkdownTable, isValidMarkdownTable } from "./validate.ts";

const MODEL = "gemini-2.5-flash";
const TIMEOUT_MS = 15_000;

const PROMPT = `You are extracting a table from a screenshot.

Return ONLY the table as GitHub-flavored Markdown:
- Pipe-delimited columns
- A header separator row of the form | --- | --- |
- Preserve cell text exactly as shown, including any spaces or hyphens
- No surrounding prose, no code fences, no commentary
- If the image does not contain a table, return the literal string NO_TABLE`;

export class GeminiOcrEngine implements OcrEngine {
  readonly name = "gemini";
  private readonly client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async extractTable(pngPath: string): Promise<string | null> {
    const bytes = await readFile(pngPath);
    const base64 = bytes.toString("base64");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const response = await this.client.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { text: PROMPT },
              { inlineData: { data: base64, mimeType: "image/png" } },
            ],
          },
        ],
        config: { abortSignal: ctrl.signal } as never,
      });
      const text = (response.text ?? "").trim();
      if (!text || text.toUpperCase() === "NO_TABLE") return null;
      const cleaned = cleanMarkdownTable(text);
      return isValidMarkdownTable(cleaned) ? cleaned : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }
}
