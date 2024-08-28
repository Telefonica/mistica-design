import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractJsonData from "./extractJsonData.mjs";

dotenv.config({ path: "../../.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

const FILE_KEYS = {
  // Remember to sync these with the workflow file
  movistar: process.env.MOVISTAR_FILE_KEY,
  "o2-new": process.env.O2_NEW_FILE_KEY,
  "vivo-new": process.env.VIVO_NEW_FILE_KEY,
  telefonica: process.env.TELEFONICA_FILE_KEY,
  blau: process.env.BLAU_FILE_KEY,
  tu: process.env.TU_FILE_KEY,
};

const tokensPath = path.resolve(__dirname, "../");

const files = fs.readdirSync(tokensPath);

const jsonFiles = files.filter((file) =>
  file.endsWith(".json")
);

const jsonData = extractJsonData(
  jsonFiles,
  tokensPath
);

const brands = Object.fromEntries(
  Object.entries(FILE_KEYS).map(
    ([brand, FILE_KEY]) => [
      brand,
      `https://api.figma.com/v1/files/${FILE_KEY}/variables`,
    ]
  )
);

async function updateCollections(url) {
  try {
    const response = await fetch(`${url}/local`, {
      method: "GET",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const figmaData = await response.json();

    const newData = {
      variableCollections: [],
      variableModes: [],
      variables: [],
      variableModeValues: [],
    };

    const existingCollections =
      figmaData.meta.variableCollections;

    const collectionNames = [
      "constants",
      "palette",
      "font-weight",
      "font-size",
      "line-height",
      "radius",
    ];

    function generateTempId(name) {
      return `tempId_${name}`;
    }

    function updateCollection(
      collectionName,
      existingCollections
    ) {
      // Find the existing collection by name
      const existingCollection = Object.values(
        existingCollections
      ).find(
        (collection) =>
          collection.name === collectionName
      );

      if (existingCollection) {
        // If the collection exists, update it
        newData.variableCollections.push({
          action: "UPDATE",
          id: existingCollection.id,
          name: collectionName,
        });
      } else {
        // If the collection doesn't exist, create it
        const tempId = generateTempId(
          collectionName
        );
        newData.variableCollections.push({
          action: "CREATE",
          id: tempId,
          name: collectionName,
        });
      }
    }

    // Process each collection name
    collectionNames.forEach((collectionName) => {
      updateCollection(
        collectionName,
        existingCollections
      );
    });

    // Return the processed data for further use
    return newData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // rethrow the error to be handled later
  }
}

async function updatePalette(
  jsonData,
  brand,
  url
) {
  try {
    const response = await fetch(`${url}/local`, {
      method: "GET",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const figmaData = await response.json();

    const existingVariables =
      figmaData.meta.variables;
    const existingCollections =
      figmaData.meta.variableCollections;

    const newData = {
      variableCollections: [],
      variableModes: [],
      variables: [],
      variableModeValues: [],
    };

    function findVariableInCollection(
      variableName,
      collectionName,
      existingVariables,
      existingCollections
    ) {
      return Object.values(
        existingVariables
      ).find((variable) => {
        // Check if the variable name matches
        if (variable.name !== variableName)
          return false;

        // Find the collection in existingCollections using variableCollectionId
        const collection = Object.values(
          existingCollections
        ).find(
          (col) =>
            col.id ===
            variable.variableCollectionId
        );

        // Check if the collection exists, its name matches the collectionName,
        // and if the variable's id is listed in the collection's variableIds
        return (
          collection &&
          collection.name === collectionName &&
          collection.variableIds.includes(
            variable.id
          )
        );
      });
    }

    function generateTempId(name, collection) {
      return `tempId_${collection}_${name}`;
    }

    const allVariableNamesInCurrentData =
      new Set();

    function updateVariables(
      variableName,
      variableValue,
      collectionName,
      existingVariables,
      existingCollections,
      variableType,
      variableScopes,
      allVariableNamesInCurrentData
    ) {
      // Find the existing variable by name
      const existingVariable =
        findVariableInCollection(
          variableName,
          collectionName,
          existingVariables,
          existingCollections
        );

      // Find the default mode for the collection

      const existingMode = Object.values(
        existingCollections
      ).find(
        (collection) =>
          collection.name === collectionName
      ).defaultModeId;

      if (existingVariable) {
        // If the variable exists, update it
        newData.variables.push({
          action: "UPDATE",
          id: existingVariable.id,
          name: variableName,
          resolvedType: variableType,
          variableCollectionId:
            existingVariable.variableCollectionId,
          scopes: variableScopes,
        });

        newData.variableModeValues.push({
          action: "UPDATE",
          variableId: existingVariable.id,
          modeId: existingMode,
          value: variableValue,
        });
      } else {
        const tempId = generateTempId(
          variableName,
          collectionName
        );

        const collectionId = Object.values(
          existingCollections
        ).find(
          (collection) =>
            collection.name === collectionName
        ).id;

        newData.variables.push({
          action: "CREATE",
          id: tempId,
          name: variableName,
          variableCollectionId: collectionId,
          resolvedType: variableType,
          scopes: variableScopes,
        });

        newData.variableModeValues.push({
          action: "CREATE",
          variableId: tempId,
          modeId: existingMode,
          value: variableValue,
        });

        allVariableNamesInCurrentData.add(
          variableName
        );
      }
    }

    const variableGroups = [
      {
        variables: jsonData[brand].palette,
        collectionName: "palette",
        resolvedType: "COLOR",
        variableScopes: ["ALL_SCOPES"],
      },
    ];

    variableGroups.forEach(
      ({
        variables,
        collectionName,
        resolvedType,
        variableScopes,
      }) => {
        variables.forEach((variable) => {
          updateVariables(
            variable.name,
            variable.value,
            collectionName,
            existingVariables,
            existingCollections,
            resolvedType,
            variableScopes,
            allVariableNamesInCurrentData
          );
        });
      }
    );

    return newData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // rethrow the error to be handled later
  }
}

async function updateVariables(
  jsonData,
  brand,
  url
) {
  try {
    const response = await fetch(`${url}/local`, {
      method: "GET",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN, // Use environment variable
        "Content-Type": "application/json",
      },
    });

    const figmaData = await response.json();

    // Figma variables

    const existingVariables =
      figmaData.meta.variables;
    const existingCollections =
      figmaData.meta.variableCollections;

    // Initialize the data object for POST request
    const newData = {
      variableCollections: [],
      variableModes: [],
      variables: [],
      variableModeValues: [],
    };

    function generateTempId(name, collection) {
      return `tempId_${collection}_${name}`;
    }

    function findVariableInCollection(
      variableName,
      collectionName,
      existingVariables,
      existingCollections
    ) {
      return Object.values(
        existingVariables
      ).find((variable) => {
        // Check if the variable name matches
        if (variable.name !== variableName)
          return false;

        // Find the collection in existingCollections using variableCollectionId
        const collection = Object.values(
          existingCollections
        ).find(
          (col) =>
            col.id ===
            variable.variableCollectionId
        );

        // Check if the collection exists, its name matches the collectionName,
        // and if the variable's id is listed in the collection's variableIds
        return (
          collection &&
          collection.name === collectionName &&
          collection.variableIds.includes(
            variable.id
          )
        );
      });
    }

    function getPaletteAlias(
      variableName,
      existingVariables,
      existingCollections
    ) {
      // Step 1: Find the "palette" collection
      const paletteCollection = Object.values(
        existingCollections
      ).find(
        (collection) =>
          collection.name === "palette"
      );

      if (!paletteCollection) {
        console.error(
          "Palette collection not found."
        );
        return null;
      }

      // Step 2: Find the variable in the "palette" collection
      const paletteVariable = Object.values(
        existingVariables
      ).find(
        (variable) =>
          variable.variableCollectionId ===
            paletteCollection.id &&
          variable.name === variableName
      );

      if (!paletteVariable) {
        console.error(
          "Palette variable not found for name:",
          variableName
        );
        return null;
      }

      // Step 3: Retrieve the mode ID for the "palette" collection
      const modeId = paletteCollection.id;

      return {
        variableId: paletteVariable.id,
        modeId: modeId,
      };
    }

    function updateVariables(
      variableName,
      variableValue,
      hasAlias,
      collectionName,
      existingVariables,
      existingCollections,
      variableType,
      variableScopes
    ) {
      // Find the existing variable by name
      const existingVariable =
        findVariableInCollection(
          variableName,
          collectionName,
          existingVariables,
          existingCollections
        );

      // Find the default mode for the collection

      const existingMode = Object.values(
        existingCollections
      ).find(
        (collection) =>
          collection.name === collectionName
      ).defaultModeId;

      if (existingVariable) {
        // If the variable exists, update it
        newData.variables.push({
          action: "UPDATE",
          id: existingVariable.id,
          name: variableName,
          resolvedType: variableType,
          variableCollectionId:
            existingVariable.variableCollectionId,
          scopes: variableScopes,
        });

        newData.variableModeValues.push({
          action: "UPDATE",
          variableId: existingVariable.id,
          modeId: existingMode,
          value: hasAlias
            ? {
                type: "VARIABLE_ALIAS",
                id: getPaletteAlias(
                  variableValue,
                  existingVariables,
                  existingCollections
                ).variableId,
              }
            : variableValue,
        });
        allVariableNamesInCurrentData.add(
          variableName
        );
      } else {
        // If the variable doesn't exist, create it
        const tempId = generateTempId(
          variableName,
          collectionName
        );

        const collectionId = Object.values(
          existingCollections
        ).find(
          (collection) =>
            collection.name === collectionName
        ).id;

        newData.variables.push({
          action: "CREATE",
          id: tempId,
          name: variableName,
          variableCollectionId: collectionId,
          resolvedType: variableType,
          scopes: variableScopes,
        });

        newData.variableModeValues.push({
          action: "CREATE",
          variableId: tempId,
          modeId: existingMode,
          value: hasAlias
            ? {
                type: "VARIABLE_ALIAS",
                id: getPaletteAlias(
                  variableValue,
                  existingVariables,
                  existingCollections
                ).variableId,
              }
            : variableValue,
        });

        allVariableNamesInCurrentData.add(
          variableName
        );
      }
    }

    function removeUnusedVariables(
      existingVariables,
      currentJsonVariables
    ) {
      // Identify and delete variables that are not in the current data
      Object.values(existingVariables).forEach(
        (variable) => {
          if (
            !currentJsonVariables.has(
              variable.name
            )
          ) {
            newData.variables.push({
              action: "DELETE",
              id: variable.id,
            });
          }
        }
      );
    }

    const allVariableNamesInCurrentData =
      new Set();

    const variableGroups = [
      {
        variables: jsonData[brand].palette,
        collectionName: "palette",
        resolvedType: "COLOR",
        variableScopes: ["ALL_SCOPES"],
      },
      {
        variables: jsonData[brand].light,
        collectionName: "constants",
        resolvedType: "COLOR",
        variableScopes: ["ALL_SCOPES"],
      },
      {
        variables: jsonData[brand].dark,
        collectionName: "constants",
        resolvedType: "COLOR",
        variableScopes: ["ALL_SCOPES"],
      },
      {
        variables: jsonData[brand].radius,
        collectionName: "radius",
        resolvedType: "FLOAT",
        variableScopes: ["CORNER_RADIUS"],
      },
      {
        variables: jsonData[brand].fontWeight,
        collectionName: "font-weight",
        resolvedType: "STRING",
        variableScopes: ["FONT_WEIGHT"],
      },
      {
        variables: jsonData[brand].fontSize,
        collectionName: "font-size",
        resolvedType: "FLOAT",
        variableScopes: ["FONT_SIZE"],
      },
      {
        variables: jsonData[brand].lineHeight,
        collectionName: "line-height",
        resolvedType: "FLOAT",
        variableScopes: ["LINE_HEIGHT"],
      },
    ];

    variableGroups.forEach(
      ({
        variables,
        collectionName,
        resolvedType,
        variableScopes,
      }) => {
        variables.forEach((variable) => {
          updateVariables(
            variable.name,
            variable.value,
            variable.hasAlias,
            collectionName,
            existingVariables,
            existingCollections,
            resolvedType,
            variableScopes,
            allVariableNamesInCurrentData
          );
        });
      }
    );

    removeUnusedVariables(
      existingVariables,
      allVariableNamesInCurrentData
    );

    // Return the processed data for further use
    return newData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // rethrow the error to be handled later
  }
}

// Use an async function to handle the post request after data processing

async function postCollections(url, brand) {
  try {
    const newData = await updateCollections(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    const data = await response.json();
    console.log(
      `Success creating collections for brand ${brand}:`,
      data
    );
  } catch (error) {
    console.error(
      `Error creating collections for for brand ${brand}:`,
      error
    );
  }
}

async function postPalette(url, brand) {
  try {
    const newData = await updatePalette(
      jsonData,
      brand,
      url
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    const data = await response.json();
    console.log(
      `Success updating palette for brand ${brand}:`,
      data
    );
  } catch (error) {
    console.error(
      `Error updating palette for brand ${brand}:`,
      error
    );
  }
}

async function postVariables(url, brand) {
  try {
    const newData = await updateVariables(
      jsonData,
      brand,
      url
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    const data = await response.json();
    console.log(
      `Success updating variables for brand ${brand}:`,
      data
    );
  } catch (error) {
    console.error(
      `Error updating variables for brand ${brand}:`,
      error
    );
  }
}

// Process data for a specific brand

async function processBrand(brand, url) {
  await postCollections(url, brand);
  await postPalette(url, brand);
  await postVariables(url, brand);
}

// Process all brands

async function processAllBrands(brands) {
  for (const [brand, url] of Object.entries(
    brands
  )) {
    await processBrand(brand, url);
  }
}

// Get the selected brand from command line arguments

const selectedBrand = process.argv[2];

if (selectedBrand === "all") {
  processAllBrands(brands);
} else {
  const url = brands[selectedBrand];
  if (url) {
    processBrand(selectedBrand, url);
  } else {
    console.error(
      `Brand ${selectedBrand} not found.`
    );
  }
}
