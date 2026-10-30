function getAlpha(rgbaString) {
  const rgbaMatch = rgbaString.match(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/);
  if (rgbaMatch && rgbaMatch.length === 5) {
    const alpha = parseFloat(rgbaMatch[4]);
    if (!isNaN(alpha)) {
      const alphaPercentage = Math.round(alpha * 100);
      return `${alphaPercentage}%`;
    }
    return undefined; // Invalid or non-matching format
  }
}

export default getAlpha;
