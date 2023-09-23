import hexToRgbA from "./hexToRgba";

function getColorValue(data, palette) {
  if (!data) {
    return undefined;
  }

  if (typeof data === "string") {
    // Check if the data contains a palette reference
    const match = data.match(/\{palette\.([^\}]+)\}/);
    if (match) {
      const paletteKey = match[1];
      const paletteValue = palette[paletteKey]?.value;
      if (!paletteValue) {
        return undefined; // Palette key not found
      }

      // Check if it's an RGBA value
      const rgbaMatch = data.match(/rgba\(\{palette\.(.*?)\},\s*([\d.]+)\)/);
      if (rgbaMatch) {
        const alphaValue = rgbaMatch[2];
        const paletteColor = palette[rgbaMatch[1]]?.value;

        if (!paletteColor) {
          return undefined; // RGBA palette color not found
        }
        // Call hexToRgbA function (assuming it's working correctly)
        return hexToRgbA(paletteColor, alphaValue);
      }

      return paletteValue; // Return the palette color value
    } else {
      return data; // No palette reference found, return the original string
    }
  } else if (typeof data === "object" && data.type === "color") {
    if (typeof data.value === "string") {
      return getColorValue(data.value, palette);
    } else {
      return undefined; // Invalid color object
    }
  }

  return undefined; // Unsupported data type
}

export default getColorValue;
