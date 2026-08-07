// Extracts a top-level section block by name, balancing braces so we can
// keep nested objects (responsive textPresets, spacing, gradients in template
// literals, etc.) intact. Matches both `name: {` (object property) and
// `name = {` (top-level assignment, used by `palette`).
function extractBlock(code, sectionName) {
  const re = new RegExp(`\\b${sectionName}\\s*[:=]\\s*{`);
  const start = code.search(re);
  if (start === -1) return null;

  const open = code.indexOf("{", start);
  if (open === -1) return null;

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  let i = open;

  while (i < code.length) {
    const ch = code[i];
    const prev = i > 0 ? code[i - 1] : "";

    if (!inSingle && !inDouble && !inBacktick) {
      if (ch === "'") inSingle = true;
      else if (ch === '"') inDouble = true;
      else if (ch === "`") inBacktick = true;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) return code.slice(open + 1, i);
      }
    } else if (inSingle && ch === "'" && prev !== "\\") {
      inSingle = false;
    } else if (inDouble && ch === '"' && prev !== "\\") {
      inDouble = false;
    } else if (inBacktick && ch === "`" && prev !== "\\") {
      inBacktick = false;
    }
    i++;
  }
  return null;
}

// Splits a block "key: value, key: value" honouring nested braces, parens,
// brackets and string/template literals.
function splitTopLevelEntries(block) {
  const out = [];
  let buf = "";
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;

  for (let i = 0; i < block.length; i++) {
    const ch = block[i];
    const prev = i > 0 ? block[i - 1] : "";

    if (!inSingle && !inDouble && !inBacktick) {
      if (ch === "'") inSingle = true;
      else if (ch === '"') inDouble = true;
      else if (ch === "`") inBacktick = true;
      else if (ch === "{" || ch === "(" || ch === "[") depth++;
      else if (ch === "}" || ch === ")" || ch === "]") depth--;
      else if (ch === "," && depth === 0) {
        const trimmed = buf.trim();
        if (trimmed) out.push(trimmed);
        buf = "";
        continue;
      }
    } else if (inSingle && ch === "'" && prev !== "\\") inSingle = false;
    else if (inDouble && ch === '"' && prev !== "\\") inDouble = false;
    else if (inBacktick && ch === "`" && prev !== "\\") inBacktick = false;

    buf += ch;
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

// Split a single entry "key: value" into [key, value] keeping any colons inside
// the value (none in current skins, but cheap to be safe).
function splitKeyValue(entry) {
  const idx = entry.indexOf(":");
  if (idx === -1) return null;
  const key = entry.slice(0, idx).trim().replace(/^['"]|['"]$/g, "");
  const value = entry.slice(idx + 1).trim();
  return [key, value];
}

function extractPalette(code) {
  const block = extractBlock(code, "palette");
  if (!block) return null;

  const result = {};
  for (const entry of splitTopLevelEntries(block)) {
    const kv = splitKeyValue(entry);
    if (!kv) continue;
    const [name, rawValue] = kv;
    const hexMatch = rawValue.match(/['"`]?(#[a-fA-F0-9]{3,8})['"`]?/);
    if (!hexMatch) continue;
    result[name] = { value: hexMatch[1], type: "color" };
  }
  return result;
}

function parseColorValue(raw) {
  const value = raw.replace(/,\s*$/, "").trim();

  // Multi-stop linear-gradient inside a template literal.
  if (value.startsWith("`") && value.includes("linear-gradient")) {
    const inner = value.slice(1, -1);
    const grad = inner.match(/linear-gradient\(\s*(-?\d+)deg\s*,\s*([\s\S]+)\)\s*$/);
    if (!grad) return null;

    const angle = parseInt(grad[1], 10);
    const stops = [];

    // Split stops at top-level commas (respect nested parens / template refs).
    let depth = 0;
    let buf = "";
    const pieces = [];
    for (let i = 0; i < grad[2].length; i++) {
      const ch = grad[2][i];
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        pieces.push(buf.trim());
        buf = "";
      } else buf += ch;
    }
    if (buf.trim()) pieces.push(buf.trim());

    for (const piece of pieces) {
      // `${applyAlpha(palette.X, a)} P%`
      let m = piece.match(
        /^\$\{applyAlpha\(\s*palette\.(\w+)\s*,\s*([\d.]+)\s*\)\}\s*(-?[\d.]+)%?\s*$/
      );
      if (m) {
        stops.push({
          value: `rgba({palette.${m[1]}}, ${m[2]})`,
          stop: parseFloat(m[3]) / 100,
        });
        continue;
      }
      // `${palette.X} P%`
      m = piece.match(/^\$\{palette\.(\w+)\}\s*(-?[\d.]+)%?\s*$/);
      if (m) {
        stops.push({
          value: `{palette.${m[1]}}`,
          stop: parseFloat(m[2]) / 100,
        });
        continue;
      }
      // Fallback: plain colour/string + percentage.
      m = piece.match(/^(.+?)\s*(-?[\d.]+)%\s*$/);
      if (m) {
        stops.push({ value: m[1].trim(), stop: parseFloat(m[2]) / 100 });
      }
    }

    if (!stops.length) return null;
    return { type: "linear-gradient", value: { angle, colors: stops } };
  }

  // applyAlpha(palette.X, alpha) — solid color with alpha.
  const alphaMatch = value.match(
    /^applyAlpha\(\s*palette\.(\w+)\s*,\s*([\d.]+)\s*\)$/
  );
  if (alphaMatch) {
    return {
      value: `rgba({palette.${alphaMatch[1]}}, ${alphaMatch[2]})`,
      type: "color",
      description: alphaMatch[1],
    };
  }

  // palette.X — plain solid reference.
  const paletteMatch = value.match(/^palette\.(\w+)$/);
  if (paletteMatch) {
    return {
      value: `{palette.${paletteMatch[1]}}`,
      type: "color",
      description: paletteMatch[1],
    };
  }

  return null;
}

function extractColors(code, sectionName) {
  const block = extractBlock(code, sectionName);
  if (!block) return null;

  const result = {};
  for (const entry of splitTopLevelEntries(block)) {
    const kv = splitKeyValue(entry);
    if (!kv) continue;
    const [name, rawValue] = kv;
    const parsed = parseColorValue(rawValue);
    if (parsed) result[name] = parsed;
  }
  return result;
}

function extractRadius(code) {
  const block = extractBlock(code, "borderRadii");
  if (!block) return null;

  const result = {};
  for (const entry of splitTopLevelEntries(block)) {
    const kv = splitKeyValue(entry);
    if (!kv) continue;
    const [name, rawValue] = kv;
    const cleaned = rawValue.replace(/['",]/g, "").trim();
    if (!cleaned) continue;
    result[name] = { value: cleaned, type: "borderRadius" };
  }
  return result;
}

function evalObjectLiteral(source) {
  try {
    return Function(`"use strict"; return (${source})`)();
  } catch {
    return null;
  }
}

function extractTextPresets(code) {
  const block = extractBlock(code, "textPresets");
  if (!block) return { weight: {}, size: {}, lineHeight: {} };

  const presets = evalObjectLiteral(`{${block}}`);
  const out = { weight: {}, size: {}, lineHeight: {} };
  if (!presets) return out;

  for (const [name, def] of Object.entries(presets)) {
    if (def == null || typeof def !== "object") continue;
    if (def.weight !== undefined)
      out.weight[name] = { value: def.weight, type: "typography" };
    if (def.size !== undefined)
      out.size[name] = { value: def.size, type: "typography" };
    if (def.lineHeight !== undefined)
      out.lineHeight[name] = { value: def.lineHeight, type: "typography" };
  }
  return out;
}

function extractThemeVariants(code) {
  const block = extractBlock(code, "themeVariants");
  if (!block) return null;

  const result = {};
  for (const entry of splitTopLevelEntries(block)) {
    const kv = splitKeyValue(entry);
    if (!kv) continue;
    const [name, rawValue] = kv;
    result[name] = {
      value: rawValue.replace(/['",]/g, "").trim(),
      type: "themeVariant",
    };
  }
  return result;
}

function extractSpacing(code) {
  const block = extractBlock(code, "spacing");
  if (!block) return null;

  const parsed = evalObjectLiteral(`{${block}}`);
  if (!parsed) return null;

  const out = {};
  for (const [name, value] of Object.entries(parsed)) {
    out[name] = { value, type: "spacing" };
  }
  return out;
}

function transformToJSON(rawCode) {
  if (!rawCode || typeof rawCode !== "string") return null;

  const result = {
    light: extractColors(rawCode, "colors"),
    dark: extractColors(rawCode, "darkModeColors"),
    radius: extractRadius(rawCode),
    themeVariant: extractThemeVariants(rawCode),
    text: extractTextPresets(rawCode),
    spacing: extractSpacing(rawCode),
    global: { palette: extractPalette(rawCode) },
  };

  return result;
}

export default transformToJSON;
