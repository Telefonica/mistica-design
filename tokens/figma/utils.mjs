export function hexToRgba(hex, alpha = 1) {
  // Remove the leading # if it's present
  hex = hex.replace(/^#/, "");

  // Expand shorthand form (e.g., "03F") to full form (e.g., "0033FF")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse the r, g, b values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  // Return the RGBA object with normalized values
  return {
    r,
    g,
    b,
    a: alpha,
  };
}

export function extractPaletteValue(constant) {
  // Convert value to a string if it's not already
  const valueStr = String(constant);

  // Default values
  let value = "";
  let alpha = 0;

  // Check if the value is an 'rgba' format
  if (valueStr.startsWith("rgba")) {
    const rgbaMatch = valueStr.match(
      /rgba\(\{([^}]+)}\s*,\s*(\d+\.?\d*)\)/
    );
    if (rgbaMatch) {
      value = rgbaMatch[1].replace(
        /^palette\./,
        ""
      ); // Remove 'palette.' prefix
      alpha = parseFloat(rgbaMatch[2]);
    }
  } else {
    // Extract palette name from curly braces
    const paletteMatch =
      valueStr.match(/\{([^}]+)\}/);
    if (paletteMatch) {
      // Remove the 'palette.' prefix if present
      const fullPaletteName = paletteMatch[1];
      value = fullPaletteName.replace(
        /^palette\./,
        ""
      );
    }
  }

  return {
    value,
    alpha,
  };
}
