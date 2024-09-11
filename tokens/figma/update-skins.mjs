import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractJsonData from "./extract-json-data-skins.mjs";
import { updateCollections } from "./utils.mjs";

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
    ([brand, FILE_KEY]) => [brand, FILE_KEY]
  )
);

const collectionNames = ["Palette"];

async function updatePalette(
  jsonData,
  brand,
  FILE_KEY
) {
  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
      {
        method: "GET",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

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
        collectionName: "Palette",
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
  FILE_KEY
) {
  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
      {
        method: "GET",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN, // Use environment variable
          "Content-Type": "application/json",
        },
      }
    );

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

    function getVariableAliasId(
      variableName,
      collectionName,
      existingVariables,
      existingCollections
    ) {
      // Step 1: Find the collection
      const collection = Object.values(
        existingCollections
      ).find(
        (collection) =>
          collection.name === collectionName
      );

      if (!collection) {
        console.error("Collection not found.");
        return null;
      }

      // Step 2: Find the variable in the "palette" collection
      const variable = Object.values(
        existingVariables
      ).find(
        (variable) =>
          variable.variableCollectionId ===
            collection.id &&
          variable.name === variableName
      );

      if (!variable) {
        console.error(
          "Variable not found for name:",
          variableName
        );
        return null;
      }

      // Step 3: Retrieve the mode ID for the "palette" collection
      const modeId = collection.id;

      return {
        variableId: variable.id,
        modeId: modeId,
      };
    }

    function updateVariables(
      variableName,
      variableValue,
      hasAlias,
      collectionName,
      aliasedCollectionName,
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
                id: getVariableAliasId(
                  variableValue,
                  aliasedCollectionName,
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
                id: getVariableAliasId(
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
    ];

    variableGroups.forEach(
      ({
        variables,
        collectionName,
        aliasedCollectionName,
        resolvedType,
        variableScopes,
      }) => {
        variables.forEach((variable) => {
          updateVariables(
            variable.name,
            variable.value,
            variable.hasAlias,
            collectionName,
            aliasedCollectionName,
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


async function postCollections(brand, FILE_KEY) {
  try {
    const newData = await updateCollections(
      collectionNames,
      FILE_KEY,
      FIGMA_TOKEN
    );

    const response = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables/`,
      {
        method: "POST",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      }
    );

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

async function postPalette(brand, FILE_KEY) {
  try {
    const newData = await updatePalette(
      jsonData,
      brand,
      FILE_KEY
    );

    const response = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables/`,
      {
        method: "POST",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      }
    );

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

// Process data for a specific brand

async function processBrand(brand, FILE_KEY) {
  await postCollections(brand, FILE_KEY);
  await postPalette(brand, FILE_KEY);
}

// Process all brands

async function processAllBrands(brands) {
  for (const [brand, FILE_KEY] of Object.entries(
    brands
  )) {
    await processBrand(brand, FILE_KEY);
  }
}

// Get the selected brand from command line arguments

const selectedBrand = process.argv[2];

if (selectedBrand === "all") {
  processAllBrands(brands);
} else {
  const FILE_KEY = brands[selectedBrand];
  if (FILE_KEY) {
    processBrand(selectedBrand, FILE_KEY);
  } else {
    console.error(
      `Brand ${selectedBrand} not found.`
    );
  }
}
