function hexToHsl(color) {
  if (color.startsWith("#")) {
    // Convert hex to HSL
    const bigint = parseInt(color.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;

    const max = Math.max(normalizedR, normalizedG, normalizedB);
    const min = Math.min(normalizedR, normalizedG, normalizedB);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case normalizedR:
          h =
            (normalizedG - normalizedB) / d +
            (normalizedG < normalizedB ? 6 : 0);
          break;
        case normalizedG:
          h = (normalizedB - normalizedR) / d + 2;
          break;
        case normalizedB:
          h = (normalizedR - normalizedG) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }

    const hDegrees = Math.round(h * 360);
    const sPercent = Math.round(s * 100);
    const lPercent = Math.round(l * 100);

    return `hsl(${hDegrees}, ${sPercent}%, ${lPercent}%)`;
  } else if (color.startsWith("rgba")) {
    // Convert RGBA to HSLA
    const rgbaMatch = color.match(
      /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
    );
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      const a = parseFloat(rgbaMatch[4]);

      const normalizedR = r / 255;
      const normalizedG = g / 255;
      const normalizedB = b / 255;

      const max = Math.max(normalizedR, normalizedG, normalizedB);
      const min = Math.min(normalizedR, normalizedG, normalizedB);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case normalizedR:
            h =
              (normalizedG - normalizedB) / d +
              (normalizedG < normalizedB ? 6 : 0);
            break;
          case normalizedG:
            h = (normalizedB - normalizedR) / d + 2;
            break;
          case normalizedB:
            h = (normalizedR - normalizedG) / d + 4;
            break;
          default:
            break;
        }
        h /= 6;
      }

      const hDegrees = Math.round(h * 360);
      const sPercent = Math.round(s * 100);
      const lPercent = Math.round(l * 100);

      return `hsla(${hDegrees}, ${sPercent}%, ${lPercent}%, ${a})`;
    }
  }

  return color; // Return as is if not a valid color
}

export default hexToHsl;
