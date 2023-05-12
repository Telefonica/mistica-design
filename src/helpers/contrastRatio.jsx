function getContrastRatio(color1, color2) {
  // Helper function to convert hex color to RGB
  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

    const result = shorthandRegex.exec(hex) || fullHexRegex.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // Helper function to calculate relative luminance
  function getRelativeLuminance(color) {
    const { r, g, b } = color;
    const gamma = 2.2;

    const RsRGB = r / 255;
    const GsRGB = g / 255;
    const BsRGB = b / 255;

    const R =
      RsRGB <= 0.03928
        ? RsRGB / 12.92
        : Math.pow((RsRGB + 0.055) / 1.055, gamma);
    const G =
      GsRGB <= 0.03928
        ? GsRGB / 12.92
        : Math.pow((GsRGB + 0.055) / 1.055, gamma);
    const B =
      BsRGB <= 0.03928
        ? BsRGB / 12.92
        : Math.pow((BsRGB + 0.055) / 1.055, gamma);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  // Helper function to calculate contrast ratio
  function calculateContrastRatio(luminance1, luminance2) {
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Calculate the luminance values for each color
  const color1Rgb = color1.startsWith("#") ? hexToRgb(color1) : null;
  const color2Rgb = color2.startsWith("#") ? hexToRgb(color2) : null;

  const luminance1 =
    color1Rgb !== null
      ? getRelativeLuminance(color1Rgb)
      : getRelativeLuminance(color1);
  const luminance2 =
    color2Rgb !== null
      ? getRelativeLuminance(color2Rgb)
      : getRelativeLuminance(color2);

  // Calculate and return the contrast ratio
  return calculateContrastRatio(luminance1, luminance2).toFixed(1);
}

export default getContrastRatio;
