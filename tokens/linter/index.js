import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import wcagContrast from "wcag-contrast";
import chalk from "chalk";
import inquirer from "inquirer";
import { contrastPairs } from "./contrastPairs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokensDir = path.resolve(__dirname, "..");

const themes = ["light", "dark"];
const VALID_MODES = ["format", "contrast"];

function extractPaletteRef(value) {
  if (typeof value !== "string") return null;
  const match = value.match(
    /\{palette\.([a-zA-Z0-9]+)\}/,
  );
  return match ? match[1] : null;
}

function resolveReferenceWithName(
  value,
  palette,
) {
  if (!value) return { color: null, ref: null };

  if (typeof value === "string") {
    const refName = extractPaletteRef(value);
    if (refName) {
      return {
        color: palette[refName]?.value || null,
        ref: refName,
      };
    }
    return { color: value, ref: null };
  }

  return { color: null, ref: null };
}

function isSkippable(token, mode) {
  if (!token) return true;

  if (
    token.type === "linear-gradient" ||
    token.type === "radial-gradient"
  ) {
    return true;
  }

  if (
    mode === "contrast" &&
    typeof token.value === "string" &&
    token.value.includes("rgba(")
  ) {
    return true;
  }

  return false;
}

function getTokenByPath(data, pathStr) {
  const parts = pathStr.split(".");
  if (parts.length !== 2) return null;
  const [category, name] = parts;
  return data[category]?.[name] || null;
}

async function loadTokens(fileName) {
  if (fileName) {
    const content = await fs.readFile(
      path.join(tokensDir, fileName),
      "utf-8",
    );
    return { [fileName]: JSON.parse(content) };
  }

  const files = await fs.readdir(tokensDir);
  const jsonFiles = files.filter((f) =>
    f.endsWith(".json"),
  );

  const tokens = {};
  for (const file of jsonFiles) {
    const content = await fs.readFile(
      path.join(tokensDir, file),
      "utf-8",
    );
    tokens[file] = JSON.parse(content);
  }

  return tokens;
}

function suggestForegroundAlternatives(
  fgRef,
  palette,
  bgColor,
  minRatio,
) {
  if (!fgRef) return [];

  const match = fgRef.match(/^([a-zA-Z]+)(\d+)$/);
  if (!match) return [];

  const family = match[1];
  const baseIndex = parseInt(match[2], 10);

  const sameFamily = Object.entries(palette)
    .map(([key, token]) => {
      const m = key.match(/^([a-zA-Z]+)(\d+)$/);
      if (!m || m[1] !== family) return null;
      return {
        key,
        index: parseInt(m[2], 10),
        color: token.value,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index);

  const ordered = sameFamily
    .filter((t) => t.index !== baseIndex)
    .sort(
      (a, b) =>
        Math.abs(a.index - baseIndex) -
        Math.abs(b.index - baseIndex),
    );

  for (const candidate of ordered) {
    const ratio = wcagContrast.hex(
      candidate.color,
      bgColor,
    );
    if (ratio >= minRatio) {
      return [
        {
          key: candidate.key,
          color: candidate.color,
          ratio,
        },
      ];
    }
  }

  return [];
}

function validate(tokensData, mode) {
  const report = { details: {} };

  for (const [fileName, data] of Object.entries(
    tokensData,
  )) {
    const palette = data.global?.palette || {};
    const errors = [];

    /* FORMAT */
    if (mode === "format") {
      for (const theme of themes) {
        if (!data[theme]) continue;

        for (const [
          tokenName,
          token,
        ] of Object.entries(data[theme])) {
          if (!token.value) continue;
          if (isSkippable(token, mode)) continue;

          const refName = extractPaletteRef(
            token.value,
          );

          if (refName) {
            if (token.description !== refName) {
              errors.push({
                type: "description-mismatch",
                token: `${theme}.${tokenName}`,
                message: `Descripción "${token.description}" ≠ "${refName}"`,
              });
            }

            if (!palette[refName]) {
              errors.push({
                type: "invalid-palette-ref",
                token: `${theme}.${tokenName}`,
                message: `{palette.${refName}} no existe`,
              });
            }
          }
        }
      }
    }

    if (mode === "contrast") {
      for (const pair of contrastPairs) {
        for (const theme of themes) {
          const fgs = Array.isArray(pair.fg)
            ? pair.fg
            : [pair.fg];
          const bgs = Array.isArray(pair.bg)
            ? pair.bg
            : [pair.bg];

          for (const fgKey of fgs) {
            for (const bgKey of bgs) {
              const fgToken = getTokenByPath(
                data,
                `${theme}.${fgKey}`,
              );
              const bgToken = getTokenByPath(
                data,
                `${theme}.${bgKey}`,
              );

              if (!fgToken || !bgToken) continue;
              if (
                isSkippable(fgToken, mode) ||
                isSkippable(bgToken, mode)
              )
                continue;

              const fg = resolveReferenceWithName(
                fgToken.value,
                palette,
              );
              const bg = resolveReferenceWithName(
                bgToken.value,
                palette,
              );

              if (!fg.color || !bg.color)
                continue;

              const ratio = wcagContrast.hex(
                fg.color,
                bg.color,
              );

              if (ratio < pair.minRatio) {
                errors.push({
                  type: "contrast-fail",
                  pair: `${theme}.${fgKey} vs ${theme}.${bgKey}`,
                  ratio: ratio.toFixed(2),
                  minRatio: pair.minRatio,
                  fgRef: fg.ref,
                  bg: bg.color,
                });
              }
            }
          }
        }
      }
    }

    report.details[fileName] = errors;
  }

  return report;
}

async function promptForMode() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "mode",
      message: "What do you want to validate?",
      choices: [
        {
          name: "Format (descriptions & references)",
          value: "format",
        },
        {
          name: "Contrast (WCAG)",
          value: "contrast",
        },
      ],
    },
  ]);
  return answers.mode;
}

async function promptForFile() {
  const files = await fs.readdir(tokensDir);
  const jsonFiles = files.filter((f) =>
    f.endsWith(".json"),
  );

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "file",
      message: "Select token file:",
      choices: ["All files", ...jsonFiles],
    },
  ]);

  return answers.file === "All files"
    ? null
    : answers.file;
}

async function run() {
  try {
    const args = process.argv.slice(2);

    const fileArg =
      args.find((a) => a.endsWith(".json")) ||
      null;
    const modeArg = args.find((a) =>
      VALID_MODES.includes(a),
    );

    const mode =
      modeArg || (await promptForMode());
    const file =
      fileArg ?? (await promptForFile());

    const tokensData = await loadTokens(file);
    const report = validate(tokensData, mode);

    for (const [fileName, data] of Object.entries(
      tokensData,
    )) {
      const palette = data.global?.palette || {};
      const errors = report.details[fileName];

      console.log(chalk.blue(`\n🔍 ${fileName}`));

      if (!errors.length) {
        console.log(
          chalk.green("  ✔ Sin errores"),
        );
        continue;
      }

      errors.forEach((e) => {
        console.log(
          chalk.red(
            `  [${e.type}] ${e.token || e.pair}`,
          ),
        );

        if (
          e.type === "contrast-fail" &&
          e.fgRef
        ) {
          const suggestions =
            suggestForegroundAlternatives(
              e.fgRef,
              palette,
              e.bg,
              e.minRatio,
            );
          if (suggestions.length) {
            console.log(
              chalk.yellow(
                `    Suggestion: ${suggestions
                  .map(
                    (s) =>
                      `${s.key} (${s.color}, ${s.ratio.toFixed(2)})`,
                  )
                  .join(", ")}`,
              ),
            );
          }
        }
      });
    }
  } catch (err) {
    console.error("Linter error:", err);
    process.exit(1);
  }
}

run();
