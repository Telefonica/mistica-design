import { readFile } from "node:fs/promises";
import { Command } from "commander";
import { parseSpecMarkdown } from "./parseSpec.ts";
import { SpecDocumentSchema } from "./types.ts";

const program = new Command();

program
  .name("md-to-figma")
  .description("Parse a specs/<slug>.md file into structured JSON.");

program
  .command("parse")
  .argument("<file>", "path to a specs/<slug>.md file")
  .option("--pretty", "pretty-print the JSON output", false)
  .action(async (file: string, opts: { pretty: boolean }) => {
    const markdown = await readFile(file, "utf8");
    const doc = SpecDocumentSchema.parse(parseSpecMarkdown(markdown));
    process.stdout.write(JSON.stringify(doc, null, opts.pretty ? 2 : 0));
    process.stdout.write("\n");
  });

program.parseAsync(process.argv);
