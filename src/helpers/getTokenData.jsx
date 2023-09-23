import { transform } from "typescript";
import getColorValue from "./getColorValue";

const transformRadiusValue = (value) => {
  if (value.endsWith("%")) {
    return value;
  } else if (value.includes("circle")) {
    return "50%";
  } else {
    return `${value}px`;
  }
};

export const getRadiusData = (skinData, currentToken) => {
  const tokenData = [];

  for (const skinName in skinData) {
    if (skinData.hasOwnProperty(skinName)) {
      const skin = skinData[skinName];
      const radiusTokens = skin.radius;

      for (const tokenName in radiusTokens) {
        if (radiusTokens.hasOwnProperty(tokenName)) {
          if (!currentToken || tokenName === currentToken) {
            const tokenValue = transformRadiusValue(
              radiusTokens[tokenName].value
            );

            tokenData.push({
              skinName,
              tokenName,
              tokenValue,
            });
          }
        }
      }
    }
  }

  return tokenData;
};

export const getWeightData = (skinData, currentToken) => {
  const tokenData = [];

  for (const skinName in skinData) {
    if (skinData.hasOwnProperty(skinName)) {
      const skin = skinData[skinName];
      const weightTokens = skin.text?.weight;

      if (weightTokens) {
        for (const tokenName in weightTokens) {
          if (weightTokens.hasOwnProperty(tokenName)) {
            if (!currentToken || tokenName === currentToken) {
              const tokenValue = weightTokens[tokenName].value;

              tokenData.push({
                skinName,
                tokenName,
                tokenValue,
              });
            }
          }
        }
      }
    }
  }

  return tokenData;
};

export const getSizeData = (skinData, currentToken) => {
  const tokenData = [];

  for (const skinName in skinData) {
    if (skinData.hasOwnProperty(skinName)) {
      const skin = skinData[skinName];
      const sizeTokens = skin.text?.size;

      if (sizeTokens) {
        for (const tokenName in sizeTokens) {
          if (sizeTokens.hasOwnProperty(tokenName)) {
            if (!currentToken || tokenName === currentToken) {
              const tokenValueMobile = sizeTokens[tokenName].value?.mobile;
              const tokenValueDesktop = sizeTokens[tokenName].value?.desktop;

              tokenData.push({
                skinName,
                tokenName,
                tokenValueMobile,
                tokenValueDesktop,
              });
            }
          }
        }
      }
    }
  }

  return tokenData;
};

export const getLineHeightData = (skinData, currentToken) => {
  const tokenData = [];

  for (const skinName in skinData) {
    if (skinData.hasOwnProperty(skinName)) {
      const skin = skinData[skinName];
      const lineHeightTokens = skin.text?.lineHeight;

      if (lineHeightTokens) {
        for (const tokenName in lineHeightTokens) {
          if (lineHeightTokens.hasOwnProperty(tokenName)) {
            if (!currentToken || tokenName === currentToken) {
              const tokenValueMobile = lineHeightTokens[tokenName].value.mobile;
              const tokenValueDesktop =
                lineHeightTokens[tokenName].value.desktop;

              tokenData.push({
                skinName,
                tokenName,
                tokenValueMobile,
                tokenValueDesktop,
              });
            }
          }
        }
      }
    }
  }

  return tokenData;
};

export const getColorData = (skinData, currentColor, colorScheme) => {
  const tokenData = [];

  for (const skinName in skinData) {
    if (skinData.hasOwnProperty(skinName)) {
      const skin = skinData[skinName];

      if (skin[colorScheme]) {
        const tokens = skin[colorScheme];

        for (const tokenName in tokens) {
          if (tokens.hasOwnProperty(tokenName)) {
            if (!currentColor || tokenName === currentColor) {
              const tokenValue = getColorValue(
                tokens[tokenName].value,
                skin.global.palette
              );

              const paletteValue = tokens[tokenName].description;

              tokenData.push({
                skinName,
                tokenName,
                paletteValue,
                tokenValue,
              });
            }
          }
        }
      }
    }
  }

  return tokenData;
};
