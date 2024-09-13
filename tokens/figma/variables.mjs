import {
  BRANDS,
  COLLECTION_NAMES,
  VARIABLE_TYPES,
  VARIABLE_SCOPES,
} from "./utils/constants.mjs";

export const FONT_FAMILIES = {
  [BRANDS.MOVISTAR]: "On Air",
  [BRANDS.VIVO_NEW]: "Vivo Type",
  [BRANDS.O2_NEW]: "On Air",
  [BRANDS.TELEFONICA]: "Telefonica Sans",
  [BRANDS.BLAU]: "SF Pro Text",
  [BRANDS.TU]: "Telefonica Sans",
};

export const ICON_SETS = {
  [BRANDS.MOVISTAR]: "Default",
  [BRANDS.VIVO_NEW]: "Vivo",
  [BRANDS.O2_NEW]: "O2",
  [BRANDS.TELEFONICA]: "Default",
  [BRANDS.BLAU]: "Blau",
  [BRANDS.TU]: "Default",
};

export const getPaletteVariables = (
  jsonData,
  brand
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
  brand
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
  brand
) => [
  {
    variables: jsonData[brand]?.radius || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.FLOAT,
    variableScopes: [
      VARIABLE_SCOPES.CORNER_RADIUS,
    ],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.fontWeight || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [VARIABLE_SCOPES.FONT_WEIGHT],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.fontSize || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.FLOAT,
    variableScopes: [VARIABLE_SCOPES.FONT_SIZE],
    hasAlias: false,
  },
  {
    variables: jsonData[brand]?.lineHeight || [],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.FLOAT,
    variableScopes: [VARIABLE_SCOPES.LINE_HEIGHT],
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
    variables: [
      {
        name: "fontFamily/fontFamily",
        value: FONT_FAMILIES[brand],
      },
    ],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [VARIABLE_SCOPES.FONT_FAMILY],
    hasAlias: false,
  },
  {
    variables: [
      {
        name: "icons/iconSet",
        value: ICON_SETS[brand],
      },
    ],
    collectionName: COLLECTION_NAMES.SKIN,
    resolvedType: VARIABLE_TYPES.STRING,
    variableScopes: [VARIABLE_SCOPES.ALL_SCOPES],
    hasAlias: false,
  },
];
