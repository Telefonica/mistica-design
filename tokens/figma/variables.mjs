import {
  BRANDS,
  COLLECTION_NAMES,
  VARIABLE_TYPES,
  VARIABLE_SCOPES,
} from "./utils/constants.mjs";

import formatBrandName from "./utils/format-brand-name.mjs";

export const FONT_FAMILIES = {
  [BRANDS.AI_NATIVE_SOC]: "Telefonica Sans",
};

export const ICON_SETS = {
  [BRANDS.AI_NATIVE_SOC]: "Default",
};

export const BRAND_NAMES = {
  [BRANDS.AI_NATIVE_SOC]: "AI Native SOC",
};

export const getPaletteVariables = (
  jsonData,
  brand,
) => [
  {
    variables: jsonData[brand]?.palette || [],
    collectionName: COLLECTION_NAMES.PALETTE,
    resolvedType: VARIABLE_TYPES.COLOR,
    variableScopes: [VARIABLE_SCOPES.ALL_SCOPES],
    hasAlias: false,
  },
];

export const getConstantVariables = (
  jsonData,
  brand,
) => [
  {
    variables: jsonData[brand]?.light || [],
    collectionName: COLLECTION_NAMES.COLOR_SCHEME,
    resolvedType: VARIABLE_TYPES.COLOR,
    variableScopes: [VARIABLE_SCOPES.ALL_SCOPES],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.dark || [],
    collectionName: COLLECTION_NAMES.COLOR_SCHEME,
    resolvedType: VARIABLE_TYPES.COLOR,
    variableScopes: [VARIABLE_SCOPES.ALL_SCOPES],
    hasAlias: false,
  },
];

export const getNonColorVariables = (
  jsonData,
  brand,
) => [
  {
    variables: jsonData[brand]?.radius || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.FLOAT,
    variableScopes: [
      VARIABLE_SCOPES.CORNER_RADIUS,
      VARIABLE_SCOPES.TEXT_CONTENT,
    ],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.fontWeight || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [
      VARIABLE_SCOPES.FONT_WEIGHT,
      VARIABLE_SCOPES.TEXT_CONTENT,
    ],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.fontSize || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.FLOAT,
    variableScopes: [
      VARIABLE_SCOPES.FONT_SIZE,
      VARIABLE_SCOPES.TEXT_CONTENT,
    ],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.lineHeight || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.FLOAT,
    variableScopes: [
      VARIABLE_SCOPES.LINE_HEIGHT,
      VARIABLE_SCOPES.TEXT_CONTENT,
      VARIABLE_SCOPES.WIDTH_HEIGHT,
    ],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.spacing || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.FLOAT,
    variableScopes: [
      VARIABLE_SCOPES.WIDTH_HEIGHT,
      VARIABLE_SCOPES.GAP,
    ],
    hasAlias: false,
  },
  {
    variables:
      jsonData[brand]?.themeVariant || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [VARIABLE_SCOPES.ALL_SCOPES],
    hasAlias: false,
  },
  {
    variables:
      jsonData[brand]?.componentProperties || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [VARIABLE_SCOPES.ALL_SCOPES],
    hasAlias: false,
  },
  {
    variables: [
      {
        name: "fontFamily/fontFamily",
        value: FONT_FAMILIES[brand],
      },
    ],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [
      VARIABLE_SCOPES.FONT_FAMILY,
      VARIABLE_SCOPES.TEXT_CONTENT,
    ],
    hasAlias: false,
  },
  {
    variables: [
      {
        name: "utils/iconSet",
        value: ICON_SETS[brand],
      },
      {
        name: "utils/brandName",
        value: BRAND_NAMES[brand],
      },
    ],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [VARIABLE_SCOPES.ALL_SCOPES],
    hasAlias: false,
  },
];
