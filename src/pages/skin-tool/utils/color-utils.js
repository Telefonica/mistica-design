// This file centralizes all color-related utility functions for the skin tool.
// It includes functions to generate color scales, convert between color formats,
// and render color scales in the UI with automatic text color contrast.

import { Align, Text1 } from "@telefonica/mistica";

/**
 * Helper function to convert hue to RGB values
 * @param {number} p - First parameter for hue conversion
 * @param {number} q - Second parameter for hue conversion
 * @param {number} t - Third parameter for hue conversion
 * @returns {number} - RGB component value
 */
const hueToRgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

/**
 * Converts HSL values to RGB
 * @param {number} h - Hue (0-1)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {number[]} - Array of [r, g, b] values (0-255)
 */
const hslToRgb = (h, s, l) => {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Converts RGB values to HEX string
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {string} - HEX color string (e.g., "#FF0000")
 */
const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("")}`;

/**
 * Converts HEX color to HSL values
 * @param {string} hex - HEX color string (e.g., "#FF0000")
 * @returns {Object} - Object with h, s, l properties (all 0-1)
 */
const hexToHsl = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        throw new Error("Unexpected max value in color scale calculation");
    }
    h /= 6;
  }

  return { h, s, l };
};

/**
 * Generates a color scale from a base HEX color
 * @param {string} baseColor - Base color in HEX format (e.g., "#FF0000")
 * @param {number} darkCount - Number of darker shades to generate (default: 4)
 * @param {number} lightCount - Number of lighter shades to generate (default: 4)
 * @returns {string[]} - Array of HEX color values forming a scale
 */
const getColorScale = (baseColor, darkCount = 4, lightCount = 4) => {
  const { h, s, l } = hexToHsl(baseColor);
  const colorScale = [];

  // Generate darker colors (shades)
  for (let i = 1; i <= darkCount; i++) {
    const newL = l * (1 - i * 0.1);
    const [nr, ng, nb] = hslToRgb(h, s, newL);
    colorScale.unshift(rgbToHex(nr, ng, nb));
  }

  // Add base color
  colorScale.push(baseColor);

  // Generate lighter colors (tints)
  for (let i = 1; i <= lightCount; i++) {
    const newL = l + (1 - l) * (i * 0.1);
    const [nr, ng, nb] = hslToRgb(h, s, newL);
    colorScale.push(rgbToHex(nr, ng, nb));
  }

  return colorScale;
};

/**
 * Generates React component props for rendering a color scale
 * @param {string[]} scale - Array of HEX color values
 * @returns {Object} - Object with props for rendering upper and lower rows of the color scale
 */
const getColorScaleRenderProps = (scale) => {
  if (!scale || scale.length === 0) {
    return {
      upperRowColors: [],
      lowerRowColors: [],
      upperRowTones: [],
      lowerRowTones: [],
    };
  }

  // Upper row: lighter shades using color-mix
  const upperRowColors = [...Array(scale.length - 1)].map((_, index) => {
    const lightness = (index + 1) / scale.length;
    return `color-mix(in srgb, white ${(1 - lightness) * 100}%, ${
      scale[scale.length - 1]
    })`;
  });

  // Lower row: darker shades from the scale
  const lowerRowColors = scale.slice(0, scale.length - 1);

  // Calculate tone numbers (100, 200, 300, etc.)
  // Determine the total number of colors in the scale (excluding base color)
  const totalColors = upperRowColors.length + lowerRowColors.length;

  // Calculate step size to ensure we reach 900 for the darkest color
  const step = Math.floor(800 / totalColors);

  // For upper row (lighter colors): start with 100 and increment by step
  const upperRowTones = upperRowColors.map((_, index) => 100 + index * step);

  // For lower row (darker colors): continue from upper row tones, ensuring the darkest is 900
  const lowerRowTones = [];
  for (let i = 0; i < lowerRowColors.length; i++) {
    // If this is the last (darkest) color, set it to 900
    if (i === lowerRowColors.length - 1) {
      lowerRowTones.unshift(900);
    } else {
      // Otherwise calculate based on position
      lowerRowTones.unshift(100 + (upperRowColors.length + i + 1) * step);
    }
  }

  return { upperRowColors, lowerRowColors, upperRowTones, lowerRowTones };
};

/**
 * Renders a color scale as React JSX
 * @param {string} key - Unique key for the component
 * @param {string[]} scale - Array of HEX color values
 * @param {React.Component} Stack - Stack component from Mística
 * @param {React.Component} Inline - Inline component from Mística
 * @returns {JSX.Element} - React component for rendering the color scale
 */
const renderColorScale = (key, scale, Stack, Inline) => {
  const { upperRowColors, lowerRowColors, upperRowTones, lowerRowTones } =
    getColorScaleRenderProps(scale);

  return (
    <Stack space={0} key={key}>
      <Inline space={0} fullWidth>
        {upperRowColors.map((color, index) => (
          <div
            key={index}
            className="colorScale"
            style={{
              backgroundColor: color,
            }}
          >
            <Align x="center" y="center">
              <Text1 color={getContrastTextColor(color)} medium>
                {upperRowTones[index]}
              </Text1>
            </Align>
          </div>
        ))}
      </Inline>
      <Inline space={0} fullWidth>
        {lowerRowColors.map((color, index) => (
          <div
            key={index}
            className="colorScale"
            style={{
              backgroundColor: color,
            }}
          >
            <Align x="center" y="center">
              <Text1 color={getContrastTextColor(color)} medium>
                {lowerRowTones[index]}
              </Text1>
            </Align>
          </div>
        ))}
      </Inline>
    </Stack>
  );
};

/**
 * Calculates the relative luminance of a color
 * @param {string} color - Color in HEX format (e.g., "#FF0000")
 * @returns {number} - Relative luminance value (0-1)
 */
const getRelativeLuminance = (color) => {
  // Remove # if present
  color = color.replace(/^#/, "");

  // Parse the hex values
  const r = parseInt(color.slice(0, 2), 16) / 255;
  const g = parseInt(color.slice(2, 4), 16) / 255;
  const b = parseInt(color.slice(4, 6), 16) / 255;

  // Calculate relative luminance using the sRGB color space formula
  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Determines the best text color (black or white) based on background color
 * @param {string} backgroundColor - Background color in HEX format or CSS color-mix
 * @returns {string} - "#000000" for black text or "#FFFFFF" for white text
 */
const getContrastTextColor = (backgroundColor) => {
  // For color-mix values, extract the final color
  if (backgroundColor.startsWith("color-mix")) {
    // Extract the percentage and color from the color-mix
    const whitePercentMatch = backgroundColor.match(/white\s+(\d+)%/);
    const hexColorMatch = backgroundColor.match(/[#][a-fA-F0-9]{6}/);

    if (whitePercentMatch && hexColorMatch) {
      const whitePercent = parseInt(whitePercentMatch[1]);
      // If white percentage is very high, we can assume it's a light color
      if (whitePercent > 70) {
        return "#000000"; // Use black text for very light backgrounds
      }
      backgroundColor = hexColorMatch[0]; // Use the hex color for further calculation
    } else {
      return "#000000"; // Default to black if we can't parse
    }
  }

  const luminance = getRelativeLuminance(backgroundColor);

  // Use white text on dark backgrounds, black text on light backgrounds
  // The threshold 0.5 is a common value, but can be adjusted for better results
  return luminance < 0.5 ? "#FFFFFF" : "#000000";
};
// Export all color utility functions
export {
  getColorScale,
  getColorScaleRenderProps,
  renderColorScale,
  hexToHsl,
  hslToRgb,
  rgbToHex,
  getRelativeLuminance,
  getContrastTextColor,
};

// For backward compatibility
export default getColorScale;
