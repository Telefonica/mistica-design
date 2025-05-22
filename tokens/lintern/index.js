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

function extractPaletteRef(value) {
  if (typeof value !== "string") return null;
  const match = value.match(
    /\{palette\.([a-zA-Z0-9]+)\}/
  );
  return match ? match[1] : null;
}

// Modified: returns both color and reference key
function resolveReferenceWithName(
  value,
  palette
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
    return { color: value, ref: null }; // direct hex color
  }
  return { color: null, ref: null };
}

function isSkippable(token) {
  if (!token) return true;
  if (
    token.type === "linear-gradient" ||
    token.type === "radial-gradient"
  )
    return true;
  if (
    typeof token.value === "string" &&
    token.value.includes("rgba(")
  )
    return true;
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
    const filePath = path.join(
      tokensDir,
      fileName
    );
    const content = await fs.readFile(
      filePath,
      "utf-8"
    );
    return { [fileName]: JSON.parse(content) };
  } else {
    const files = await fs.readdir(tokensDir);
    const jsonFiles = files.filter((f) =>
      f.endsWith(".json")
    );
    const tokens = {};
    for (const file of jsonFiles) {
      const content = await fs.readFile(
        path.join(tokensDir, file),
        "utf-8"
      );
      tokens[file] = JSON.parse(content);
    }
    return tokens;
  }
}

function suggestForegroundAlternatives(
  fgRef,
  palette,
  bgColor,
  minRatio
) {
  if (!fgRef) return [];

  const familyMatch = fgRef.match(
    /^([a-zA-Z]+)[0-9]*$/
  );
  if (!familyMatch) return [];

  const family = familyMatch[1];

  const candidates = Object.entries(palette)
    .filter(
      ([key]) =>
        key.startsWith(family) && key !== fgRef
    )
    .map(([key, token]) => {
      const color = token.value;
      const ratio = wcagContrast.hex(
        color,
        bgColor
      );
      return { key, color, ratio };
    })
    .filter((c) => c.ratio >= minRatio);

  // Sort by closest to minRatio (smallest positive difference)
  candidates.sort(
    (a, b) =>
      Math.abs(a.ratio - minRatio) -
      Math.abs(b.ratio - minRatio)
  );

  return candidates.slice(0, 1);
}

function validate(
  tokensData,
  tokenFilter = null
) {
  const report = {
    filesChecked: 0,
    filesWithErrors: 0,
    totalErrors: 0,
    details: {},
  };

  for (const [fileName, data] of Object.entries(
    tokensData
  )) {
    report.filesChecked++;
    const palette = data.global?.palette || {};
    const errors = [];

    // Validar coincidencia descripción/valor solo en light y dark
    for (const theme of themes) {
      if (!data[theme]) continue;
      for (const [
        tokenName,
        token,
      ] of Object.entries(data[theme])) {
        if (!token.value) continue;
        if (isSkippable(token)) continue;

        const refName = extractPaletteRef(
          token.value
        );
        if (refName) {
          if (token.description !== refName) {
            errors.push({
              type: "description-mismatch",
              token: `${theme}.${tokenName}`,
              description: token.description,
              expected: refName,
              message: `La descripción "${token.description}" no coincide con la referencia esperada "${refName}" extraída de {palette.${refName}}`,
            });
          }

          if (!palette[refName]) {
            errors.push({
              type: "invalid-palette-ref",
              token: `${theme}.${tokenName}`,
              reference: refName,
              message: `La referencia a {palette.${refName}} no existe en global.palette`,
            });
          }
        }
      }
    }

    // Validar contraste para fg/bg (soportando array o string)
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
              `${theme}.${fgKey}`
            );
            const bgToken = getTokenByPath(
              data,
              `${theme}.${bgKey}`
            );

            if (tokenFilter) {
              const involved = [
                fgKey,
                bgKey,
              ].includes(tokenFilter);
              if (!involved) continue;
            }

            if (!fgToken || !bgToken) continue;
            if (
              isSkippable(fgToken) ||
              isSkippable(bgToken)
            )
              continue;

            const fgResolved =
              resolveReferenceWithName(
                fgToken.value,
                palette
              );
            const bgResolved =
              resolveReferenceWithName(
                bgToken.value,
                palette
              );
            const fgColor = fgResolved.color;
            const bgColor = bgResolved.color;
            if (!fgColor || !bgColor) continue;

            const ratio = wcagContrast.hex(
              fgColor,
              bgColor
            );
            if (ratio < pair.minRatio) {
              errors.push({
                type: "contrast-fail",
                pair: `${theme}.${fgKey} vs ${theme}.${bgKey}`,
                fg: fgColor,
                fgRef: fgResolved.ref,
                bg: bgColor,
                bgRef: bgResolved.ref,
                ratio: ratio.toFixed(2),
                minRatio: pair.minRatio,
              });
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      report.filesWithErrors++;
      report.totalErrors += errors.length;
    }
    report.details[fileName] = errors;
  }

  return report;
}

function printReport(report, palette) {
  for (const [file, errors] of Object.entries(
    report.details
  )) {
    console.log(
      chalk.blue(`\n🔍 Revisando ${file}`)
    );
    if (errors.length === 0) {
      console.log(
        chalk.green("  ✔ Sin errores encontrados")
      );
      continue;
    }
    const descErrors = errors.filter(
      (e) => e.type === "description-mismatch"
    );
    const contrastErrors = errors.filter(
      (e) => e.type === "contrast-fail"
    );

    const invalidRefs = errors.filter(
      (e) => e.type === "invalid-palette-ref"
    );

    if (descErrors.length > 0) {
      descErrors.forEach((e) => {
        console.log(
          chalk.red(
            `  [description-mismatch] Token: ${e.token}`
          )
        );
        console.log(
          chalk.gray(
            `    Descripción: ${e.description}`
          )
        );
        console.log(
          chalk.gray(
            `    Esperado: ${e.expected}`
          )
        );
        console.log(
          chalk.yellow(
            `    Mensaje: ${e.message}`
          )
        );
      });
    } else {
      console.log(
        chalk.green(
          "  ✔ Todas las descripciones coinciden con la referencia en palette"
        )
      );
    }

    if (invalidRefs.length > 0) {
      invalidRefs.forEach((e) => {
        console.log(
          chalk.red(
            `  [invalid-palette-ref] Token: ${e.token}`
          )
        );
        console.log(
          chalk.gray(
            `    Referencia inválida: {palette.${e.reference}}`
          )
        );
        console.log(
          chalk.yellow(
            `    Mensaje: ${e.message}`
          )
        );
      });
    } else {
      console.log(
        chalk.green(
          "  ✔ Todas las referencias a palette son válidas"
        )
      );
    }

    if (contrastErrors.length > 0) {
      contrastErrors.forEach((e) => {
        const fgInfo = e.fgRef
          ? `${e.fg} (${e.fgRef})`
          : e.fg;
        const bgInfo = e.bgRef
          ? `${e.bg} (${e.bgRef})`
          : e.bg;
        console.log(
          chalk.red(`  [contrast-fail] ${e.pair}`)
        );
        console.log(
          chalk.gray(`    Foreground: ${fgInfo}`)
        );
        console.log(
          chalk.gray(`    Background: ${bgInfo}`)
        );
        console.log(
          chalk.gray(
            `    Ratio: ${e.ratio} < mínimo: ${e.minRatio}`
          )
        );

        // Suggest alternatives if fgRef and palette present
        if (e.fgRef && palette) {
          const suggestions =
            suggestForegroundAlternatives(
              e.fgRef,
              palette,
              e.bg,
              e.minRatio
            );
          if (suggestions.length > 0) {
            const family =
              e.fgRef.match(/^([a-zA-Z]+)/)[1];
            const formatted = suggestions
              .map(
                (s) =>
                  `${s.key} (${
                    s.color
                  }, ${s.ratio.toFixed(2)})`
              )
              .join(", ");
            console.log(
              chalk.yellow(
                `    ✦ Suggestion: ${formatted}`
              )
            );
          }
        }
      });
    } else {
      console.log(
        chalk.green(
          "  ✔ Todos los pares pasaron el contraste mínimo"
        )
      );
    }
  }

  console.log(chalk.blueBright(`\nResumen:`));
  console.log(
    chalk.blue(
      `- Archivos revisados: ${report.filesChecked}`
    )
  );
  console.log(
    chalk.blue(
      `- Archivos con errores: ${report.filesWithErrors}`
    )
  );
  console.log(
    chalk.blue(
      `- Total errores: ${report.totalErrors}`
    )
  );
}

async function promptForFile() {
  const files = await fs.readdir(tokensDir);
  const jsonFiles = files.filter((f) =>
    f.endsWith(".json")
  );
  if (jsonFiles.length === 0) {
    console.log("No JSON token files found.");
    process.exit(0);
  }

  const choices = ["All files", ...jsonFiles];

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "fileToCheck",
      message:
        "Select the token JSON file to check:",
      choices,
    },
  ]);

  return answers.fileToCheck === "All files"
    ? null
    : answers.fileToCheck;
}

async function run() {
  try {
    const args = process.argv.slice(2);
    const fileToCheck = args[0]?.endsWith(".json")
      ? args[0]
      : null;
    const tokenNameToCheck = fileToCheck
      ? args[1]
      : args[0]; // second arg if file is present, else first arg

    let selectedFile = fileToCheck;

    if (!selectedFile) {
      selectedFile = await promptForFile();
    }

    const tokensData = await loadTokens(
      selectedFile
    );
    const report = validate(
      tokensData,
      tokenNameToCheck
    );
    for (const [fileName, data] of Object.entries(
      tokensData
    )) {
      const palette = data.global?.palette || {};
      if (report.details[fileName]?.length > 0) {
        printReport(
          {
            filesChecked: report.filesChecked,
            filesWithErrors:
              report.filesWithErrors,
            totalErrors: report.totalErrors,
            details: {
              [fileName]:
                report.details[fileName],
            },
          },
          palette
        );
      } else {
        printReport(report, palette);
      }
    }
  } catch (e) {
    console.error("Error ejecutando linter:", e);
    process.exit(1);
  }
}

run();
