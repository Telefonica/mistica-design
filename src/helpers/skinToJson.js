function transformToJSON(rawCode) {
  // Regular expressions to match relevant patterns
  const paletteRegex = /export\s+const\s+palette\s*=\s*{\s*([^}]+)\s*};/s;
  const lightColorsRegex = /colors\s*:\s*{\s*([^}]+)\s*}/s;
  const darkColorsRegex = /darkModeColors\s*:\s*{\s*([^}]+)\s*}/s;
  const radiusRegex = /export\s+const\s+radius\s*=\s*{[^}]+};/s;

  // Function to extract information from code using regex
  const extractPalette = (code, regex) => {
    const match = code.match(regex);
    if (match) {
      const colorsBlock = match[1];

      const colorsArray = colorsBlock.match(/\s*(\w+):\s*'#[a-fA-F0-9]+'/g);

      if (colorsArray) {
        // Create a formatted JSON structure for each color with additional information
        const formattedColors = colorsArray.reduce((acc, color) => {
          const [key, value] = color.split(":");
          const trimmedKey = key.trim();
          const hexMatch = value.match(/'(#([a-fA-F0-9]){3,6})'/);

          if (hexMatch) {
            const [, hexColor] = hexMatch;
            acc[trimmedKey] = {
              value: hexColor,
              type: "color",
            };
          }

          return acc;
        }, {});

        return formattedColors;
      }
    }
    return null;
  };

  const extractColors = (code, regex) => {
    const match = code.match(regex);
    if (match) {
      const colorsBlock = match[1];

      const colorsArray = colorsBlock.match(
        /\s*(\w+):\s*(?:palette\.(\w+)|applyAlpha\(palette\.(\w+),\s*(\d*(?:\.\d+)?)\))/g
      );

      if (colorsArray) {
        // Create a formatted JSON structure for each color with additional information
        const formattedColors = colorsArray.reduce((acc, color) => {
          const [key, value] = color.split(":");
          const trimmedKey = key.trim();
          const match = value.match(
            /palette\.(\w+)|applyAlpha\(palette\.(\w+),\s*(\d*(?:\.\d+)?)\)/
          );

          if (match) {
            const [, paletteColor, alphaColor, alpha] = match;
            if (alpha) {
              acc[trimmedKey] = {
                value: `rgba({palette.${alphaColor}}, ${alpha})`,
                type: "color",
                description: alphaColor,
              };
            } else {
              acc[trimmedKey] = {
                value: `{palette.${paletteColor}}`,
                type: "color",
                description: paletteColor,
              };
            }
          }

          return acc;
        }, {});

        return formattedColors;
      }
    }
    return null;
  };

  const extractInfo = (code, regex) => {
    const match = code.match(regex);
    return match ? match[0] : null;
  };

  // Extract palette and getTuSkin information
  const paletteCode = extractPalette(rawCode, paletteRegex);
  const lightColors = extractColors(rawCode, lightColorsRegex);
  const darkColors = extractColors(rawCode, darkColorsRegex);
  const radiusValues = extractInfo(rawCode, radiusRegex);

  // Convert the extracted information to JSON
  const result = {
    light: lightColors,
    dark: darkColors,
    radius: radiusValues,
    text: { weight: {}, size: {}, lineHeight: {} },

    global: { palette: paletteCode },
  };

  return result;
}

export default transformToJSON;
