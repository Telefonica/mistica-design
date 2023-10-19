import getColorValue from "../helpers/getColorValue";
import colorToHex from "./rgbaToHex";

// Define the extractColors function

function extractColors(skinData) {
  const colors = skinData?.light ? {} : null;
  const darkModeColors = skinData?.dark ? {} : null;

  if (skinData?.light) {
    Object.keys(skinData.light).forEach((key) => {
      colors[key] = getColorValue(
        colorToHex(skinData.light[key].value),
        skinData.global.palette
      );
    });
  }

  if (skinData?.dark) {
    Object.keys(skinData.dark).forEach((key) => {
      darkModeColors[key] = getColorValue(
        colorToHex(skinData.dark[key].value),
        skinData.global.palette
      );
    });
  }
  console.log(colors, darkModeColors);

  return { colors, darkModeColors };
}

// Define the extractPresets function
function extractPresets(skinData) {
  const transformedData = { textPresets: {} };

  for (const textKey in skinData.text.weight) {
    const weight = skinData.text.weight[textKey].value;
    const sizeData = skinData.text.size[textKey]?.value;
    const lineHeightData = skinData.text.lineHeight[textKey]?.value;

    const preset = { weight };

    if (sizeData || lineHeightData) {
      preset.size = {};

      if (sizeData) {
        preset.size.mobile = sizeData.mobile;
        preset.size.desktop = sizeData.desktop;
      }

      if (lineHeightData) {
        preset.lineHeight = {};

        if (lineHeightData.mobile) {
          preset.lineHeight.mobile = lineHeightData.mobile;
        }

        if (lineHeightData.desktop) {
          preset.lineHeight.desktop = lineHeightData.desktop;
        }
      }
    }

    transformedData.textPresets[textKey] = preset;
  }

  return transformedData;
}

// Define the extractBorderRadii function
function extractBorderRadii(skinData) {
  const borderRadii = { borderRadii: {} };

  for (const key in skinData.radius) {
    let value = skinData.radius[key].value;
    // Replace "circle" with "50%"
    if (value === "circle") {
      value = "50%";
    } else {
      value = `${value}px`;
    }
    borderRadii.borderRadii[key] = value; // Store the value in the correct property
  }

  return borderRadii;
}

// Define the SkinDataTransformer function
export function SkinDataTransformer(skinData, skinName = "customSkin") {
  const skin = {};

  if (skinData && Object.keys(skinData).length > 0) {
    const colors = extractColors(skinData);
    const presets = extractPresets(skinData); // Transform skinData structure
    const borderRadii = extractBorderRadii(skinData); // Transform skinData structure

    skin.name = skinName;
    skin.colors = colors.colors;
    skin.darkModeColors = colors.darkModeColors;
    skin.borderRadii = borderRadii.borderRadii;
    skin.textPresets = presets.textPresets;
  }

  return skin;
}
