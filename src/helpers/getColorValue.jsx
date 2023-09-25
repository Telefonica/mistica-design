import hexToRgbA from "./hexToRgba";

function getColorValue(data, palette) {
  // If the data is undefined, return undefined.
  if (!data) {
    return undefined;
  }

  // If the data is a string, check if it contains a palette reference.
  if (typeof data === "string") {
    // If the data contains a palette reference, get the palette value.
    const match = data.match(/\{palette\.([^\}]+)\}/);
    if (match) {
      const paletteKey = match[1];
      const paletteValue = palette[paletteKey]?.value;

      // If the palette key is not found, return undefined.
      if (!paletteValue) {
        return undefined;
      }

      // If the data is an RGBA value, get the alpha value and palette color.
      const rgbaMatch = data.match(/rgba\(\{palette\.(.*?)\},\s*([\d.]+)\)/);
      if (rgbaMatch) {
        const alphaValue = rgbaMatch[2];
        const paletteColor = palette[rgbaMatch[1]]?.value;

        // If the RGBA palette color is not found, return undefined.
        if (!paletteColor) {
          return undefined;
        }

        // Call the hexToRgbA function to convert the palette color to RGBA.
        return hexToRgbA(paletteColor, alphaValue);
      }

      // If the data is not an RGBA value, return the palette value.
      return paletteValue;
    } else {
      // If the data does not contain a palette reference, return the original string.
      return data;
    }
  }

  // If the data is an object with a type of "color", get the value of the object.
  if (typeof data === "object" && data.type === "color") {
    // If the value of the object is a string, get the color value from the palette.
    if (typeof data.value === "string") {
      return getColorValue(data.value, palette);
    } else {
      // If the value of the object is not a string, return undefined.
      return undefined;
    }
  }

  // If the data type is not supported, return undefined.
  return undefined;
}

export default getColorValue;
