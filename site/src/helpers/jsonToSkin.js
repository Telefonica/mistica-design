const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const toPascalCase = (str) => capitalize(toCamelCase(str));

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

// Pretty-print a plain JS value using TS object-literal conventions:
// unquoted keys when they are valid identifiers, single-quoted strings.
const formatLiteral = (value, indent) => {
  const pad = " ".repeat(indent);
  if (value === null) return "null";
  if (typeof value === "string") return `'${value.replace(/'/g, "\\'")}'`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.map((v) => formatLiteral(v, indent + 4));
    return `[${items.join(", ")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (!entries.length) return "{}";
    const inner = entries
      .map(([k, v]) => {
        const key = IDENT.test(k) ? k : `'${k}'`;
        return `${pad}    ${key}: ${formatLiteral(v, indent + 4)}`;
      })
      .join(",\n");
    return `{\n${inner},\n${pad}}`;
  }
  return JSON.stringify(value);
};

// {palette.X} → palette.X
const unwrapPaletteRef = (ref) => ref.replace(/^\{|\}$/g, "");

// Convert one gradient stop coming from the JSON back to skin source syntax.
const buildGradientStop = (stop) => {
  const raw = typeof stop === "string" ? stop : stop.value;
  const percent =
    stop && typeof stop.stop === "number" ? ` ${stop.stop * 100}%` : "";

  let m = raw.match(/^rgba\(\s*\{?palette\.(\w+)\}?\s*,\s*([\d.]+)\s*\)$/);
  if (m) return `\${applyAlpha(palette.${m[1]}, ${m[2]})}${percent}`;

  m = raw.match(/^applyAlpha\(\s*palette\.(\w+)\s*,\s*([\d.]+)\s*\)$/);
  if (m) return `\${applyAlpha(palette.${m[1]}, ${m[2]})}${percent}`;

  m = raw.match(/^\{palette\.(\w+)\}$/);
  if (m) return `\${palette.${m[1]}}${percent}`;

  return `${raw}${percent}`;
};

const buildColor = (colorDescription) => {
  const colorValue = colorDescription.value;

  if (
    colorValue &&
    typeof colorValue === "object" &&
    Array.isArray(colorValue.colors)
  ) {
    const { angle, colors } = colorValue;
    const stops = colors.map(buildGradientStop).join(", ");
    return `\`linear-gradient(${angle}deg, ${stops})\``;
  }

  if (typeof colorValue === "string") {
    const alphaMatch = colorValue.match(
      /^rgba\(\s*\{?palette\.(\w+)\}?\s*,\s*([\d.]+)\s*\)$/
    );
    if (alphaMatch) {
      return `applyAlpha(palette.${alphaMatch[1]}, ${alphaMatch[2]})`;
    }

    const refMatch = colorValue.match(/^\{palette\.(\w+)\}$/);
    if (refMatch) return `palette.${refMatch[1]}`;

    return unwrapPaletteRef(colorValue);
  }

  return colorValue;
};

const buildRadius = (radiusDescription) => {
  const raw = String(radiusDescription.value).trim();
  if (raw.endsWith("%")) return raw;
  if (raw === "circle") return "50%";
  if (raw.endsWith("px")) return raw;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return `${raw}px`;
  return raw;
};

const flattenTextPresets = (textSection) => {
  if (!textSection || typeof textSection !== "object") return {};
  const out = {};
  for (const [attribute, group] of Object.entries(textSection)) {
    if (!group || typeof group !== "object") continue;
    for (const [presetName, def] of Object.entries(group)) {
      if (!out[presetName]) out[presetName] = {};
      out[presetName][attribute] = def && "value" in def ? def.value : def;
    }
  }
  return out;
};

// Render a flat key→stringValue map as the body of an object literal,
// joined with commas + 12-space indent (matching the surrounding skin body).
const renderInlineBlock = (entries, valueFn) => {
  if (!entries) return null;
  const keys = Object.keys(entries);
  if (!keys.length) return null;
  return keys
    .map((name) => `${name}: ${valueFn(name, entries[name])}`)
    .join(",\n            ");
};

const wrapSection = (name, body) =>
  `        ${name}: {\n            ${body},\n        }`;

export const generateSkin = (skinName, skinData) => {
  let designTokens;
  try {
    designTokens =
      typeof skinData === "string" ? JSON.parse(skinData) : skinData;
  } catch (err) {
    return `// Failed to parse JSON: ${err.message}`;
  }
  if (!designTokens || typeof designTokens !== "object") {
    return "// Empty or invalid token data";
  }

  const skinConstantName = `${skinName.toUpperCase().replace(/-/g, "_")}_SKIN`;
  const sections = [];

  const lightBlock = renderInlineBlock(designTokens.light, (_, def) =>
    buildColor(def)
  );
  if (lightBlock) sections.push(wrapSection("colors", lightBlock));

  const darkBlock = renderInlineBlock(designTokens.dark, (_, def) =>
    buildColor(def)
  );
  if (darkBlock) sections.push(wrapSection("darkModeColors", darkBlock));

  const radiusBlock = renderInlineBlock(
    designTokens.radius,
    (_, def) => `'${buildRadius(def)}'`
  );
  if (radiusBlock) sections.push(wrapSection("borderRadii", radiusBlock));

  const flatPresets = flattenTextPresets(designTokens.text);
  if (Object.keys(flatPresets).length) {
    sections.push(`        textPresets: ${formatLiteral(flatPresets, 8)}`);
  }

  const themeBlock = renderInlineBlock(
    designTokens.themeVariant,
    (_, def) => `'${def && "value" in def ? def.value : def}'`
  );
  if (themeBlock) sections.push(wrapSection("themeVariants", themeBlock));

  if (designTokens.spacing && Object.keys(designTokens.spacing).length) {
    const spacingObj = Object.fromEntries(
      Object.entries(designTokens.spacing).map(([k, v]) => [
        k,
        v && "value" in v ? v.value : v,
      ])
    );
    sections.push(`        spacing: ${formatLiteral(spacingObj, 8)}`);
  }

  const paletteEntries = designTokens.global && designTokens.global.palette;
  const paletteLines = paletteEntries
    ? Object.entries(paletteEntries)
        .map(([k, v]) => `    ${k}: '${v && "value" in v ? v.value : v}'`)
        .join(",\n")
    : "";

  const body = sections.join(",\n");
  const needsApplyAlphaImport = body.includes("applyAlpha(");

  return `import {${skinConstantName}} from './constants';
${needsApplyAlphaImport ? "import {applyAlpha} from '../utils/color';\n" : ""}
import type {GetKnownSkin, KnownSkin} from './types';

export const palette = {
${paletteLines},
};

export const get${toPascalCase(skinName)}Skin: GetKnownSkin = () => {
    const skin: KnownSkin = {
        name: ${skinConstantName},
${body},
    };
    return skin;
};
`;
};
