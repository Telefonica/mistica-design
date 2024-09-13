import fetch from "node-fetch";
import {
  updateCollections,
  updateOrCreateVariables,
  updateOrCreateVariableModeValues,
  COLLECTION_NAMES,
  VARIABLE_TYPES,
  MODE_NAMES,
} from "./utils.mjs";

const collectionNames = [
  COLLECTION_NAMES.PALETTE,
];

async function updatePalette(
  jsonData,
  brand,
  FILE_KEY,
  FIGMA_TOKEN
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

    const variableGroups = [
      {
        variables: jsonData[brand].palette,
        collectionName: COLLECTION_NAMES.PALETTE,
        resolvedType: VARIABLE_TYPES.COLOR,
        variableScopes: ["ALL_SCOPES"],
        hasAlias: false,
      },
    ];

    for (const group of variableGroups) {
      const {
        variables,
        collectionName,
        resolvedType,
        variableScopes,
        hasAlias,
      } = group;

      for (const variable of variables) {
        // Update or create the variable in the collection
        const variablesUpdateResult =
          await updateOrCreateVariables({
            variable: {
              ...variable,
              resolvedType: resolvedType,
              scopes: variableScopes,
              hasAlias: hasAlias,
            },
            targetCollectionName: collectionName,
            existingVariables: existingVariables,
            existingCollections:
              existingCollections,
          });

        if (!newData.variables) {
          newData.variables = [];
        }
        newData.variables.push(
          variablesUpdateResult
        );

        // Find the mode for the current brand and set the mode values correctly
        const variableModeValuesUpdatedResult =
          await updateOrCreateVariableModeValues({
            variable: {
              ...variable,
              resolvedType: resolvedType,
              scopes: variableScopes,
              hasAlias: hasAlias,
            },
            targetModeName: MODE_NAMES.DEFAULT,
            targetCollectionName: collectionName,
            existingCollections:
              existingCollections,
            existingVariables: existingVariables,
          });

        newData.variableModeValues.push(
          variableModeValuesUpdatedResult
        );
      }
    }

    return newData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // rethrow the error to be handled later
  }
}

async function postCollections(
  brand,
  FILE_KEY,
  FIGMA_TOKEN
) {
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

async function postPalette(
  jsonData,
  brand,
  FILE_KEY,
  FIGMA_TOKEN
) {
  try {
    const newData = await updatePalette(
      jsonData,
      brand,
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

async function processBrand(
  jsonData,
  brand,
  FILE_KEY,
  FIGMA_TOKEN
) {
  await postCollections(
    brand,
    FILE_KEY,
    FIGMA_TOKEN
  );
  await postPalette(
    jsonData,
    brand,
    FILE_KEY,
    FIGMA_TOKEN
  );
}

export async function updateSkinFiles(
  jsonData,
  brands,
  FIGMA_TOKEN
) {
  for (const [brand, FILE_KEY] of Object.entries(
    brands
  )) {
    await processBrand(
      jsonData,
      brand,
      FILE_KEY,
      FIGMA_TOKEN
    );
  }
}
