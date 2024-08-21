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

const FILE_KEY = process.env.FILE_KEY;
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const postUrl = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;
const getUrl = `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`;

const tokensPath = path.resolve(__dirname, "../");

const files = fs.readdirSync(tokensPath);

const jsonFiles = files.filter((file) =>
  file.endsWith("blau.json")
);

const jsonData = extractJsonData(
  jsonFiles,
  tokensPath
);

async function fetchAndUpdateVariables(jsonData) {
  try {
    const response = await fetch(getUrl, {
      method: "GET",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN, // Use environment variable
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Figma variables

    const existingVariables = data.meta.variables;
    const existingCollections =
      data.meta.variableCollections;

    // JSON variables

    const paletteVariables =
      jsonData.blau.palette;
    const lightVariables = jsonData.blau.light;
    const darkVariables = jsonData.blau.dark;
    const radiusVariables = jsonData.blau.radius;
    const fontWeightVariables =
      jsonData.blau.fontWeight;
    const fontSizeVariables =
      jsonData.blau.fontSize;
    const lineHeightVariables =
      jsonData.blau.lineHeight;

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
      variableType
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

    paletteVariables.forEach((variable) => {
      updateVariables(
        variable.name,
        variable.value,
        "palette",
        existingVariables,
        existingCollections,
        "COLOR",
        allVariableNamesInCurrentData
      );
    });

    radiusVariables.forEach((variable) => {
      updateVariables(
        variable.name,
        variable.value,
        "radius",
        existingVariables,
        existingCollections,
        "FLOAT",
        allVariableNamesInCurrentData
      );
    });

    fontWeightVariables.forEach((variable) => {
      updateVariables(
        variable.name,
        variable.value,
        "font-weight",
        existingVariables,
        existingCollections,
        "FLOAT",
        allVariableNamesInCurrentData
      );
    });

    fontSizeVariables.forEach((variable) => {
      updateVariables(
        variable.name,
        variable.value,
        "font-size",
        existingVariables,
        existingCollections,
        "FLOAT",
        allVariableNamesInCurrentData
      );
    });

    lineHeightVariables.forEach((variable) => {
      updateVariables(
        variable.name,
        variable.value,
        "line-height",
        existingVariables,
        existingCollections,
        "FLOAT",
        allVariableNamesInCurrentData
      );
    });

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

async function processAndPostData() {
  try {
    const newData = await fetchAndUpdateVariables(
      jsonData
    );

    const response = await fetch(postUrl, {
      method: "POST",
      headers: {
        "X-Figma-Token": process.env.FIGMA_TOKEN, // Use environment variable
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Start the process
processAndPostData();
