import {
  updateCollections,
  updateOrCreateModes,
  updateOrCreateVariables,
  updateOrCreateVariableModeValues,
  hasDefaultMode,
} from "./utils/figma-utils.mjs";

import {
  VARIABLE_TYPES,
  COLLECTION_NAMES,
  MODE_NAMES,
  VARIABLE_SCOPES,
} from "./utils/constants.mjs";

import {
  getFigmaData,
  postFigmaVariables,
} from "./utils/api-request.mjs";

import {
  getConstantVariables,
  getNonColorVariables,
} from "./variables.mjs";

import formatBrandName from "./utils/format-brand-name.mjs";

import {
  BRAND_KEY,
  MIDDLEWARE_KEY,
} from "./config.mjs";

const brandNames = Object.keys(BRAND_KEY);
const DEPRECATED_PREFIX = "DEPRECATED_";

function stripDeprecatedPrefix(name = "") {
  return name.startsWith(DEPRECATED_PREFIX)
    ? name.slice(DEPRECATED_PREFIX.length)
    : name;
}

function normalizeTokenDescriptor(variable) {
  const canonicalName = stripDeprecatedPrefix(
    variable.name,
  );
  const isDeprecated =
    variable.deprecated === true;
  const name = isDeprecated
    ? `${DEPRECATED_PREFIX}${canonicalName}`
    : canonicalName;

  const deprecatedMessage = isDeprecated
    ? variable.deprecatedBy
      ? `Deprecated. Use ${variable.deprecatedBy}`
      : "Deprecated."
    : "";

  const descriptionParts = [
    variable.description,
    deprecatedMessage,
  ].filter(Boolean);

  const legacyNames = [
    isDeprecated
      ? canonicalName
      : `${DEPRECATED_PREFIX}${canonicalName}`,
  ];

  return {
    canonicalName,
    name,
    legacyNames,
    description:
      descriptionParts.length > 0
        ? descriptionParts.join(" — ")
        : undefined,
  };
}

function toScopedDescriptor(
  variable,
  scopePrefix,
) {
  const descriptor =
    normalizeTokenDescriptor(variable);

  return {
    ...descriptor,
    name: `${scopePrefix}/${descriptor.name}`,
    legacyNames: descriptor.legacyNames.map(
      (legacyName) =>
        `${scopePrefix}/${legacyName}`,
    ),
  };
}

function getTokenByCanonicalName(
  tokens,
  canonicalName,
) {
  return tokens.find(
    (token) =>
      stripDeprecatedPrefix(token.name) ===
      canonicalName,
  );
}

async function updateModeCollection(
  jsonData,
  brand,
) {
  try {
    const figmaData = await getFigmaData(
      MIDDLEWARE_KEY,
    );
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

    const modeResults = await Promise.all(
      modes.slice(1).map(async (mode) => {
        return await updateOrCreateModes({
          mode: { name: mode },
          isDefault: false,
          targetCollectionName:
            COLLECTION_NAMES.COLOR_SCHEME,
          existingCollections:
            existingCollections,
        });
      }),
    );
    newData.variableModes.push(...modeResults);

    // Get color variables using the imported function
    const colorVariables = getConstantVariables(
      jsonData,
      brand,
    );

    const processedVariables = new Map();

    for (const variableGroup of colorVariables) {
      for (const variable of variableGroup.variables) {
        const scopedVariable = toScopedDescriptor(
          variable,
          brand,
        );
        const prefixedName = scopedVariable.name;

        // Only process if the variable hasn't been created yet
        if (
          !processedVariables.has(prefixedName)
        ) {
          // Create or update the variable
          const variableData =
            await updateOrCreateVariables({
              variable: {
                name: prefixedName,
                legacyNames:
                  scopedVariable.legacyNames,
                description:
                  scopedVariable.description,
                resolvedType:
                  VARIABLE_TYPES.COLOR,
                scopes: [],
              },
              targetCollectionName:
                COLLECTION_NAMES.COLOR_SCHEME,
              existingVariables:
                existingVariables,
              existingCollections:
                existingCollections,
            });

          newData.variables.push(variableData);
          processedVariables.set(
            prefixedName,
            variableData,
          );

          // Find values for light and dark modes
          const lightToken =
            getTokenByCanonicalName(
              jsonData[brand]?.light || [],
              scopedVariable.canonicalName,
            );
          const darkToken =
            getTokenByCanonicalName(
              jsonData[brand]?.dark || [],
              scopedVariable.canonicalName,
            );
          const lightValue = lightToken?.value;
          const darkValue = darkToken?.value;

          // Handle light mode value
          if (lightValue) {
            const lightModeValueData =
              await updateOrCreateVariableModeValues(
                {
                  variable: {
                    name: prefixedName,
                    legacyNames:
                      scopedVariable.legacyNames,
                    value: lightValue,
                    hasAlias: false,
                  },
                  targetModeName: hasDefaultMode(
                    COLLECTION_NAMES.COLOR_SCHEME,
                    existingCollections,
                  )
                    ? MODE_NAMES.DEFAULT
                    : MODE_NAMES.LIGHT,
                  targetCollectionName:
                    COLLECTION_NAMES.COLOR_SCHEME,
                  existingCollections:
                    existingCollections,
                  existingVariables:
                    existingVariables,
                },
              );

            if (lightModeValueData) {
              newData.variableModeValues.push(
                lightModeValueData,
              );
            }
          }

          // Handle dark mode value
          if (darkValue) {
            const darkModeValueData =
              await updateOrCreateVariableModeValues(
                {
                  variable: {
                    name: prefixedName,
                    legacyNames:
                      scopedVariable.legacyNames,
                    value: darkValue,
                    hasAlias: false,
                  },
                  targetModeName: MODE_NAMES.DARK,
                  targetCollectionName:
                    COLLECTION_NAMES.COLOR_SCHEME,
                  existingCollections:
                    existingCollections,
                  existingVariables:
                    existingVariables,
                },
              );

            if (darkModeValueData) {
              newData.variableModeValues.push(
                darkModeValueData,
              );
            }
          }
        }
      }
    }

    // Update the variables and modes in Figma
    await postFigmaVariables(
      MIDDLEWARE_KEY,
      newData,
    );

    return newData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateBrandCollection(jsonData) {
  try {
    // Step 1: Fetch the existing data from Figma

    const figmaData = await getFigmaData(
      MIDDLEWARE_KEY,
    );
    const existingCollections =
      figmaData.meta.variableCollections;

    const existingVariables =
      figmaData.meta.variables || {};

    // Step 2: Find the Theme and Brand collections

    const themeCollection = Object.values(
      existingCollections,
    ).find(
      (collection) =>
        collection.name ===
        COLLECTION_NAMES.COLOR_SCHEME,
    );

    const brandCollection = Object.values(
      existingCollections,
    ).find(
      (collection) =>
        collection.name === COLLECTION_NAMES.SKIN,
    );

    // Step 3: Filter variables to only include those from the "Mode" collection

    const existingModeVariables = Object.values(
      existingVariables,
    ).filter(
      (variable) =>
        variable.variableCollectionId ===
        themeCollection.id,
    );

    const existingBrandVariables = Object.values(
      existingVariables,
    ).filter(
      (variable) =>
        variable.variableCollectionId ===
        brandCollection.id,
    );

    // Step 4: Prepare new variables data for the Brand collection
    const newData = {
      variables: [],
      variableModeValues: [],
      variableModes: [],
    };

    // Step 5: Create or update modes based on the brands

    const firstBrand = brandNames[0];

    const firstModeResult =
      await updateOrCreateModes({
        mode: {
          name: formatBrandName(firstBrand),
        },
        isDefault: true,
        targetCollectionName:
          COLLECTION_NAMES.SKIN,
        existingCollections: existingCollections,
      });

    newData.variableModes.push(firstModeResult);

    brandNames.slice(1).forEach(async (brand) => {
      const formattedBrand =
        formatBrandName(brand);

      const modeResult =
        await updateOrCreateModes({
          mode: { name: formattedBrand },
          isDefault: false,
          targetCollectionName:
            COLLECTION_NAMES.SKIN,
          existingCollections:
            existingCollections,
        });

      newData.variableModes.push(modeResult);
    });

    // Step 6: Create a map for color variables from Mode collection

    const variableToBrandMap = new Map();

    const colorMetadataByCanonicalName =
      new Map();

    for (const brand of brandNames) {
      const brandTokens = [
        ...(jsonData[brand]?.light || []),
        ...(jsonData[brand]?.dark || []),
      ];

      for (const token of brandTokens) {
        const descriptor =
          normalizeTokenDescriptor(token);
        const existingMetadata =
          colorMetadataByCanonicalName.get(
            descriptor.canonicalName,
          ) || {
            deprecated: false,
          };

        colorMetadataByCanonicalName.set(
          descriptor.canonicalName,
          {
            deprecated:
              existingMetadata.deprecated ||
              token.deprecated === true,
            description:
              existingMetadata.description ||
              token.description,
            deprecatedBy:
              existingMetadata.deprecatedBy ||
              token.deprecatedBy,
          },
        );
      }
    }

    existingModeVariables.forEach((variable) => {
      if (
        variable.resolvedType ===
        VARIABLE_TYPES.COLOR
      ) {
        const variableName = variable.name
          .split("/")
          .pop();
        const canonicalName =
          stripDeprecatedPrefix(variableName);
        if (
          !variableToBrandMap.has(canonicalName)
        ) {
          variableToBrandMap.set(canonicalName, {
            brandMap: {},
            deprecated: false,
          });
        }
        const brand = variable.name.split("/")[0];
        const modeVariableData =
          variableToBrandMap.get(canonicalName);
        modeVariableData.brandMap[brand] =
          variable.id;
        modeVariableData.deprecated =
          modeVariableData.deprecated ||
          variableName.startsWith(
            DEPRECATED_PREFIX,
          );
      }
    });

    for (let [
      canonicalName,
      modeVariableData,
    ] of variableToBrandMap) {
      const colorMetadata =
        colorMetadataByCanonicalName.get(
          canonicalName,
        ) || {};

      const descriptor = normalizeTokenDescriptor(
        {
          name: canonicalName,
          deprecated:
            modeVariableData.deprecated ||
            colorMetadata.deprecated,
          deprecatedBy:
            colorMetadata.deprecatedBy,
          description: colorMetadata.description,
        },
      );

      const variableName = descriptor.name;
      const brandMap = modeVariableData.brandMap;

      // Return empty scopes in gradient variables, since they already have a style
      let scopes = [VARIABLE_SCOPES.ALL_SCOPES];

      const stopRegex = /-stop-\d+$/;

      if (stopRegex.test(variableName)) {
        scopes = [];
      }

      const variable = {
        name: variableName,
        legacyNames: descriptor.legacyNames,
        description: descriptor.description,
        resolvedType: VARIABLE_TYPES.COLOR,
        scopes: scopes,
        targetCollectionName:
          COLLECTION_NAMES.SKIN,
      };

      const variableData =
        await updateOrCreateVariables({
          variable,
          targetCollectionName:
            variable.targetCollectionName,
          existingVariables:
            existingBrandVariables,
          existingCollections:
            existingCollections,
        });

      newData.variables.push(variableData);

      // Step 8: Update mode values with the correct aliases for each brand
      for (const brand of brandNames) {
        const formattedBrand =
          formatBrandName(brand);

        // Call the helper function to create or update variable mode values
        const variableModeValuesData =
          await updateOrCreateVariableModeValues({
            variable: {
              name: variableName,
              legacyNames: descriptor.legacyNames,
              hasAlias: true,
              value: brandMap[brand], // Alias to the Theme variable ID for the brand
            },

            targetModeName:
              hasDefaultMode(
                COLLECTION_NAMES.SKIN,
                existingCollections,
              ) && brand === brandNames[0]
                ? MODE_NAMES.DEFAULT
                : formattedBrand,
            targetCollectionName:
              COLLECTION_NAMES.SKIN,
            existingCollections:
              existingCollections,
            existingVariables:
              existingBrandVariables,
          });

        if (variableModeValuesData) {
          newData.variableModeValues.push(
            variableModeValuesData,
          );
        }
      }
    }

    // Loop through each brand to process its specific tokens
    for (const brand of brandNames) {
      const nonColorVariables =
        getNonColorVariables(jsonData, brand);

      for (const group of nonColorVariables) {
        const {
          variables,
          collectionName,
          resolvedType,
          variableScopes,
          hasAlias,
        } = group;

        for (const variable of variables) {
          const descriptor =
            normalizeTokenDescriptor(variable);

          // Update or create the variable in the collection
          const variableUpdateResult =
            await updateOrCreateVariables({
              variable: {
                ...variable,
                name: descriptor.name,
                legacyNames:
                  descriptor.legacyNames,
                description:
                  descriptor.description,
                resolvedType: resolvedType,
                scopes: variableScopes,
                hasAlias: hasAlias,
              },
              targetCollectionName:
                collectionName,
              existingVariables:
                existingVariables,
              existingCollections:
                existingCollections,
            });

          if (!newData.variables) {
            newData.variables = [];
          }
          newData.variables.push(
            variableUpdateResult,
          );

          // Find the mode for the current brand and set the mode values correctly
          const variableModeValuesUpdatedResult =
            await updateOrCreateVariableModeValues(
              {
                variable: {
                  ...variable,
                  name: descriptor.name,
                  legacyNames:
                    descriptor.legacyNames,
                  resolvedType: resolvedType,
                  scopes: variableScopes,
                  hasAlias: hasAlias,
                },
                targetModeName:
                  hasDefaultMode(
                    collectionName,
                    existingCollections,
                  ) && brand === brandNames[0]
                    ? MODE_NAMES.DEFAULT
                    : formatBrandName(brand),
                targetCollectionName:
                  collectionName,
                existingCollections:
                  existingCollections,
                existingVariables:
                  existingVariables,
              },
            );

          newData.variableModeValues.push(
            variableModeValuesUpdatedResult,
          );
        }
      }
    }

    // Step 9: Send the data to update the Brand collection (POST)

    await postFigmaVariables(
      MIDDLEWARE_KEY,
      newData,
    );

    return newData; // Returning newData for debugging
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function postCollections(brand) {
  const collectionNames = [
    COLLECTION_NAMES.SKIN,
    COLLECTION_NAMES.COLOR_SCHEME,
  ];

  try {
    const newData = await updateCollections(
      collectionNames,
      MIDDLEWARE_KEY,
    );

    await postFigmaVariables(
      MIDDLEWARE_KEY,
      newData,
    );
  } catch (error) {
    console.error(
      `Error creating collections for brand ${brand}:`,
      error,
    );
  }
}

async function processBrand(jsonData, brand) {
  await postCollections(brand);
  await updateModeCollection(jsonData, brand);
}

async function processAllBrands(jsonData) {
  for (const brand of brandNames) {
    await processBrand(jsonData, brand);
  }
}

export async function updateMiddleware(jsonData) {
  await processAllBrands(jsonData);
  await updateBrandCollection(jsonData);
}
