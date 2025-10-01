function transformToJSON(rawCode) {
  // Regular expressions to match relevant patterns
  const paletteRegex = /export\s+const\s+palette\s*=\s*{\s*([^}]+)\s*};/s;

  // Adjusting the regex to handle multi-line colors and avoid breaking inside gradients
  const lightColorsRegex = /colors\s*:\s*{\s*([\s\S]+?)\s*}\s*,/;
  const darkColorsRegex = /darkModeColors\s*:\s*{\s*([\s\S]+?)\s*}\s*,/;
  const radiusRegex = /borderRadii\s*:\s*{\s*([\s\S]+?)\s*},?/;
  const textRegex = /textPresets\s*:\s*{([\s\S]*?)}\s*,/;
  const themeVariantRegex = /themeVariants\s*:\s*{\s*([\s\S]+?)\s*},?/;

  // Function to extract the palette
  const extractPalette = (code, regex) => {
    const match = code.match(regex);
    if (match) {
      const colorsBlock = match[1];
      const colorsArray = colorsBlock.match(/\s*(\w+):\s*'#[a-fA-F0-9]+'/g);

      if (colorsArray) {
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

  // Function to extract light/dark colors
  const extractColors = (code, regex) => {
    const match = code.match(regex);
    if (!match) return null;

    const colorsBlock = match[1];
    const colorsArray = colorsBlock
      .split("\n")
      .filter((line) => line.includes(":"));

    if (!colorsArray.length) return null;

    return colorsArray.reduce((acc, line) => {
      const [key, value] = line.split(":");
      if (!value) return acc;

      const trimmedKey = key.trim();
      let trimmedValue = value.trim();

      console.log(trimmedValue);

      // Handle linear-gradient values (multi-line gradients and template literals)
      if (trimmedValue.startsWith("`linear-gradient")) {
        // Remove backticks at the beginning and end
        trimmedValue = trimmedValue.slice(1, -1);

        // Now process the gradient, splitting the angle and stops
        const gradientMatch = trimmedValue.match(
          /linear-gradient\((\d+)deg,\s*(.+)\)/
        );

        console.log(gradientMatch);

        if (gradientMatch) {
          const angle = parseInt(gradientMatch[1], 10);
          const stopsRaw = gradientMatch[2].split(/,\s*(?![^()]*\))/); // Split stops correctly

          const stops = stopsRaw
            .map((stop) => {
              stop = stop.trim();

              // Handle `applyAlpha(palette.color, alpha) X%`
              let stopMatch = stop.match(
                /applyAlpha\((palette\.(\w+)),\s*([\d.]+)\)\s*(\d+)%?/
              );

              if (stopMatch) {
                const [, , color, alpha, stopValue] = stopMatch;
                return {
                  value: `rgba({palette.${color}}, ${alpha})`,
                  stop: parseFloat(stopValue) / 100,
                };
              }

              // Handle `palette.color X%`
              stopMatch = stop.match(/palette\.(\w+)\s*(\d+)%?/);
              if (stopMatch) {
                const [, color, stopValue] = stopMatch;
                return {
                  value: `{palette.${color}}`,
                  stop: parseFloat(stopValue) / 100,
                };
              }

              // For solid colors, return as palette reference
              // Remove `${}` from template literals in the gradient
              stop = stop.replace(/\${(palette\.[^}]+)}/g, "{$1}"); // Remove $ and curly braces
              return {
                value: stop,
                stop: 0, // Default stop if no percentage is provided
              };
            })
            .filter(Boolean);

          if (stops.length > 0) {
            acc[trimmedKey] = {
              type: "linear-gradient",
              value: {
                angle,
                colors: stops,
              },
              description: trimmedKey,
            };
          }

          return acc;
        }
      }

      // Handle non-gradient values (solid colors)
      trimmedValue = trimmedValue.replace(/\${(palette\.[^}]+)}/g, "{$1}");
      trimmedValue = trimmedValue.replace(
        /\${applyAlpha\((palette\.[^,]+),\s*([\d.]+)\)}/g,
        (match, color, alpha) => `rgba({${color}}, ${alpha})`
      );

      // Detect solid color references
      let colorMatch = trimmedValue.match(
        /palette\.(\w+)|applyAlpha\(palette\.(\w+),\s*([\d.]+)\)/
      );
      if (colorMatch) {
        const [, paletteColor, alphaColor, alpha] = colorMatch;
        acc[trimmedKey] = {
          value: alpha
            ? `rgba({palette.${alphaColor}}, ${alpha})`
            : `{palette.${paletteColor}}`,
          type: "color",
          description: alpha ? alphaColor : paletteColor,
        };
      }

      return acc;
    }, {});
  };

  // Function to extract border radius values
  const extractRadius = (code, regex) => {
    const match = code.match(regex);
    if (!match) return null;

    const block = match[1];
    const lines = block.split("\n").filter((line) => line.includes(":"));

    return lines.reduce((acc, line) => {
      const [key, value] = line.split(":");
      if (!value) return acc;

      const name = key.trim();
      let raw = value.replace(/['",]/g, "").trim();

      // remove px if present (e.g., "999px" → "999")
      if (raw.endsWith("px")) raw = raw.slice(0, -2);

      acc[name] = { value: raw, type: "borderRadius" };
      return acc;
    }, {});
  };

  function extractTypography(code) {
    const typography = { weight: {}, size: {}, lineHeight: {} };

    // 1️⃣ Find where textPresets starts
    const startMatch = code.match(/textPresets\s*:\s*{/);
    if (!startMatch) return typography;

    let startIndex = startMatch.index + startMatch[0].length - 1;

    // 2️⃣ Walk to find the matching closing brace
    let depth = 1;
    let endIndex = startIndex + 1;

    while (depth > 0 && endIndex < code.length) {
      const char = code[endIndex];
      if (char === "{") depth++;
      else if (char === "}") depth--;
      endIndex++;
    }

    // 3️⃣ Extract the object literal as string
    const objLiteral = code.slice(startIndex, endIndex);

    try {
      // 4️⃣ Evaluate the object literal
      const presets = Function(`"use strict"; return (${objLiteral})`)();

      // 5️⃣ Transform into the expected token format
      for (const [name, def] of Object.entries(presets)) {
        if (def.weight)
          typography.weight[name] = { value: def.weight, type: "typography" };
        if (def.size)
          typography.size[name] = { value: def.size, type: "typography" };
        if (def.lineHeight)
          typography.lineHeight[name] = {
            value: def.lineHeight,
            type: "typography",
          };
      }
    } catch (err) {
      console.error("Failed to parse textPresets:", err);
    }

    return typography;
  }

  const extractThemeVariant = (code, regex) => {
    const match = code.match(regex);
    if (!match) return null;

    const block = match[1];
    const lines = block.split("\n").filter((line) => line.includes(":"));

    return lines.reduce((acc, line) => {
      const [key, value] = line.split(":");
      if (!value) return acc;

      acc[key.trim()] = {
        value: value.replace(/['",]/g, "").trim(),
        type: "themeVariant",
      };
      return acc;
    }, {});
  };

  // Extract information
  const paletteCode = extractPalette(rawCode, paletteRegex);
  const lightColors = extractColors(rawCode, lightColorsRegex);
  const darkColors = extractColors(rawCode, darkColorsRegex);
  const radiusValues = extractRadius(rawCode, radiusRegex);
  const themeVariant = extractThemeVariant(rawCode, themeVariantRegex);
  const text = extractTypography(rawCode);

  // Convert the extracted information to JSON
  const result = {
    light: lightColors,
    dark: darkColors,
    radius: radiusValues,
    themeVariant,
    text,
    global: { palette: paletteCode },
  };

  return result;
}

export default transformToJSON;
