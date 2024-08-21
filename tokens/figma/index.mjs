import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractJsonData from "./extractJsonData.mjs";
import { hexToRgba } from "./utils.mjs";
import { extractPaletteValue } from "./utils.mjs";

dotenv.config({ path: "../../.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_KEY_1 = process.env.FILE_KEY_1;
const FILE_KEY_2 = process.env.FILE_KEY_2;
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

const tokensPath = path.resolve(__dirname, "../");

const files = fs.readdirSync(tokensPath);

const jsonFiles = files.filter((file) =>
  file.endsWith(".json")
);

const jsonData = extractJsonData(
  jsonFiles,
  tokensPath
);

const brands = {
  blau: `https://api.figma.com/v1/files/${FILE_KEY_2}/variables`,
  "vivo-new": `https://api.figma.com/v1/files/${FILE_KEY_1}/variables`,
};

async function fetchAndUpdateVariables(
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

    const collectionNames = [
      "constants",
      "palette",
      "font-weight",
      "font-size",
      "line-height",
      "radius",
      "themeContext",
    ];

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

    function updateVariables(
      variableName,
      variableValue,
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
          value:
            variableType === "COLOR"
              ? hexToRgba(variableValue)
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
        const collectionId =
          newData.variableCollections.find(
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
          value:
            variableType === "COLOR"
              ? hexToRgba(variableValue)
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

async function processAndPostData(url, brand) {
  try {
    const newData = await fetchAndUpdateVariables(
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
      `Success for brand ${brand}:`,
      data
    );
  } catch (error) {
    console.error(
      `Error posting data for brand ${brand}:`,
      error
    );
  }
}

//process the data for an array of urls

async function processAllUrls(brands) {
  for (const [brand, url] of Object.entries(
    brands
  )) {
    await processAndPostData(url, brand);
  }
}

processAllUrls(brands);
