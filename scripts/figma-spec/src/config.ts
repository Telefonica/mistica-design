import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const ComponentEntry = z.object({
  fileKey: z.string().min(1),
  pageId: z.string().min(1),
});

const ConfigSchema = z.object({
  outputDir: z.string().min(1),
  components: z.record(ComponentEntry),
});

export type ComponentConfig = z.infer<typeof ComponentEntry>;
export type SpecsConfig = z.infer<typeof ConfigSchema>;

export interface ResolvedConfig {
  outputDirAbs: string;
  components: Record<string, ComponentConfig>;
  configPathAbs: string;
  repoRootAbs: string;
}

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT_ROOT = resolve(here, "..");
const REPO_ROOT = resolve(SCRIPT_ROOT, "..", "..");
const DEFAULT_CONFIG_PATH = resolve(SCRIPT_ROOT, "specs.config.json");

export async function loadConfig(
  configPath: string = DEFAULT_CONFIG_PATH,
): Promise<ResolvedConfig> {
  const raw = await readFile(configPath, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Failed to parse config at ${configPath}: ${(err as Error).message}`,
    );
  }
  const config = ConfigSchema.parse(parsed);
  const outputDirAbs = isAbsolute(config.outputDir)
    ? config.outputDir
    : resolve(REPO_ROOT, config.outputDir);
  return {
    outputDirAbs,
    components: config.components,
    configPathAbs: configPath,
    repoRootAbs: REPO_ROOT,
  };
}

export function getRepoRoot(): string {
  return REPO_ROOT;
}

export function getScriptRoot(): string {
  return SCRIPT_ROOT;
}
