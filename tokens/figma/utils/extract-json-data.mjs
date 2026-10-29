import fs from "fs";
import path from "path";
import hexToRgba from "./hex-to-rgba.mjs";

// A token leaf is a scalar, a { density: { default, compact } } object, or a
// { mobile, desktop } pair whose entries are scalars or density objects. Normalise to per-breakpoint entries.
const toBreakpoints = (value) =>
  typeof value === "object" &&
  value !== null &&
  ("mobile" in value || "desktop" in value)
    ? value
    : { mobile: value, desktop: value };

// Fixed output order, so a skin that declares "desktop" before "mobile" still
// produces entries in the same order as every other skin.
const BREAKPOINTS = ["mobile", "desktop"];

const isDensity = (value) =>
  typeof value === "object" &&
  value !== null &&
  "density" in value;

const isBreakpoints = (value) =>
  typeof value === "object" &&
  value !== null &&
  ("mobile" in value || "desktop" in value);

// Radius values are strings in the skins: "circle" means fully rounded.
const parseRadius = (value) =>
  value === "circle" ? 999 : parseFloat(value);

// Splits a leaf into { value, compact? }. compact is only set for density objects,
// so the middleware can tell a density-aware token from an ordinary one.
const splitDensity = (value, parse) =>
  isDensity(value)
    ? {
        value: parse(value.density.default),
        compact:
          value.density.compact === undefined
            ? undefined
            : parse(value.density.compact),
      }
    : { value: parse(value) };

// Expands a scalar / density / breakpoint value into named entries.
// Names are breakpoint-qualified when the value declares breakpoints, or when
// alwaysBreakpoints is set — typography always needs mobile/desktop names, even
// for a scalar, because the Density collection is keyed on them.
const expandValue = (
  prefix,
  key,
  value,
  parse,
  alwaysBreakpoints = false,
) =>
  isBreakpoints(value) || alwaysBreakpoints
    ? BREAKPOINTS.map((breakpoint) => ({
        name: `${prefix}${breakpoint}/${key}`,
        ...splitDensity(
          toBreakpoints(value)[breakpoint],
          parse,
        ),
      }))
    : [
        {
          name: `${prefix}${key}`,
          ...splitDensity(value, parse),
        },
      ];

export const extractSkinJsonData = (
  jsonFiles,
  directoryPath,
) => {
  const allParsedContent = {}; // Initialize once to store all parsed content

  // First pass to gather allParsedContent
  jsonFiles.forEach((file) => {
    const filePath = path.resolve(
      directoryPath,
      file,
    );
    const fileContent = fs.readFileSync(
      filePath,
      "utf8",
    );
    const parsedContent = JSON.parse(fileContent);

    // Extract file name without extension to use as a key
    const fileName = path.basename(file, ".json");

    // Store the parsed content in the allParsedContent object
    allParsedContent[fileName] = parsedContent;
  });

  // Second pass to process each file
  return jsonFiles.reduce((accumulator, file) => {
    const filePath = path.resolve(
      directoryPath,
      file,
    );
    const fileContent = fs.readFileSync(
      filePath,
      "utf8",
    );
    const parsedContent = JSON.parse(fileContent);

    // Extract file name without extension
    const fileName = path.basename(file, ".json");

    function getTokenMeta(token = {}) {
      return {
        description: token.description,
        deprecated: token.deprecated === true,
        deprecatedBy: token.deprecatedBy,
      };
    }

    function attachTokenMeta(token, payload) {
      const meta = getTokenMeta(token);
      return {
        ...payload,
        ...(meta.description
          ? { description: meta.description }
          : {}),
        ...(meta.deprecated
          ? { deprecated: true }
          : {}),
        ...(meta.deprecatedBy
          ? { deprecatedBy: meta.deprecatedBy }
          : {}),
      };
    }

    function processColors(
      parsedContent,
      theme,
      allParsedContent,
    ) {
      if (!["light", "dark"].includes(theme)) {
        throw new Error(
          `Invalid theme: ${theme}. Expected 'light' or 'dark'.`,
        );
      }

      const themeColors = parsedContent[theme];

      function getPaletteName(value) {
        const regexMatch = value.match(
          /{palette\.(.*?)}/,
        );
        if (regexMatch) {
          return regexMatch[1];
        }
        const rgbaMatch = value.match(
          /rgba\(\{palette\.(.*?)\},\s*\d*\.?\d*\)/,
        );
        if (rgbaMatch) {
          return rgbaMatch[1];
        }
        throw new Error(
          `Unexpected color format: ${value}`,
        );
      }

      function getPaletteValue(colorName) {
        const paletteValue =
          parsedContent.global.palette[colorName]
            ?.value;
        if (!paletteValue) {
          throw new Error(
            `Color ${colorName} not found in palette`,
          );
        }
        return paletteValue;
      }

      function getMaxStopsAcrossBrands(
        allParsedContent,
        key,
        theme,
      ) {
        let maxStops = 0;
        let isGradientInAnyBrand = false;

        Object.values(allParsedContent).forEach(
          (content) => {
            const colors = content[theme][key];
            if (
              colors &&
              colors.type === "linear-gradient"
            ) {
              isGradientInAnyBrand = true;
              maxStops = Math.max(
                maxStops,
                colors.value.colors.length,
              );
            }
          },
        );

        return { maxStops, isGradientInAnyBrand };
      }

      return Object.keys(themeColors).flatMap(
        (key) => {
          const colorData = themeColors[key];
          const { value, type } = colorData;

          const {
            maxStops,
            isGradientInAnyBrand,
          } = getMaxStopsAcrossBrands(
            allParsedContent,
            key,
            theme,
          );

          // Handle gradients first
          if (
            type === "linear-gradient" &&
            typeof value === "object"
          ) {
            // Map colors in gradient
            return Array.from(
              { length: maxStops },
              (_, index) => {
                if (index < value.colors.length) {
                  // Use the actual gradient stop color
                  const color =
                    value.colors[index];
                  const alphaMatch =
                    color.value.match(
                      /rgba\([^)]+,\s*([^)]+)\)/,
                    );
                  const alpha = alphaMatch
                    ? alphaMatch[1]
                    : "1";
                  const baseColorName =
                    getPaletteName(color.value);

                  return alpha === "1"
                    ? {
                        name: `${theme}/${key}-stop-${
                          index + 1
                        }`,
                        value: baseColorName,
                        hasAlias: true,
                      }
                    : {
                        name: `${theme}/${key}-stop-${
                          index + 1
                        }`,
                        value: hexToRgba(
                          getPaletteValue(
                            baseColorName,
                          ),
                          parseFloat(alpha),
                        ),
                        hasAlias: false,
                      };
                } else if (isGradientInAnyBrand) {
                  // If this brand does not have a gradient, repeat the base color to match stops
                  const baseColorName =
                    getPaletteName(
                      value.colors[0].value,
                    );
                  return {
                    name: `${theme}/${key}-stop-${
                      index + 1
                    }`,
                    value: hexToRgba(
                      getPaletteValue(
                        baseColorName,
                      ),
                    ),
                    hasAlias: false,
                  };
                }
              },
            ).filter(Boolean);
          }

          // Handle solid colors or aliases when a gradient exists in other brands
          if (
            type !== "linear-gradient" &&
            isGradientInAnyBrand
          ) {
            const baseColorName =
              getPaletteName(value);
            // Repeat the solid color to match the gradient stops
            return Array.from(
              { length: maxStops },
              (_, index) => ({
                name: `${theme}/${key}-stop-${
                  index + 1
                }`,
                value: hexToRgba(
                  getPaletteValue(baseColorName),
                ),
                hasAlias: false,
              }),
            );
          }

          // Handle solid colors or aliases normally
          if (
            typeof value === "string" &&
            !value.startsWith("rgba")
          ) {
            const baseColorName =
              getPaletteName(value);

            return {
              name: `${theme}/${key}`,
              value: hexToRgba(
                getPaletteValue(baseColorName),
              ),

              hasAlias: true,
            };
          }

          // Handle rgba colors
          if (
            typeof value === "string" &&
            value.startsWith("rgba")
          ) {
            const alphaMatch = value.match(
              /rgba\([^)]+,\s*([^)]+)\)/,
            );
            const alpha = alphaMatch
              ? alphaMatch[1]
              : "1";
            const baseColorName =
              getPaletteName(value);

            return alpha === "1"
              ? {
                  name: `${theme}/${key}`,
                  value: baseColorName,
                  hasAlias: true,
                }
              : {
                  name: `${theme}/${key}`,
                  value: hexToRgba(
                    getPaletteValue(
                      baseColorName,
                    ),
                    parseFloat(alpha),
                  ),
                  hasAlias: false,
                };
          }

          throw new Error(
            `Unexpected color format for key: ${key}`,
          );
        },
      );
    }

    // Other token processing logic
    const paletteArray = Object.keys(
      parsedContent.global.palette,
    ).map((key) => ({
      name: key,
      value: hexToRgba(
        parsedContent.global.palette[key].value,
      ),
    }));

    const radiusArray = Object.keys(
      parsedContent.radius,
    ).flatMap((key) =>
      expandValue(
        "",
        key,
        parsedContent.radius[key].value,
        parseRadius,
      ),
    );

    const fontWeightArray = Object.keys(
      parsedContent.text.weight,
    ).map((key) => ({
      name: key,
      value: parsedContent.text.weight[key].value,
    }));

    const fontSizeArray = Object.keys(
      parsedContent.text.size,
    ).flatMap((key) =>
      expandValue(
        "",
        key,
        parsedContent.text.size[key].value,
        parseFloat,
        true,
      ),
    );

    const lineHeightArray = Object.keys(
      parsedContent.text.lineHeight,
    ).flatMap((key) =>
      expandValue(
        "",
        key,
        parsedContent.text.lineHeight[key].value,
        parseFloat,
        true,
      ),
    );

    const spacingArray = Object.keys(
      parsedContent.spacing,
    ).flatMap((key) => {
      const value =
        parsedContent.spacing[key].value;
      const result = [];

      // Helper to capitalize side and append to token name
      const capitalize = (str) =>
        str.charAt(0).toUpperCase() +
        str.slice(1);

      // Sides we care about
      const sides = [
        "top",
        "right",
        "bottom",
        "left",
      ];

      // Push all breakpoints for a given side
      const pushBreakpoints = (
        side,
        breakpoints,
      ) => {
        Object.entries(toBreakpoints(breakpoints)).forEach(
          ([breakpoint, bpValue]) => {
            const figmaName = side
              ? `${key}${capitalize(side)}`
              : key;
            result.push({
              name: `spacing/${breakpoint}/${figmaName}`,
              value: Number(
                bpValue?.density?.default ?? bpValue,
              ),
            });
          },
        );
      };

      // CASE 1 — scalar (all sides, no sides explicitly defined)
      if (
        !(
          typeof value === "object" &&
          value !== null &&
          sides.some((side) => side in value)
        )
      ) {
        pushBreakpoints(null, value); // Only master variable
      } else {
        // CASE 2 — side-specific values
        sides.forEach((side) => {
          if (value[side] !== undefined)
            pushBreakpoints(side, value[side]);
        });
      }

      return result;
    });

    // Accumulate results
    accumulator[fileName] = {
      light: processColors(
        parsedContent,
        "light",
        allParsedContent,
      ),
      dark: processColors(
        parsedContent,
        "dark",
        allParsedContent,
      ),
      palette: paletteArray,
      radius: radiusArray,
      fontWeight: fontWeightArray,
      fontSize: fontSizeArray,
      lineHeight: lineHeightArray,
      spacing: spacingArray,
    };

    return accumulator;
  }, {});
};

export const extractMiddlewareJsonData = (
  jsonFiles,
  directoryPath,
) => {
  const allParsedContent = {}; // Initialize once to store all parsed content

  // First pass to gather allParsedContent
  jsonFiles.forEach((file) => {
    const filePath = path.resolve(
      directoryPath,
      file,
    );
    const fileContent = fs.readFileSync(
      filePath,
      "utf8",
    );
    const parsedContent = JSON.parse(fileContent);

    // Extract file name without extension to use as a key
    const fileName = path.basename(file, ".json");

    // Store the parsed content in the allParsedContent object
    allParsedContent[fileName] = parsedContent;
  });

  // Second pass to process each file
  return jsonFiles.reduce((accumulator, file) => {
    const filePath = path.resolve(
      directoryPath,
      file,
    );
    const fileContent = fs.readFileSync(
      filePath,
      "utf8",
    );
    const parsedContent = JSON.parse(fileContent);

    // Extract file name without extension
    const fileName = path.basename(file, ".json");

    function getTokenMeta(token = {}) {
      return {
        description: token.description,
        deprecated: token.deprecated === true,
        deprecatedBy: token.deprecatedBy,
      };
    }

    function attachTokenMeta(token, payload) {
      const meta = getTokenMeta(token);
      return {
        ...payload,
        ...(meta.description
          ? { description: meta.description }
          : {}),
        ...(meta.deprecated
          ? { deprecated: true }
          : {}),
        ...(meta.deprecatedBy
          ? { deprecatedBy: meta.deprecatedBy }
          : {}),
      };
    }

    function processColors(
      parsedContent,
      theme,
      allParsedContent,
    ) {
      if (!["light", "dark"].includes(theme)) {
        throw new Error(
          `Invalid theme: ${theme}. Expected 'light' or 'dark'.`,
        );
      }

      const themeColors = parsedContent[theme];

      function getPaletteName(value) {
        const regexMatch = value.match(
          /{palette\.(.*?)}/,
        );
        if (regexMatch) {
          return regexMatch[1];
        }
        const rgbaMatch = value.match(
          /rgba\(\{palette\.(.*?)\},\s*\d*\.?\d*\)/,
        );
        if (rgbaMatch) {
          return rgbaMatch[1];
        }
        throw new Error(
          `Unexpected color format: ${value}`,
        );
      }

      function getPaletteValue(colorName) {
        const paletteValue =
          parsedContent.global.palette[colorName]
            ?.value;
        if (!paletteValue) {
          throw new Error(
            `Color ${colorName} not found in palette`,
          );
        }
        return paletteValue;
      }

      function getMaxStopsAcrossBrands(
        allParsedContent,
        key,
      ) {
        let maxStops = 0;
        let isGradientInAnyBrand = false;

        // Loop through each brand
        Object.values(allParsedContent).forEach(
          (content) => {
            // Check both 'light' and 'dark' themes
            ["light", "dark"].forEach((theme) => {
              const colors =
                content[theme]?.[key];
              if (
                colors &&
                colors.type === "linear-gradient"
              ) {
                isGradientInAnyBrand = true;
                maxStops = Math.max(
                  maxStops,
                  colors.value.colors.length,
                );
              }
            });
          },
        );

        return { maxStops, isGradientInAnyBrand };
      }

      return Object.keys(themeColors).flatMap(
        (key) => {
          const colorData = themeColors[key];
          const { value, type } = colorData;

          const {
            maxStops,
            isGradientInAnyBrand,
          } = getMaxStopsAcrossBrands(
            allParsedContent,
            key,
            theme,
          );

          // Handle gradients first
          if (
            type === "linear-gradient" &&
            typeof value === "object"
          ) {
            // Map colors in gradient
            return Array.from(
              { length: maxStops },
              (_, index) => {
                if (index < value.colors.length) {
                  // Use the actual gradient stop color
                  const color =
                    value.colors[index];
                  const alphaMatch =
                    color.value.match(
                      /rgba\([^)]+,\s*([^)]+)\)/,
                    );
                  const alpha = alphaMatch
                    ? alphaMatch[1]
                    : "1";
                  const baseColorName =
                    getPaletteName(color.value);

                  return alpha === "1"
                    ? attachTokenMeta(colorData, {
                        name: `${key}-stop-${
                          index + 1
                        }`,
                        value: hexToRgba(
                          getPaletteValue(
                            baseColorName,
                          ),
                          parseFloat(alpha),
                        ),
                        hasAlias: true,
                        description:
                          baseColorName,
                      })
                    : attachTokenMeta(colorData, {
                        name: `${key}-stop-${
                          index + 1
                        }`,
                        value: hexToRgba(
                          getPaletteValue(
                            baseColorName,
                          ),
                          parseFloat(alpha),
                        ),
                        hasAlias: false,
                        description:
                          baseColorName,
                      });
                } else if (isGradientInAnyBrand) {
                  // If this brand does not have a gradient, repeat the base color to match stops
                  const baseColorName =
                    getPaletteName(
                      value.colors[0].value,
                    );
                  const alpha = 1;
                  return attachTokenMeta(
                    colorData,
                    {
                      name: `${key}-stop-${
                        index + 1
                      }`,
                      value: hexToRgba(
                        getPaletteValue(
                          baseColorName,
                        ),
                        parseFloat(alpha),
                      ),

                      hasAlias: false,
                      description: baseColorName,
                    },
                  );
                }
              },
            ).filter(Boolean);
          }

          // Handle solid colors or aliases when a gradient exists in other brands
          if (
            type !== "linear-gradient" &&
            isGradientInAnyBrand
          ) {
            const baseColorName =
              getPaletteName(value);
            const alpha = 1;
            // Repeat the solid color to match the gradient stops
            return Array.from(
              { length: maxStops },
              (_, index) =>
                attachTokenMeta(colorData, {
                  name: `${key}-stop-${index + 1}`,
                  value: hexToRgba(
                    getPaletteValue(
                      baseColorName,
                    ),
                    parseFloat(alpha),
                  ),
                  hasAlias: false,
                  description: baseColorName,
                }),
            );
          }

          // Handle solid colors or aliases normally
          if (
            typeof value === "string" &&
            !value.startsWith("rgba")
          ) {
            const baseColorName =
              getPaletteName(value);
            const alpha = 1;
            return attachTokenMeta(colorData, {
              name: `${key}`,
              value: hexToRgba(
                getPaletteValue(baseColorName),
                parseFloat(alpha),
              ),

              hasAlias: true,
              description: baseColorName,
            });
          }

          // Handle rgba colors
          if (
            typeof value === "string" &&
            value.startsWith("rgba")
          ) {
            const alphaMatch = value.match(
              /rgba\([^)]+,\s*([^)]+)\)/,
            );
            const alpha = alphaMatch
              ? alphaMatch[1]
              : "1";
            const baseColorName =
              getPaletteName(value);

            return attachTokenMeta(colorData, {
              name: `${key}`,
              value: hexToRgba(
                getPaletteValue(baseColorName),
                parseFloat(alpha),
              ),
              hasAlias: false,
              description: baseColorName,
            });
          }

          throw new Error(
            `Unexpected color format for key: ${key}`,
          );
        },
      );
    }

    // Other token processing logic
    const paletteArray = Object.keys(
      parsedContent.global.palette,
    ).map((key) => ({
      name: key,
      value: hexToRgba(
        parsedContent.global.palette[key].value,
      ),
    }));

    const radiusArray = Object.keys(
      parsedContent.radius,
    ).flatMap((key) =>
      expandValue(
        "radii/",
        key,
        parsedContent.radius[key].value,
        parseRadius,
      ).map((entry) =>
        attachTokenMeta(
          parsedContent.radius[key],
          entry,
        ),
      ),
    );

    const fontWeightArray = Object.keys(
      parsedContent.text.weight,
    ).map((key) =>
      attachTokenMeta(
        parsedContent.text.weight[key],
        {
          name: `fontWeight/${key}`,
          value:
            parsedContent.text.weight[key].value,
        },
      ),
    );

    const fontSizeArray = Object.keys(
      parsedContent.text.size,
    ).flatMap((key) =>
      expandValue(
        "fontSize/",
        key,
        parsedContent.text.size[key].value,
        parseFloat,
        true,
      ).map((entry) =>
        attachTokenMeta(
          parsedContent.text.size[key],
          entry,
        ),
      ),
    );

    const lineHeightArray = Object.keys(
      parsedContent.text.lineHeight,
    ).flatMap((key) =>
      expandValue(
        "lineHeight/",
        key,
        parsedContent.text.lineHeight[key].value,
        parseFloat,
        true,
      ).map((entry) =>
        attachTokenMeta(
          parsedContent.text.lineHeight[key],
          entry,
        ),
      ),
    );

    const spacingArray = Object.keys(
      parsedContent.spacing,
    ).flatMap((key) => {
      const token = parsedContent.spacing[key];
      const value = token.value;
      const result = [];

      const capitalize = (str) =>
        str.charAt(0).toUpperCase() +
        str.slice(1);

      const sides = [
        "top",
        "right",
        "bottom",
        "left",
      ];

      const pushBreakpoints = (
        nameSuffix,
        breakpoints,
      ) => {
        Object.entries(toBreakpoints(breakpoints)).forEach(
          ([bp, bpValue]) => {
            const figmaName = nameSuffix
              ? `${key}${capitalize(nameSuffix)}`
              : key;
            result.push({
              ...attachTokenMeta(token, {
                name: `spacing/${bp}/${figmaName}`,
                value: Number(
                  bpValue?.density?.default ?? bpValue,
                ),
                ...(bpValue?.density?.compact !== undefined
                  ? {
                      compact: Number(
                        bpValue.density.compact,
                      ),
                    }
                  : {}),
              }),
            });
          },
        );
      };

      // CASE 1 — scalar (all breakpoints, no sides explicitly defined)
      if (
        !(
          typeof value === "object" &&
          value !== null &&
          sides.some((side) => side in value)
        )
      ) {
        pushBreakpoints(null, value); // master variable only
      } else {
        // CASE 2 — side-specific values
        sides.forEach((side) => {
          if (value[side] !== undefined) {
            pushBreakpoints(side, value[side]);
          }
        });
      }

      return result;
    });

    const themeVariantArray = Object.keys(
      parsedContent.themeVariant,
    ).map((key) =>
      attachTokenMeta(
        parsedContent.themeVariant[key],
        {
          name: `themeVariant/${key}`,
          value:
            parsedContent.themeVariant[key].value,
        },
      ),
    );

    const componentPropertiesArray = Object.keys(
      parsedContent.componentProperties || {},
    ).flatMap((key) => {
      const token =
        parsedContent.componentProperties[key];
      const { value } = token;

      // If value is an object, expand into one entry per sub-key
      if (
        typeof value === "object" &&
        value !== null
      ) {
        return Object.keys(value).map((subKey) =>
          attachTokenMeta(token, {
            name: `componentProperties/${key}/${subKey}`,
            value: value[subKey],
          }),
        );
      }

      // Scalar value — keep as-is
      return attachTokenMeta(token, {
        name: `componentProperties/${key}`,
        value,
      });
    });

    // Accumulate results
    accumulator[fileName] = {
      light: processColors(
        parsedContent,
        "light",
        allParsedContent,
      ),
      dark: processColors(
        parsedContent,
        "dark",
        allParsedContent,
      ),
      palette: paletteArray,
      radius: radiusArray,
      fontWeight: fontWeightArray,
      fontSize: fontSizeArray,
      lineHeight: lineHeightArray,
      spacing: spacingArray,
      themeVariant: themeVariantArray,
      componentProperties:
        componentPropertiesArray,
    };

    return accumulator;
  }, {});
};
