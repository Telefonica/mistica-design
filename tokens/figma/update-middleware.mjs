import fetch from "node-fetch";

import {
  updateCollections,
  updateOrCreateModes,
  updateOrCreateVariables,
  updateOrCreateVariableModeValues,
  hasDefaultMode,
  generateTempModeId,
  VARIABLE_TYPES,
  COLLECTION_NAMES,
  MODE_NAMES,
} from "./utils.mjs";

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
  FILE_KEY,
  FIGMA_TOKEN
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

    const modes = [
      MODE_NAMES.LIGHT,
      MODE_NAMES.DARK,
    ];

    // Create or update modes for the collection

    const defaultMode = modes[0];

    const defaultModeResult =
      await updateOrCreateModes({
        mode: { name: defaultMode },
        isDefault: true,
        targetCollectionName:
          COLLECTION_NAMES.COLOR_SCHEME,
        existingCollections: existingCollections,
      });

    newData.variableModes.push(defaultModeResult);

    modes.slice(1).forEach(async (mode) => {
      const modeResult =
        await updateOrCreateModes({
          mode: { name: mode },
          isDefault: false,
          targetCollectionName:
            COLLECTION_NAMES.COLOR_SCHEME,
          existingCollections:
            existingCollections,
        });

      newData.variableModes.push(modeResult);
    });

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
            mode.name === MODE_NAMES.DEFAULT
        );

        // Prepare the variable data
        const variableData =
          await updateOrCreateVariables({
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
              ? MODE_NAMES.DEFAULT
              : MODE_NAMES.LIGHT,
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
                targetModeName: MODE_NAMES.DARK,
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
  FILE_KEY,
  FIGMA_TOKEN
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
    const brandCollection = Object.values(
      themeCollections
    ).find(
      (col) => col.name === COLLECTION_NAMES.BRAND
    );

    if (!themeCollection || !brandCollection) {
      throw new Error(
        "Mode or Brand collection not found"
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

    const existingBrandVariables = Object.values(
      themeVariables
    ).filter(
      (variable) =>
        variable.variableCollectionId ===
        brandCollection.id
    );

    // Step 4: Prepare new variables data for the Brand collection
    const newData = {
      variables: [],
      variableModeValues: [],
      variableModes: [],
    };

    // Step 5: Create or update modes based on the brands

    const firstBrand = brands[0];

    const firstModeResult =
      await updateOrCreateModes({
        mode: {
          name: formatBrandName(firstBrand),
        },
        isDefault: true,
        targetCollectionName:
          COLLECTION_NAMES.BRAND,
        existingCollections: themeCollections,
      });

    newData.variableModes.push(firstModeResult);

    brands.slice(1).forEach(async (brand) => {
      const formattedBrand =
        formatBrandName(brand);

      const modeResult =
        await updateOrCreateModes({
          mode: { name: formattedBrand },
          isDefault: false,
          targetCollectionName:
            COLLECTION_NAMES.BRAND,
          existingCollections: themeCollections,
        });

      newData.variableModes.push(modeResult);
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
        await updateOrCreateVariables({
          variable,
          targetCollectionName:
            variable.targetCollectionName,
          existingVariables:
            existingBrandVariables,
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
              hasDefaultMode(
                COLLECTION_NAMES.BRAND,
                themeCollections
              ) && brand === brands[0]
                ? MODE_NAMES.DEFAULT
                : formattedBrand,
            targetCollectionName:
              COLLECTION_NAMES.BRAND, // Assuming the collection name is 'Brand'
            existingCollections: themeCollections, // Pass the fetched collections
            existingVariables:
              existingBrandVariables, // Pass the existing variables in the Brand collection
          });

        if (variableModeValuesData) {
          newData.variableModeValues.push(
            variableModeValuesData
          );
        }
      }
    }

    // Step 9: Send the data to update the Brand collection (POST)
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
        `Error updating Brand collection: ${updateResponse.statusText}. Response: ${errorText}`
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
  FILE_KEY,
  FIGMA_TOKEN
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
    "vivo-new": "Vivo Type",
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
        variables:
          jsonData[brand]?.themeVariant || [],
        collectionName: COLLECTION_NAMES.BRAND,
        resolvedType: VARIABLE_TYPES.STRING,
        variableScopes: ["ALL_SCOPES"],
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
            name: "icons/iconSet",
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
              hasDefaultMode(
                collectionName,
                existingCollections
              ) && brand === brands[0]
                ? MODE_NAMES.DEFAULT
                : formatBrandName(brand),
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

  // Make the POST request to update the variables and mode values in the Brand collection
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
      `Error updating Brand collection: ${updateResponse.statusText}. Response: ${errorText}`
    );
  }

  return newData;
}

async function postCollections(
  brand,
  FILE_KEY,
  FIGMA_TOKEN
) {
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
  await updateTheme(
    jsonData,
    brand,
    FILE_KEY,
    FIGMA_TOKEN
  );
}

async function processAllBrands(
  jsonData,
  brands,
  FILE_KEY,
  FIGMA_TOKEN
) {
  for (const brand of brands) {
    await processBrand(
      jsonData,
      brand,
      FILE_KEY,
      FIGMA_TOKEN
    );
  }
}

export async function updateMiddleware(
  jsonData,
  brands,
  FILE_KEY,
  FIGMA_TOKEN
) {
  await processAllBrands(
    jsonData,
    brands,
    FILE_KEY,
    FIGMA_TOKEN
  );
  await updateSkinColorVariables(
    brands,
    FILE_KEY,
    FIGMA_TOKEN
  );
  await updateSkinOtherVariables(
    jsonData,
    brands,
    FILE_KEY,
    FIGMA_TOKEN
  );
}
