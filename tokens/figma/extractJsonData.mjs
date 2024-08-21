import fs from "fs";
import path from "path";

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

    const lightArray = Object.keys(
      parsedContent.light
    ).map((key) => ({
      name: key,
      value: parsedContent.light[key].value,
    }));

    const darkArray = Object.keys(
      parsedContent.dark
    ).map((key) => ({
      name: key,
      value: parsedContent.dark[key].value,
    }));

    const paletteArray = Object.keys(
      parsedContent.global.palette
    ).map((key) => ({
      name: key,
      value:
        parsedContent.global.palette[key].value,
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
      light: lightArray,
      dark: darkArray,
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
