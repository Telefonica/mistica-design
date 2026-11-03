function rgbaToHex(rgba) {
  const rgbaMatch = rgba.match(/rgba\((.*?),\s*(.*?),\s*(.*?),\s*(.*?)\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = parseFloat(rgbaMatch[4]);

    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");
    const aHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");

    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  return rgba; // Return as is if not a valid RGBA color
}

export default rgbaToHex;
