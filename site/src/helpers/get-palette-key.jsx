function getPaletteKey(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  // if value is an object, return the first color value

  if (typeof value === "object" && value.colors) {
    const firstColor = value.colors[0]?.value;
    if (firstColor) {
      const match = firstColor.match(/\{palette\.([^\}]+)\}/);
      return match ? match[1] : null;
    }
  }

  // if value is a string, extract the palette key

  const match = value.match(/\{palette\.([^\}]+)\}/);
  return match ? match[1] : null;
}

export default getPaletteKey;
