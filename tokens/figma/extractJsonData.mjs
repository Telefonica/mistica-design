import fs from "fs";
import path from "path";
import { hexToRgba } from "./utils.mjs";

const extractJsonData = (
  jsonFiles,
  directoryPath
) => {
  return jsonFiles.reduce((accumulator, file) => {
    const filePath = path.resolve(
      directoryPath,
      file
    );
    const fileContent = fs.readFileSync(
      filePath,
      "utf8"
    );
    const parsedContent = JSON.parse(fileContent);

    function processColors(parsedContent, theme) {
      if (!["light", "dark"].includes(theme)) {
        throw new Error(
          `Invalid theme: ${theme}. Expected 'light' or 'dark'.`
        );
      }

      const themeColors = parsedContent[theme];

      function getPaletteName(value) {
        const regexMatch = value.match(
          /{palette\.(.*?)}/
        );
        if (regexMatch) {
          return regexMatch[1];
        }
        const rgbaMatch = value.match(
          /rgba\(\{palette\.(.*?)\},\s*\d*\.?\d*\)/
        );
        if (rgbaMatch) {
          return rgbaMatch[1];
        }
        throw new Error(
          `Unexpected color format: ${value}`
        );
      }

      function getPaletteValue(colorName) {
        const paletteValue =
          parsedContent.global.palette[colorName]
            ?.value;
        if (!paletteValue) {
          throw new Error(
            `Color ${colorName} not found in palette`
          );
        }
        return paletteValue;
      }

      return Object.keys(themeColors).flatMap(
        (key) => {
          const colorData = themeColors[key];
          const { value, type } = colorData;

          // Default color handling
          if (
            typeof value === "string" &&
            !value.startsWith("rgba")
          ) {
            return {
              name: `${theme}/${key}`,
              value: getPaletteName(value),
              hasAlias: true,
            };
          }

          // Color with alpha (rgba)
          if (
            typeof value === "string" &&
            value.startsWith("rgba")
          ) {
            const alphaMatch = value.match(
              /rgba\([^)]+,\s*([^)]+)\)/
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
                      baseColorName
                    ),
                    alpha
                  ),
                  hasAlias: false,
                };
          }

          // Gradient handling
          if (
            type === "linear-gradient" &&
            typeof value === "object"
          ) {
            return value.colors.map(
              (color, index) => {
                const alphaMatch =
                  color.value.match(
                    /rgba\([^)]+,\s*([^)]+)\)/
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
                          baseColorName
                        ),
                        alpha
                      ),
                      hasAlias: false,
                    };
              }
            );
          }

          throw new Error(
            `Unexpected color format for key: ${key}`
          );
        }
      );
    }

    const paletteArray = Object.keys(
      parsedContent.global.palette
    ).map((key) => ({
      name: key,
      value: hexToRgba(
        parsedContent.global.palette[key].value
      ),
    }));

    const radiusArray = Object.keys(
      parsedContent.radius
    ).map((key) => ({
      name: key,
      value:
        typeof parsedContent.radius[key].value ===
        "string"
          ? parsedContent.radius[key].value ===
            "circle"
            ? 999 // If the value is "circle", set it to 999
            : parseFloat(
                parsedContent.radius[key].value
              ) // Otherwise, convert it to a float
          : parsedContent.radius[key].value, // If it's not a string, use the original value
    }));

    const fontWeightArray = Object.keys(
      parsedContent.text.weight
    ).map((key) => ({
      name: key,
      value: parsedContent.text.weight[key].value,
    }));

    const fontSizeArray = Object.keys(
      parsedContent.text.size
    ).flatMap((key) => {
      const value =
        parsedContent.text.size[key].value;

      // Check if the value is an object with mobile and desktop properties
      if (
        typeof value === "object" &&
        value !== null
      ) {
        return [
          {
            name: `mobile/${key}`,
            value: parseFloat(value.mobile),
          },
          {
            name: `desktop/${key}`,
            value: parseFloat(value.desktop),
          },
        ];
      }

      // If value is not an object, return a single entry
      return {
        name: key,
        value: parseFloat(value),
      };
    });

    const lineHeightArray = Object.keys(
      parsedContent.text.lineHeight
    ).flatMap((key) => {
      const value =
        parsedContent.text.lineHeight[key].value;

      // Check if the value is an object with mobile and desktop properties
      if (
        typeof value === "object" &&
        value !== null
      ) {
        return [
          {
            name: `mobile/${key}`,
            value: parseFloat(value.mobile),
          },
          {
            name: `desktop/${key}`,
            value: parseFloat(value.desktop),
          },
        ];
      }

      // If value is not an object, return a single entry
      return {
        name: key,
        value: parseFloat(value),
      };
    });

    // Extract file name without extension
    const fileName = file.split(".")[0];

    // Accumulate results
    accumulator[fileName] = {
      light: processColors(
        parsedContent,
        "light"
      ),
      dark: processColors(parsedContent, "dark"),
      palette: paletteArray,
      radius: radiusArray,
      fontWeight: fontWeightArray,
      fontSize: fontSizeArray,
      lineHeight: lineHeightArray,
    };

    return accumulator;
  }, {});
};

export default extractJsonData;
