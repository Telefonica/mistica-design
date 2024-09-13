import fetch from "node-fetch";
import {
  updateCollections,
  COLLECTION_NAMES,
  VARIABLE_TYPES,
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
        collectionName: COLLECTION_NAMES.PALETTE,
        resolvedType: VARIABLE_TYPES.COLOR,
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
