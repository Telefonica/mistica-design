import { COMMUNITY_BRANDS } from "./constants.mjs";

function formatBaseBrandName(brand) {
  // Check if the brand is telefonica and return it as sentence case and with an accent
  if (brand === "telefonica") {
    return "Telefónica";
  }

  if (brand === "esimflag") {
    return "eSimFLAG";
  }

  // For other brands, remove the hyphen and convert to sentence case
  return brand
    .replace(/-/g, " ") // Remove hyphens and replace with spaces
    .toLowerCase() // Convert all to lowercase first
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    ); // Capitalize the first letter of each word
}

function formatBrandName(brand) {
  const formatted = formatBaseBrandName(brand);

  // Community brands are surfaced with a " (Community)" suffix
  return COMMUNITY_BRANDS.includes(brand)
    ? `${formatted} (Community)`
    : formatted;
}

export default formatBrandName;
