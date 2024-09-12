import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractJsonData from "./extract-json-data-middleware.mjs";
import {
  updateCollections,
  updateOrCreateMode,
  updateOrCreateVariable,
  updateOrCreateVariableModeValues,
  generateTempModeId,
  VARIABLE_TYPES,
  DEFAULT_FIGMA_MODENAME,
  COLLECTION_NAMES,
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

export async function updateTheme(
  jsonData,
  brand,
  FILE_KEY
) {
  try {
    // Fetch existing variables and collections from Figma
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

    function findModeByName(
      collection,
      modeName
    ) {
      return collection.modes.find(
        (mode) => mode.name === modeName
      );
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
        defaultMode.name !== "True"
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
          id: generateTempModeId(
            "Dark",
            COLLECTION_NAMES.COLOR_SCHEME
          ),
          variableCollectionId: collection.id,
          name: "Dark",
        });
      }
    };

    updateModes(COLLECTION_NAMES.COLOR_SCHEME);

    async function processVariables(
      lightVariables,
      darkVariables,
      collectionName,
      brand,
      existingVariables,
      existingCollections,
      newData
    ) {
      for (const lightVariable of lightVariables) {
        const prefixedName = `${brand}/${lightVariable.name}`;
        const darkVariable = darkVariables.find(
          (v) => v.name === lightVariable.name
        );

        // Get the collection ID
        const collectionId = Object.values(
          existingCollections
        ).find(
          (collection) =>
            collection.name === collectionName
        )?.id;

        if (!collectionId) {
          console.warn(
            `Collection ${collectionName} not found.`
          );
          continue;
        }

        // Get default mode for this collection
        const defaultMode = existingCollections[
          collectionId
        ]?.modes.find(
          (mode) =>
            mode.name === DEFAULT_FIGMA_MODENAME
        );

        // Prepare the variable data
        const variableData =
          await updateOrCreateVariable({
            variable: {
              name: prefixedName,
              resolvedType: VARIABLE_TYPES.COLOR,
              scopes: [],
            },
            targetCollectionName: collectionName,
            existingVariables,
            existingCollections,
          });

        // Prepare the mode values
        const modeValueData =
          await updateOrCreateVariableModeValues({
            variable: {
              name: prefixedName,
              value: lightVariable.value,
              hasAlias: false,
            },
            targetModeName: defaultMode
              ? DEFAULT_FIGMA_MODENAME
              : "Light",
            targetCollectionName: collectionName,
            existingCollections,
            existingVariables,
          });

        if (modeValueData) {
          newData.variableModeValues.push(
            modeValueData
          );
        }

        if (darkVariable) {
          const darkModeValueData =
            await updateOrCreateVariableModeValues(
              {
                variable: {
                  name: prefixedName,
                  value: darkVariable.value,
                  hasAlias: false,
                },
                targetModeName: "Dark",
                targetCollectionName:
                  collectionName,
                existingCollections,
                existingVariables,
              }
            );

          if (darkModeValueData) {
            newData.variableModeValues.push(
              darkModeValueData
            );
          }
        }

        // Update the variable list
        newData.variables.push(variableData);
      }

      return newData;
    }

    // Process variables for light and dark themes
    await processVariables(
      jsonData[brand]?.light || [],
      jsonData[brand]?.dark || [],
      COLLECTION_NAMES.COLOR_SCHEME,
      brand,
      existingVariables,
      existingCollections,
      newData
    );

    // Update the variables and modes in Figma
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
    // Step 1: Fetch existing data from "Mode" and "Brand" collections
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

    // Step 2: Find the "Mode" and "Brand" collections
    const themeCollection = Object.values(
      themeCollections
    ).find(
      (col) =>
        col.name === COLLECTION_NAMES.COLOR_SCHEME
    );
    const skinCollection = Object.values(
      themeCollections
    ).find(
      (col) => col.name === COLLECTION_NAMES.BRAND
    );

    if (!themeCollection || !skinCollection) {
      throw new Error(
        "Theme or Skin collection not found"
      );
    }

    // Step 3: Filter theme variables to only include those from the "Mode" collection
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

    const firstBrand = brands[0];
    const formattedFirstBrand =
      formatBrandName(firstBrand);

    const defaultMode =
      skinCollection.modes?.find(
        (mode) =>
          mode.name === DEFAULT_FIGMA_MODENAME ||
          mode.name === firstBrand ||
          mode.name === formattedFirstBrand
      );

    if (defaultMode) {
      if (
        defaultMode.name === firstBrand ||
        defaultMode.name ===
          DEFAULT_FIGMA_MODENAME
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
          formattedFirstBrand,
          COLLECTION_NAMES.BRAND
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
            formattedBrand,
            COLLECTION_NAMES.BRAND
          ),
          variableCollectionId: skinCollection.id,
        });
      }
    });

    // Step 6: Create a map for color variables from Theme
    const variableToBrandMap = new Map();

    existingThemeVariables.forEach((variable) => {
      if (
        variable.resolvedType ===
        VARIABLE_TYPES.COLOR
      ) {
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

    for (let [
      variableName,
      brandMap,
    ] of variableToBrandMap) {
      const variable = {
        name: variableName,
        resolvedType: VARIABLE_TYPES.COLOR,
        scopes: ["ALL_SCOPES"],
        targetCollectionName:
          COLLECTION_NAMES.BRAND,
      };

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
            targetCollectionName:
              COLLECTION_NAMES.BRAND, // Assuming the collection name is 'Skin'
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
        collectionName: COLLECTION_NAMES.BRAND,
        resolvedType: VARIABLE_TYPES.FLOAT,
        variableScopes: ["CORNER_RADIUS"],
        hasAlias: false,
      },
      {
        variables:
          jsonData[brand]?.fontWeight || [],
        collectionName: COLLECTION_NAMES.BRAND,
        resolvedType: VARIABLE_TYPES.STRING,
        variableScopes: ["FONT_WEIGHT"],
        hasAlias: false,
      },
      {
        variables:
          jsonData[brand]?.fontSize || [],
        collectionName: COLLECTION_NAMES.BRAND,
        resolvedType: VARIABLE_TYPES.FLOAT,
        variableScopes: ["FONT_SIZE"],
        hasAlias: false,
      },
      {
        variables:
          jsonData[brand]?.lineHeight || [],
        collectionName: COLLECTION_NAMES.BRAND,
        resolvedType: VARIABLE_TYPES.FLOAT,
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
        collectionName: COLLECTION_NAMES.BRAND,
        resolvedType: VARIABLE_TYPES.STRING,
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
        collectionName: COLLECTION_NAMES.BRAND,
        resolvedType: VARIABLE_TYPES.STRING,
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
  const collectionNames = [
    COLLECTION_NAMES.BRAND,
    COLLECTION_NAMES.COLOR_SCHEME,
  ];

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
