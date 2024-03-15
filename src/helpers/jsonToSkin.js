const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const toPascalCase = (str) => capitalize(toCamelCase(str));

const buildColor = (colorDescription) => {
  if (
    colorDescription.value.startsWith("{") &&
    colorDescription.value.endsWith("}")
  ) {
    return colorDescription.value.replace("{", "").replace("}", "");
  }

  const colorWithAlphaRegExp = /rgba\(\{(.+)\}, (0\.\d+)\)/;
  const colorWithAlphaMatches =
    colorDescription.value.match(colorWithAlphaRegExp);
  if (colorWithAlphaMatches) {
    const colorName = colorWithAlphaMatches[1];
    const alpha = colorWithAlphaMatches[2];
    return `applyAlpha(${colorName}, ${alpha})`;
  }

  throw new Error(`Unknown color format: ${colorDescription.value}`);
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
          `${colorName}:'${colorDescription.value}'`
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
