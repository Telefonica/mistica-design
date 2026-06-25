export const VARIABLE_TYPES = {
  COLOR: "COLOR",
  FLOAT: "FLOAT",
  STRING: "STRING",
  FONT_WEIGHT: "FONT_WEIGHT",
  FONT_SIZE: "FONT_SIZE",
  LINE_HEIGHT: "LINE_HEIGHT",
  FONT_FAMILY: "FONT_FAMILY",
};

export const COLLECTION_NAMES = {
  SKIN: "Brand",
  COLOR_SCHEME: "Mode",
  PALETTE: "Palette",
};

export const MODE_NAMES = {
  DEFAULT: "Mode 1",
  LIGHT: "Light",
  DARK: "Dark",
};

export const VARIABLE_SCOPES = {
  ALL_SCOPES: "ALL_SCOPES",
  CORNER_RADIUS: "CORNER_RADIUS",
  FONT_WEIGHT: "FONT_WEIGHT",
  FONT_SIZE: "FONT_SIZE",
  LINE_HEIGHT: "LINE_HEIGHT",
  FONT_FAMILY: "FONT_FAMILY",
  TEXT_CONTENT: "TEXT_CONTENT",
  WIDTH_HEIGHT: "WIDTH_HEIGHT",
  GAP: "GAP",
};

export const BRANDS = {
  MOVISTAR: "movistar",
  MOVISTAR_NEW: "movistar-new",
  VIVO_NEW: "vivo-new",
  O2_NEW: "o2-new",
  TELEFONICA: "telefonica",
  BLAU: "blau",
  TU: "tu",
  ESIMFLAG: "esimflag",
  CYBER: "cyber",
};

// Subset of BRANDS whose token file lives in tokens/community/.
// These are surfaced in Figma with a " (Community)" suffix on
// their Brand-collection mode name (see format-brand-name.mjs).
export const COMMUNITY_BRANDS = [BRANDS.CYBER];
