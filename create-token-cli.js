#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const TOKEN_ROOT = "./tokens";

const TOKEN_TYPES = [
  "color",
  "borderRadius",
  "typography",
  "themeVariant",
  "linear-gradient"
];

function extractPaletteKeys(value) {
  if (typeof value === "string") {
    const regex = /\{palette\.([a-zA-Z0-9]+)\}/g;
    let match;
    const keys = [];
    while ((match = regex.exec(value)) !== null) {
      keys.push(match[1]);
    }
    return keys;
  }
  return [];
}

function extractPaletteDescription(value) {
  const keys = extractPaletteKeys(value);
  return keys.length > 0 ? keys[0] : null;
}

function loadBrands() {
  const files = fs.readdirSync(TOKEN_ROOT).filter(f => f.endsWith(".json"));
  if (files.length === 0) {
    console.error("❌ No brand files found in ./tokens folder.");
    process.exit(1);
  }
  return files.map(f => {
    const brandName = path.basename(f, ".json");
    const filePath = path.join(TOKEN_ROOT, f);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return { brandName, filePath, data };
  });
}

function paletteKeyExists(brandData, key) {
  return !!(brandData.global && brandData.global.palette && brandData.global.palette[key]);
}

function addPaletteKey(brandData, key, hexValue) {
  if (!brandData.global) brandData.global = {};
  if (!brandData.global.palette) brandData.global.palette = {};
  brandData.global.palette[key] = {
    value: hexValue,
    type: "color"
  };
}

function saveBrand(brand) {
  fs.writeFileSync(brand.filePath, JSON.stringify(brand.data, null, 2));
}

// --- Helpers to build color values

async function promptPaletteKey(brand, usedKeys) {
  while (true) {
    const { paletteKey } = await inquirer.prompt({
      name: "paletteKey",
      message: `Enter palette color name (e.g. white):`,
      validate: input => input.trim().length > 0 || "Palette color name required"
    });
    if (usedKeys.includes(paletteKey)) {
      console.log(`⚠️ Palette color "${paletteKey}" already used for this token. Please pick a different one.`);
      continue;
    }
    // Check if palette key exists, else prompt to add
    if (!paletteKeyExists(brand.data, paletteKey)) {
      console.log(`⚠️ Palette key "{palette.${paletteKey}}" missing in brand "${brand.brandName}".`);
      const { createPalette } = await inquirer.prompt({
        name: "createPalette",
        type: "confirm",
        message: `Do you want to create "palette.${paletteKey}" in ${brand.brandName}'s global.palette?`,
        default: true
      });
      if (createPalette) {
        const { hexValue } = await inquirer.prompt({
          name: "hexValue",
          message: `Enter hex value for palette.${paletteKey} (e.g. #aabbcc):`,
          validate: input => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input.trim()) || "Enter a valid hex color"
        });
        addPaletteKey(brand.data, paletteKey, hexValue.trim());
        console.log(`✅ Added palette.${paletteKey} to ${brand.brandName}`);
      } else {
        console.log(`⚠️ Skipping palette.${paletteKey} creation. This may cause invalid references.`);
      }
    }
    return paletteKey;
  }
}

async function buildSolidColor(brand, usedKeys) {
  const paletteKey = await promptPaletteKey(brand, usedKeys);
  return {
    value: `{palette.${paletteKey}}`,
    paletteKeys: [paletteKey]
  };
}

async function buildColorWithAlpha(brand, usedKeys) {
  const paletteKey = await promptPaletteKey(brand, usedKeys);
  const { alpha } = await inquirer.prompt({
    name: "alpha",
    message: `Enter alpha value (0-1):`,
    validate: input => {
      const n = parseFloat(input);
      return !isNaN(n) && n >= 0 && n <= 1 || "Alpha must be a number between 0 and 1";
    }
  });
  return {
    value: `rgba({palette.${paletteKey}}, ${alpha})`,
    paletteKeys: [paletteKey]
  };
}

async function buildGradient(brand) {
  const { angle } = await inquirer.prompt({
    name: "angle",
    message: `Enter gradient angle (degrees):`,
    validate: input => {
      const n = parseInt(input);
      return !isNaN(n) && n >= 0 && n <= 360 || "Angle must be between 0 and 360";
    }
  });

  const colors = [];
  const usedKeys = [];
  let addMore = true;
  while (addMore) {
    const { stop } = await inquirer.prompt({
      name: "stop",
      message: `Enter stop position (0 to 1):`,
      validate: input => {
        const n = parseFloat(input);
        return !isNaN(n) && n >= 0 && n <= 1 || "Stop must be a number between 0 and 1";
      }
    });

    const { colorType } = await inquirer.prompt({
      name: "colorType",
      message: "Is this stop a solid color or color with alpha?",
      type: "list",
      choices: ["solid", "alpha"]
    });

    let colorValue;
    if (colorType === "solid") {
      const res = await buildSolidColor(brand, usedKeys);
      colorValue = res.value;
      usedKeys.push(...res.paletteKeys);
    } else {
      const res = await buildColorWithAlpha(brand, usedKeys);
      colorValue = res.value;
      usedKeys.push(...res.paletteKeys);
    }

    colors.push({
      value: colorValue,
      stop: parseFloat(stop)
    });

    const { more } = await inquirer.prompt({
      name: "more",
      type: "confirm",
      message: "Add another gradient stop?",
      default: false
    });
    addMore = more;
  }

  return {
    value: {
      angle: parseInt(angle),
      colors
    }
  };
}

(async () => {
  const brands = loadBrands();

  const { tokenName } = await inquirer.prompt({
    name: "tokenName",
    message: "🔖 Token name (e.g. backgroundContainerHover):",
    validate: input => input.trim().length > 0 || "Token name is required"
  });

  const { tokenType } = await inquirer.prompt({
    name: "tokenType",
    type: "list",
    message: "🧩 Token type:",
    choices: TOKEN_TYPES
  });

  const modes = tokenType === "color" ? ["light", "dark"] : ["default"];

  const valuesByBrand = {};

  for (const brand of brands) {
    valuesByBrand[brand.brandName] = {};

    for (const mode of modes) {
      let tokenValue, paletteKeys = [];

      if (tokenType === "color") {
        console.log(`\n🖌️  Entering color token for brand "${brand.brandName}" mode "${mode}"`);

        const { colorForm } = await inquirer.prompt({
          name: "colorForm",
          type: "list",
          message: "Select color form:",
          choices: [
            { name: "Solid color (palette reference)", value: "solid" },
            { name: "Color with alpha (palette + transparency)", value: "alpha" },
            { name: "Gradient", value: "gradient" }
          ]
        });

        if (colorForm === "solid") {
          const res = await buildSolidColor(brand, []);
          tokenValue = res.value;
          paletteKeys = res.paletteKeys;
        } else if (colorForm === "alpha") {
          const res = await buildColorWithAlpha(brand, []);
          tokenValue = res.value;
          paletteKeys = res.paletteKeys;
        } else {
          const res = await buildGradient(brand);
          tokenValue = res.value;
          paletteKeys = [];
          // palette keys inside gradient handled inside buildGradient
        }
      } else {
        // other token types
        const { value } = await inquirer.prompt({
          name: "value",
          message: `💬 Value for ${brand.brandName} [${mode}]:`,
          validate: input => input.trim().length > 0 || "Value is required"
        });
        tokenValue = value;
      }

      valuesByBrand[brand.brandName][mode] = tokenValue;

      // For color tokens: palette keys already handled during building

      // For non-color tokens, check palette keys in value
      if (tokenType !== "color") {
        const paletteKeysInValue = extractPaletteKeys(tokenValue);
        for (const key of paletteKeysInValue) {
          if (!paletteKeyExists(brand.data, key)) {
            console.log(`⚠️ Palette key "{palette.${key}}" missing in brand "${brand.brandName}".`);

            const { createPalette } = await inquirer.prompt({
              name: "createPalette",
              type: "confirm",
              message: `Do you want to create "palette.${key}" in ${brand.brandName}'s global.palette?`,
              default: true
            });

            if (createPalette) {
              const { hexValue } = await inquirer.prompt({
                name: "hexValue",
                message: `Enter hex value for palette.${key} (e.g. #aabbcc):`,
                validate: input => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input.trim()) || "Enter a valid hex color"
              });
              addPaletteKey(brand.data, key, hexValue.trim());
              console.log(`✅ Added palette.${key} to ${brand.brandName}`);
            }
          }
        }
      }
    }
  }

  // Insert tokens

  for (const brand of brands) {
    for (const mode of modes) {
      const parts = tokenName.split(".");
      let target;
      if (tokenType === "color") {
        if (!brand.data[mode]) brand.data[mode] = {};
        target = brand.data[mode];
        for (let i = 0; i < parts.length - 1; i++) {
          if (!target[parts[i]]) target[parts[i]] = {};
          target = target[parts[i]];
        }
      } else {
        target = brand.data;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!target[parts[i]]) target[parts[i]] = {};
          target = target[parts[i]];
        }
      }

      const key = parts[parts.length - 1];

      const tokenObj = {
        type: tokenType,
        value: valuesByBrand[brand.brandName][mode]
      };

      // For color token, add description (palette key if any)
      if (tokenType === "color") {
        let desc = null;
        if (typeof tokenObj.value === "string") {
          const d = extractPaletteDescription(tokenObj.value);
          if (d) desc = d;
        } else if (tokenObj.value && tokenObj.value.colors) {
          // For gradient, take first color stop palette key description if any
          for (const c of tokenObj.value.colors) {
            if (typeof c.value === "string") {
              const d = extractPaletteDescription(c.value);
              if (d) {
                desc = d;
                break;
              }
            }
          }
        }
        if (desc) tokenObj.description = desc;
      }

      target[key] = tokenObj;
    }

    saveBrand(brand);
    console.log(`✅ Updated brand "${brand.brandName}"`);
  }

  console.log("🎉 All done!");
})();
