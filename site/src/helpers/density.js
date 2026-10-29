// Density-aware token leaves look like { density: { cozy, compact } }.
// Modes other than cozy are optional and fall back to cozy.
export const DENSITIES = { cozy: "Cozy", compact: "Compact" };

export const isDensityValue = (value) =>
  value !== null && typeof value === "object" && "density" in value;

export const resolveDensity = (value, density = "cozy") =>
  isDensityValue(value) ? value.density[density] ?? value.density.cozy : value;

export const hasDensity = (value) =>
  value !== null &&
  typeof value === "object" &&
  (isDensityValue(value) || Object.values(value).some(hasDensity));
