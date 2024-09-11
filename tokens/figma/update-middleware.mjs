import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractJsonData from "./extract-json-data-middleware.mjs";
import {
  updateCollections,
  updateOrCreateVariable,
  updateOrCreateVariableModeValues,
  generateTempModeId,
} from "./utils.mjs";

dotenv.config({ path: "../../.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const MIDDLEWARE_TOKEN =
  process.env.MIDDLEWARE_KEY;

const tokensPath = path.resolve(__dirname, "../");

const files = fs.readdirSync(tokensPath);

const jsonFiles = files.filter((file) =>
  file.endsWith(".json")
);
const jsonData = extractJsonData(
  jsonFiles,
  tokensPath
);

const brands = [
  "movistar",
  "vivo-new",
  "o2-new",
  "telefonica",
  "blau",
  "tu",
];

function formatBrandName(brand) {
  // Check if the brand is "tu" and return it in uppercase
  if (brand === "tu") {
    return brand.toUpperCase();
  }

  // Check if the brand is telefonica and return it as sentence case and with an accent
  if (brand === "telefonica") {
    return "Telefónica";
  }

  // For other brands, remove the hyphen and convert to sentence case
  return brand
    .replace(/-/g, " ") // Remove hyphens and replace with spaces
    .toLowerCase() // Convert all to lowercase first
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    ); // Capitalize the first letter of each word
}

async function updateTheme(
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

    function findVariableByName(
      variableName,
      collectionName
    ) {
      return Object.values(
        existingVariables
      ).find((variable) => {
        const collection =
          existingCollections[
            variable.variableCollectionId
          ];
        return (
          collection &&
          collection.name === collectionName &&
          variable.name === variableName
        );
      });
    }

    function findModeByName(
      collection,
      modeName
    ) {
      return collection.modes.find(
        (mode) => mode.name === modeName
      );
    }

    function generateUniqueTempId(
      name,
      collection
    ) {
      return `tempId_${collection}_${name}_${Date.now()}`;
    }

    const updateModes = (collectionName) => {
      const collection = Object.values(
        existingCollections
      ).find(
        (col) => col.name === collectionName
      );
      if (!collection) return;

      const defaultMode = collection.modes.find(
        (mode) =>
          mode.modeId === collection.defaultModeId
      );
      if (
        defaultMode &&
        defaultMode.name !== "Light"
      ) {
        newData.variableModes.push({
          action: "UPDATE",
          id: defaultMode.modeId,
          variableCollectionId: collection.id,
          name: "Light",
        });
      }

      const darkMode = findModeByName(
        collection,
        "Dark"
      );
      if (!darkMode) {
        newData.variableModes.push({
          action: "CREATE",
          id: "Dark",
          variableCollectionId: collection.id,
          name: "Dark",
        });
      }
    };

    updateModes("Theme");

    function createOrUpdateVariables(
      lightVariables,
      darkVariables,
      collectionName
    ) {
      const collection = Object.values(
        existingCollections
      ).find(
        (col) => col.name === collectionName
      );
      if (!collection) {
        console.error(
          `Collection ${collectionName} not found`
        );
        return;
      }

      const lightMode =
        findModeByName(collection, "Light") ||
        collection.defaultModeId;
      const darkMode = findModeByName(
        collection,
        "Dark"
      );

      lightVariables.forEach((lightVariable) => {
        const prefixedName = `${brand}/${lightVariable.name}`;
        const darkVariable = darkVariables.find(
          (v) => v.name === lightVariable.name
        );

        const existingVariable =
          findVariableByName(
            prefixedName,
            collectionName
          );

        if (existingVariable) {
          newData.variables.push({
            action: "UPDATE",
            id: existingVariable.id,
            name: prefixedName,
            variableCollectionId:
              existingVariable.variableCollectionId,
            resolvedType: "COLOR",
            description: `light: ${lightVariable.description}, dark: ${darkVariable?.description}`,
            scopes: [],
          });

          newData.variableModeValues.push({
            action: "UPDATE",
            variableId: existingVariable.id,
            modeId: lightMode.modeId || lightMode,
            value: lightVariable.value,
          });

          if (darkVariable) {
            newData.variableModeValues.push({
              action: "UPDATE",
              variableId: existingVariable.id,
              modeId: darkMode?.modeId,
              value: darkVariable.value,
            });
          }
        } else {
          const tempId = generateUniqueTempId(
            lightVariable.name,
            collectionName
          );

          newData.variables.push({
            action: "CREATE",
            id: tempId,
            name: prefixedName,
            variableCollectionId: collection.id,
            resolvedType: "COLOR",
          });

          newData.variableModeValues.push({
            action: "CREATE",
            variableId: tempId,
            modeId: lightMode.modeId || lightMode,
            value: lightVariable.value,
          });

          if (darkVariable) {
            newData.variableModeValues.push({
              action: "CREATE",
              variableId: tempId,
              modeId: darkMode?.modeId || "Dark",
              value: darkVariable.value,
            });
          }
        }
      });
    }

    createOrUpdateVariables(
      jsonData[brand].light,
      jsonData[brand].dark,
      "Theme"
    );

    const updateResponse = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables`,
      {
        method: "POST",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      }
    );

    if (!updateResponse.ok) {
      const errorText =
        await updateResponse.text();
      throw new Error(
        `Error updating variables and modes: ${updateResponse.statusText}. Response: ${errorText}`
      );
    }

    return newData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateSkinColorVariables(
  brands,
  FILE_KEY
) {
  try {
    // Step 1: Fetch existing data from "Theme" and "Skin" collections
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
    const themeCollections =
      figmaData.meta.variableCollections;

    // Step 2: Find the "Theme" and "Skin" collections
    const themeCollection = Object.values(
      themeCollections
    ).find((col) => col.name === "Theme");
    const skinCollection = Object.values(
      themeCollections
    ).find((col) => col.name === "Skin");

    if (!themeCollection || !skinCollection) {
      throw new Error(
        "Theme or Skin collection not found"
      );
    }

    // Step 3: Filter theme variables to only include those from the "Theme" collection
    const themeVariables =
      figmaData.meta.variables || {};
    const existingThemeVariables = Object.values(
      themeVariables
    ).filter(
      (variable) =>
        variable.variableCollectionId ===
        themeCollection.id
    );

    const existingSkinVariables = Object.values(
      themeVariables
    ).filter(
      (variable) =>
        variable.variableCollectionId ===
        skinCollection.id
    );

    // Step 4: Prepare new variables data for the Skin collection
    const newData = {
      variables: [],
      variableModeValues: [],
      variableModes: [],
    };

    // Step 5: Create or update modes based on the brands

    /////////////////////////////

    const firstBrand = brands[0];
    const formattedFirstBrand =
      formatBrandName(firstBrand);

    const defaultMode =
      skinCollection.modes?.find(
        (mode) =>
          mode.name === "Mode 1" ||
          mode.name === firstBrand ||
          mode.name === formattedFirstBrand
      );

    if (defaultMode) {
      if (
        defaultMode.name === firstBrand ||
        defaultMode.name === "Mode 1"
      ) {
        newData.variableModes.push({
          action: "UPDATE",
          id: defaultMode.modeId,
          name: formattedFirstBrand,
          variableCollectionId: skinCollection.id,
        });
      }
    } else {
      newData.variableModes.push({
        action: "CREATE",
        name: formattedFirstBrand,
        id: generateTempModeId(
          "Skin",
          formattedFirstBrand
        ),
        variableCollectionId: skinCollection.id,
      });
    }

    brands.slice(1).forEach((brand) => {
      const formattedBrand =
        formatBrandName(brand);

      const existingMode =
        skinCollection.modes.find(
          (mode) =>
            mode.name === brand ||
            mode.name === formattedBrand
        );

      if (existingMode) {
        if (existingMode.name === brand) {
          newData.variableModes.push({
            action: "UPDATE",
            id: existingMode.modeId,
            name: formattedBrand,
            variableCollectionId:
              skinCollection.id,
          });
        }
      } else {
        newData.variableModes.push({
          action: "CREATE",
          name: formattedBrand,
          id: generateTempModeId(
            "Skin",
            formattedBrand
          ),
          variableCollectionId: skinCollection.id,
        });
      }
    });

    /////////////////////////////

    // Step 6: Create a map for color variables from Theme
    const variableToBrandMap = new Map();

    existingThemeVariables.forEach((variable) => {
      if (variable.resolvedType === "COLOR") {
        const variableName = variable.name
          .split("/")
          .pop();
        if (
          !variableToBrandMap.has(variableName)
        ) {
          variableToBrandMap.set(
            variableName,
            {}
          );
        }
        const brand = variable.name.split("/")[0];
        variableToBrandMap.get(variableName)[
          brand
        ] = variable.id;
      }
    });

    // Step 7: Create or update only color variables in the Skin collection using the helper function
    for (let [
      variableName,
      brandMap,
    ] of variableToBrandMap) {
      const variable = {
        name: variableName,
        resolvedType: "COLOR",
        scopes: ["ALL_SCOPES"],
        targetCollectionName: "Skin",
      };

      // Use the extracted helper function to create or update the variable
      const variableData =
        await updateOrCreateVariable({
          variable,
          targetCollectionName:
            variable.targetCollectionName,
          existingVariables:
            existingSkinVariables,
          existingCollections: themeCollections,
        });

      newData.variables.push(variableData);

      // Step 8: Update mode values with the correct aliases for each brand
      for (const brand of brands) {
        const formattedBrand =
          formatBrandName(brand);

        // Call the helper function to create or update variable mode values
        const variableModeValuesData =
          await updateOrCreateVariableModeValues({
            variable: {
              name: variableName, // Assuming variableName is defined earlier
              hasAlias: true,
              value: brandMap[brand], // Alias to the Theme variable ID for the brand
            },

            targetModeName:
              brand === brands[0]
                ? defaultMode.name
                : formattedBrand,
            targetCollectionName: "Skin", // Assuming the collection name is 'Skin'
            existingCollections: themeCollections, // Pass the fetched collections
            existingVariables:
              existingSkinVariables, // Pass the existing variables in the Skin collection
          });

        if (variableModeValuesData) {
          newData.variableModeValues.push(
            variableModeValuesData
          );
        }
      }
    }

    // Step 9: Send the data to update the Skin collection (POST)
    const updateResponse = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables`,
      {
        method: "POST",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      }
    );

    if (!updateResponse.ok) {
      const errorText =
        await updateResponse.text();
      throw new Error(
        `Error updating Skin collection: ${updateResponse.statusText}. Response: ${errorText}`
      );
    }

    return newData; // Returning newData for debugging
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateSkinOtherVariables(
  jsonData,
  brands,
  FILE_KEY
) {
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
    variables: [],
    variableModeValues: [],
  };

  const fontFamilies = {
    movistar: "On Air",
    "vivo-new": "Vivo type",
    "o2-new": "On Air",
    telefonica: "Telefonica Sans",
    blau: "SF Pro Text",
    tu: "Telefonica Sans",
  };

  const iconSets = {
    movistar: "Default",
    "vivo-new": "Vivo",
    "o2-new": "O2",
    telefonica: "Default",
    blau: "Blau",
    tu: "Default",
  };

  // Loop through each brand to process its specific tokens
  for (const brand of brands) {
    const variableGroups = [
      {
        variables: jsonData[brand]?.radius || [],
        collectionName: "Skin",
        resolvedType: "FLOAT",
        variableScopes: ["CORNER_RADIUS"],
        hasAlias: false,
      },
      {
        variables:
          jsonData[brand]?.fontWeight || [],
        collectionName: "Skin",
        resolvedType: "STRING",
        variableScopes: ["FONT_WEIGHT"],
        hasAlias: false,
      },
      {
        variables:
          jsonData[brand]?.fontSize || [],
        collectionName: "Skin",
        resolvedType: "FLOAT",
        variableScopes: ["FONT_SIZE"],
        hasAlias: false,
      },
      {
        variables:
          jsonData[brand]?.lineHeight || [],
        collectionName: "Skin",
        resolvedType: "FLOAT",
        variableScopes: ["LINE_HEIGHT"],
        hasAlias: false,
      },
      {
        variables: [
          {
            name: "fontFamily/fontFamily",
            value: fontFamilies[brand],
          },
        ],
        collectionName: "Skin",
        resolvedType: "STRING",
        variableScopes: ["FONT_FAMILY"],
        hasAlias: false,
      },
      {
        variables: [
          {
            name: "icons/Icon Set",
            value: iconSets[brand],
          },
        ],
        collectionName: "Skin",
        resolvedType: "STRING",
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
        const variableUpdateResult =
          await updateOrCreateVariable({
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
          variableUpdateResult
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
            targetModeName:
              formatBrandName(brand),
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
  }

  // Make the POST request to update the variables and mode values in the Skin collection
  const updateResponse = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/variables`,
    {
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    }
  );

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(
      `Error updating Skin collection: ${updateResponse.statusText}. Response: ${errorText}`
    );
  }

  return newData;
}

async function postCollections(brand, FILE_KEY) {
  const collectionNames = ["Skin", "Theme"];

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
      `Error creating collections for brand ${brand}:`,
      error
    );
  }
}

async function processBrand(brand, FILE_KEY) {
  await postCollections(brand, FILE_KEY);
  await updateTheme(jsonData, brand, FILE_KEY);
}

async function processAllBrands(brands) {
  for (const brand of brands) {
    await processBrand(brand, MIDDLEWARE_TOKEN);
  }
}

async function main() {
  await processAllBrands(brands);
  await updateSkinColorVariables(
    brands,
    MIDDLEWARE_TOKEN
  );
  await updateSkinOtherVariables(
    jsonData,
    brands,
    MIDDLEWARE_TOKEN
  );
}

// Execute the main function to ensure proper sequence
main().catch((error) => {
  console.error(
    "Error in main execution:",
    error
  );
});
