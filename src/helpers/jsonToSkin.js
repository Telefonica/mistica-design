const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const toPascalCase = (str) => capitalize(toCamelCase(str));

const buildColor = (colorDescription) => {
  let colorValue = colorDescription.value;

  // Check if colorValue is an object (gradient)
  if (
    typeof colorValue === "object" &&
    colorValue.angle &&
    Array.isArray(colorValue.colors)
  ) {
    // Handle gradient object
    const { angle, colors } = colorValue;

    const stops = colors
      .map((stop) => {
        let stopValue = stop.value;

        // Handle `applyAlpha(palette.color, alpha)`
        let stopMatch = stopValue.match(
          /applyAlpha\((palette\.(\w+)),\s*([\d.]+)\)/
        );
        if (stopMatch) {
          const [, , color, alpha] = stopMatch;
          return `applyAlpha({palette.${color}}, ${alpha}) ${stop.stop * 100}%`;
        }

        // Handle `palette.color`
        stopMatch = stopValue.match(/palette\.(\w+)/);
        if (stopMatch) {
          const [, color] = stopMatch;
          return `{palette.${color}} ${stop.stop * 100}%`;
        }

        return stopValue; // Return for solid color stops
      })
      .join(", ");

    return `linear-gradient(${angle}deg, ${stops})`;
  }

  // If colorValue is a string, handle it as a simple color or alpha
  if (typeof colorValue === "string") {
    // Handle `applyAlpha(palette.color, alpha) X%`
    const colorWithAlphaRegExp = /rgba\(\{(.+)\}, (0\.\d+)\)/;
    const colorWithAlphaMatches = colorValue.match(colorWithAlphaRegExp);
    if (colorWithAlphaMatches) {
      const colorName = colorWithAlphaMatches[1];
      const alpha = colorWithAlphaMatches[2];
      return `applyAlpha(${colorName}, ${alpha})`;
    }

    // Return the raw color if no special formatting is needed
    return colorValue.replace("{", "").replace("}", "");
  }

  // If it's neither a string nor an object, just return it as-is
  return colorValue;
};

const buildRadius = (radiusDescription) => {
  if (radiusDescription.value.endsWith("%")) {
    return radiusDescription.value;
  }
  if (radiusDescription.value === "circle") {
    return "50%";
  }
  if (radiusDescription.value.endsWith("px")) {
    return radiusDescription.value;
  }
  if (/\d+/.test(radiusDescription.value)) {
    return `${radiusDescription.value}px`;
  }

  throw new Error(`Unknown radius format: ${radiusDescription.value}`);
};

export const generateSkin = (skinName, skinData) => {
  const needsApplyAlphaImport = skinData?.includes("rgba");
  const designTokens = JSON.parse(skinData);
  const skinConstantName = `${skinName.toUpperCase().replace(/-/g, "_")}_SKIN`;

  const textTokens = {};
  Object.entries(designTokens.text).forEach(
    ([textAttribute, textAttributeConfig]) => {
      Object.entries(textAttributeConfig).forEach(
        ([textPresetName, { value }]) => {
          if (!textTokens[textPresetName]) {
            textTokens[textPresetName] = {};
          }
          textTokens[textPresetName][textAttribute] = value;
        }
      );
    }
  );

  return `
import {${skinConstantName}} from './constants';
${needsApplyAlphaImport ? `import {applyAlpha} from '../utils/color';` : ""}

import type {GetKnownSkin, KnownSkin} from './types';

export const palette = {
    ${Object.entries(designTokens.global.palette)
      .map(
        ([colorName, colorDescription]) =>
          `${colorName}: '${colorDescription.value}'`
      )
      .join(",")}
};

export const get${toPascalCase(skinName)}Skin: GetKnownSkin = () => {
    const skin: KnownSkin = {
        name: ${skinConstantName},
        colors: {
            ${Object.entries(designTokens.light)
              .map(
                ([colorName, colorDescription]) =>
                  `${colorName}: ${buildColor(colorDescription)}`
              )
              .join(",")}
        },
        darkModeColors: {
            ${Object.entries(designTokens.dark)
              .map(
                ([colorName, colorDescription]) =>
                  `${colorName}: ${buildColor(colorDescription)}`
              )
              .join(",")}
        },
        borderRadii: {
            ${Object.entries(designTokens.radius)
              .map(
                ([radiusName, radiusDescription]) =>
                  `${radiusName}: '${buildRadius(radiusDescription)}'`
              )
              .join(",")}
        },
        textPresets: ${JSON.stringify(textTokens)},
    };
    return skin;
};
`;
};
