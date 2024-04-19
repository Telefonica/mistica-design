import getColorValue from "./getColorValue";

export const generateCustomSkin = (skinName, skinData, palette) => {
  const designTokens = skinData;
  const skinConstantName = `${skinName.toUpperCase().replace(/-/g, "_")}_SKIN`;

  const colors = {};
  if (designTokens.light) {
    Object.entries(designTokens.light).forEach(([colorName, colorData]) => {
      colors[colorName] = getColorValue(colorData, palette);
    });
  }

  const darkColors = {};
  if (designTokens.dark) {
    Object.entries(designTokens.dark).forEach(([colorName, colorData]) => {
      darkColors[colorName] = getColorValue(colorData, palette);
    });
  }

  const radiusTokens = {};
  if (designTokens.radius) {
    Object.entries(designTokens.radius).forEach(
      ([radiusName, radiusDescription]) => {
        radiusTokens[radiusName] =
          radiusDescription.value === "circle"
            ? "50%"
            : radiusDescription.value + "px";
      }
    );
  }

  const textTokens = {};
  if (designTokens.text) {
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
  }

  return {
    name: skinConstantName,
    colors: colors,
    darkModeColors: darkColors,
    borderRadii: radiusTokens,
    textPresets: textTokens,
  };
};
