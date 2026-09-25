function colorToHex(color) {
  // Check if the input color is in the format "rgb" or "rgba"
  if (color.startsWith("rgb")) {
    const rgbaValues = color.match(/[\d.]+/g).map(Number);

    if (rgbaValues.length === 3) {
      // RGB format
      const [r, g, b] = rgbaValues;
      return rgbToHex(r, g, b);
    } else if (rgbaValues.length === 4) {
      // RGBA format
      const [r, g, b, a] = rgbaValues;
      return rgbaToHex(r, g, b, a);
    }
  } else if (color.startsWith("#")) {
    // Hex color code format
    return color;
  }

  return null; // Invalid color format
}

function rgbToHex(r, g, b) {
  // Ensure that the values are within the valid range (0-255)
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Convert each value to its hexadecimal representation
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  // Concatenate the hexadecimal values with "#"
  const hexColor = `#${rHex}${gHex}${bHex}`;

  return hexColor;
}

function rgbaToHex(r, g, b, a) {
  // Ensure that the values are within the valid range (0-255)
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  a = Math.min(1, Math.max(0, a)); // Ensure alpha is in the range 0-1

  // Convert each value to its hexadecimal representation
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  // Convert alpha to a hexadecimal representation (0-255)
  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");

  // Concatenate the hexadecimal values with "#"
  const hexColor = `#${rHex}${gHex}${bHex}`;

  return hexColor;
}

export default colorToHex;
