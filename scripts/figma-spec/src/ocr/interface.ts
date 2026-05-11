export interface OcrEngine {
  readonly name: string;
  /**
   * Returns a clean Markdown table string, or null if the engine could not
   * produce one. Engines must NOT throw on failure — return null and the
   * orchestrator will fall through to the next engine.
   */
  extractTable(pngPath: string): Promise<string | null>;
}
