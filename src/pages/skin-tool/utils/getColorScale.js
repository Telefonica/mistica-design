// This file defines utility functions to generate a color scale from a base color. 
// It converts HEX to HSL, adjusts lightness to create darker and lighter shades, and converts back to HEX. 
// The main function `getColorScale` returns an array of color values for use in the UI color picker.

// To-do: simplify color shading by adapting each scale to the color brightness: if it's too dark, most light color shades should appear and viceversa.

const hueToRgb = (p, q, t) => {
  //helper function to convert hue to RGB values
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const hslToRgb = (h, s, l) => {
    // Function to convert HSL values to RGB
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1/3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1/3);
    }
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  };
  
  const rgbToHex = (r, g, b) => 
    // Function to convert RGB values to HEX string
    `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  
  const getColorScale = (baseColor, darkCount = 4, lightCount = 4) => {
    // Main function to generate a color scale from a base HEX color
    const r = parseInt(baseColor.slice(1, 3), 16) / 255;
    const g = parseInt(baseColor.slice(3, 5), 16) / 255;
    const b = parseInt(baseColor.slice(5, 7), 16) / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: 
        throw new Error('Unexpected max value in color scale calculation');
      }
      h /= 6;
    }
  
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
  
  export default getColorScale;