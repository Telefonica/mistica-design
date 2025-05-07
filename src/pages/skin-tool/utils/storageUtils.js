
// This file provides utility functions and constants for managing skin configuration data in localStorage. 
// It defines storage keys, default values, and functions to get/set items, mark the flow as completed, and generate a final skin configuration JSON. 
// It ensures persistence and retrieval of user selections across the skin creation flow.

// Storage keys for localStorage
const STORAGE_KEYS = {
    COLORS: 'skinColors',
    TYPOGRAPHY: 'skinTypography',
    BORDER: 'skinBorder',
    FLOW_COMPLETED: 'flowCompleted',
    SKIN_NAME: 'skinName',
  };
  
  // Default values for the skin configuration. * Should all variables appear?
  const DEFAULT_VALUES = {
    colors: {
      brandColor: '#0066FF',
      successColor: '#FFFFFF',
      errorColor: '#FFFFFF',
      warningColor: '#FFFFFF',
      promoColor: '#777777',
      neutral1: '#FFFFFF',
      neutral2: '#FFFFFF',
      neutral3: '#FFFFFF'
    },
    typography: {
      font: 'Telefonica Sans',
      weight: 'regular'
    },
    border: {
      radius: 4,
      roundedButtons: true
    },
     skinName: 'custom-skin'
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
  const generateSkinConfig = () => {
    if (!isFlowCompleted()) {
      throw new Error('Flujo no completado');
    }
  
    const colors = getStorageItem(STORAGE_KEYS.COLORS, DEFAULT_VALUES.colors);
    const typography = getStorageItem(STORAGE_KEYS.TYPOGRAPHY, DEFAULT_VALUES.typography);
    const border = getStorageItem(STORAGE_KEYS.BORDER, DEFAULT_VALUES.border);
    const skinName = getStorageItem(STORAGE_KEYS.SKIN_NAME, DEFAULT_VALUES.skinName);
  
    return {
      name: skinName,
      colors: {
        brand: colors.brandColor,
        success: colors.successColor,
        error: colors.errorColor,
        warning: colors.warningColor,
        promo: colors.promoColor,
        background: colors.neutral1,
        backgroundAlternative: colors.neutral2,
        borderLow: colors.neutral3,
        // Should return the rest of color variables or only the ones skin tool lets you choose?
      },
      typography: {
        fontFamily: typography.font,
        fontWeight: typography.weight
      },
      borderRadius: border.radius,
      roundedButtons: border.roundedButtons
    };
  };
  
  export {
    STORAGE_KEYS,
    DEFAULT_VALUES,
    getStorageItem,
    setStorageItem,
    generateSkinConfig,
    markFlowAsCompleted,
    isFlowCompleted,
    resetFlow
  };