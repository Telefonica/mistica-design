// This file provides utility functions and constants for managing skin configuration data in localStorage.
// It defines storage keys, default values, and functions to get/set items, mark the flow as completed, and generate a final skin configuration JSON.
// It ensures persistence and retrieval of user selections across the skin creation flow.

import { colorTokens } from "./skinContract.js";

// Storage keys for localStorage
const STORAGE_KEYS = {
  COLORS: "skinColors",
  TYPOGRAPHY: "skinTypography",
  BORDER: "skinBorder",
  FLOW_COMPLETED: "flowCompleted",
  SKIN_NAME: "skinName",
};

// Default values for the skin configuration. * Should all variables appear?
const DEFAULT_VALUES = {
  colors: {
    brandColor: "#0066FF",
    successColor: "#FFFFFF",
    errorColor: "#FFFFFF",
    warningColor: "#FFFFFF",
    promoColor: "#777777",
    neutral1: "#FFFFFF",
    neutral2: "#FFFFFF",
    neutral3: "#FFFFFF",
  },
  typography: {
    font: "Telefonica Sans",
    weight: "regular",
  },
  border: {
    radius: 4,
    roundedButtons: true,
  },
  skinName: "custom-skin",
};

const isTokenKey = (key) => {
  // Obtener todas las claves de tokens de todos los grupos
  const allTokenKeys = [];
  Object.values(colorTokens).forEach((group) => {
    Object.keys(group).forEach((tokenKey) => {
      allTokenKeys.push(tokenKey);
    });
  });

  return allTokenKeys.includes(key);
};

// Function to retrieve an item from localStorage with a fallback to default value
const getStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

// Function to set an item in localStorage
const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Function to mark the skin creation flow as completed
const markFlowAsCompleted = () => {
  setStorageItem(STORAGE_KEYS.FLOW_COMPLETED, true);
};

// Function to check if the flow is completed
const isFlowCompleted = () => {
  return getStorageItem(STORAGE_KEYS.FLOW_COMPLETED, false);
};

// Function to reset the flow completion status
const resetFlow = () => {
  localStorage.removeItem(STORAGE_KEYS.FLOW_COMPLETED);
};

// Function to generate the final skin configuration JSON (only if the flow is completed)
const generateExportJSON = (colorsObject, skinName) => {
  // Definimos los colores core
  const coreColors = [
    "brandColor",
    "errorColor",
    "warningColor",
    "successColor",
    "promoColor",
    "neutral1",
    "neutral2",
    "neutral3",
  ];

  // Creamos la estructura base del objeto de exportación
  const exportData = {
    light: {},
    dark: {},
    radius: {
      avatar: { value: "circle", type: "borderRadius" },
      bar: { value: "999", type: "borderRadius" },
      button: { value: "4", type: "borderRadius" },
      checkbox: { value: "2", type: "borderRadius" },
      container: { value: "8", type: "borderRadius" },
      indicator: { value: "999", type: "borderRadius" },
      input: { value: "8", type: "borderRadius" },
      legacyDisplay: { value: "16", type: "borderRadius" },
      popup: { value: "8", type: "borderRadius" },
      sheet: { value: "8", type: "borderRadius" },
      mediaSmall: { value: "8", type: "borderRadius" },
    },
    text: {
      weight: {
        cardTitle: { value: "bold", type: "typography" },
        button: { value: "medium", type: "typography" },
        tabsLabel: { value: "medium", type: "typography" },
        link: { value: "medium", type: "typography" },
        title1: { value: "medium", type: "typography" },
        title2: { value: "bold", type: "typography" },
        title3: { value: "bold", type: "typography" },
        indicator: { value: "medium", type: "typography" },
        navigationBar: { value: "medium", type: "typography" },
        text5: { value: "bold", type: "typography" },
        text6: { value: "bold", type: "typography" },
        text7: { value: "bold", type: "typography" },
        text8: { value: "bold", type: "typography" },
        text9: { value: "bold", type: "typography" },
        text10: { value: "bold", type: "typography" },
      },
      size: {
        tabsLabel: { value: { mobile: 16, desktop: 18 }, type: "typography" },
        title3: { value: { mobile: 20, desktop: 28 }, type: "typography" },
        text1: { value: { mobile: 12, desktop: 14 }, type: "typography" },
        text2: { value: { mobile: 14, desktop: 16 }, type: "typography" },
        text3: { value: { mobile: 16, desktop: 18 }, type: "typography" },
        text4: { value: { mobile: 18, desktop: 20 }, type: "typography" },
        text5: { value: { mobile: 20, desktop: 28 }, type: "typography" },
        text6: { value: { mobile: 24, desktop: 32 }, type: "typography" },
        text7: { value: { mobile: 28, desktop: 40 }, type: "typography" },
        text8: { value: { mobile: 32, desktop: 48 }, type: "typography" },
        text9: { value: { mobile: 40, desktop: 56 }, type: "typography" },
        text10: { value: { mobile: 48, desktop: 64 }, type: "typography" },
      },
      lineHeight: {
        tabsLabel: { value: { mobile: 24, desktop: 24 }, type: "typography" },
        title3: { value: { mobile: 24, desktop: 32 }, type: "typography" },
        text1: { value: { mobile: 16, desktop: 20 }, type: "typography" },
        text2: { value: { mobile: 20, desktop: 24 }, type: "typography" },
        text3: { value: { mobile: 24, desktop: 24 }, type: "typography" },
        text4: { value: { mobile: 24, desktop: 28 }, type: "typography" },
        text5: { value: { mobile: 24, desktop: 32 }, type: "typography" },
        text6: { value: { mobile: 32, desktop: 40 }, type: "typography" },
        text7: { value: { mobile: 32, desktop: 48 }, type: "typography" },
        text8: { value: { mobile: 40, desktop: 56 }, type: "typography" },
        text9: { value: { mobile: 48, desktop: 64 }, type: "typography" },
        text10: { value: { mobile: 56, desktop: 72 }, type: "typography" },
      },
    },
    themeVariant: {
      successFeedback: { value: "default", type: "themeVariant" },
      brandLoadingScreen: { value: "default", type: "themeVariant" },
    },
    global: {
      palette: {},
    },
  };

  // Procesar los colores de la paleta (colores core y personalizados)
  Object.entries(colorsObject).forEach(([key, value]) => {
    // Si es un color core o personalizado (no es token), va en global.palette
    if (
      coreColors.includes(key) ||
      (!coreColors.includes(key) && !isTokenKey(key))
    ) {
      // Formatear el valor del color según la estructura requerida
      exportData.global.palette[key] = {
        value: value,
        type: "color",
      };
    }
    // Si es un token, va en light
    else if (isTokenKey(key)) {
      // Buscar el color correspondiente en la paleta para establecer la referencia
      let paletteColorName = "";
      let foundMatch = false;

      // Primero buscar en los colores core
      for (const coreKey of coreColors) {
        if (colorsObject[coreKey] === value) {
          paletteColorName = coreKey;
          foundMatch = true;
          break;
        }
      }

      // Si no se encuentra en core, buscar en colores personalizados
      if (!foundMatch) {
        for (const [customKey, customValue] of Object.entries(colorsObject)) {
          if (
            customValue === value &&
            !coreColors.includes(customKey) &&
            !isTokenKey(customKey)
          ) {
            paletteColorName = customKey;
            foundMatch = true;
            break;
          }
        }
      }

      // Si se encontró una coincidencia, usar la referencia a la paleta
      if (foundMatch) {
        exportData.light[key] = {
          value: `{palette.${paletteColorName}}`,
          type: "color",
          description: paletteColorName,
        };
      } else {
        // Si no hay coincidencia, usar el valor directo
        exportData.light[key] = {
          value: value,
          type: "color",
          description: value.toLowerCase(),
        };
      }
    }
  });

  // También añadir entradas para tokens que no tengan un valor asignado
  Object.values(colorTokens).forEach((tokenGroup) => {
    Object.keys(tokenGroup).forEach((tokenKey) => {
      if (!exportData.light[tokenKey]) {
        exportData.light[tokenKey] = {
          value: "",
          type: "color",
          description: "",
        };
      }
    });
  });

  return exportData;
};

export {
  STORAGE_KEYS,
  DEFAULT_VALUES,
  getStorageItem,
  setStorageItem,
  generateExportJSON,
  markFlowAsCompleted,
  isFlowCompleted,
  resetFlow,
};
