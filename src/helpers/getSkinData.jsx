import getColorValue from "./getColorValue";

export function getSkinData(jsonData) {
  const extractedData = {
    name: "test",
    colors: {},
    darkModeColors: {},
    borderRadii: { borderRadii: {} },
    textPresets: { textPresets: {} },
  };

  for (const key in jsonData.radius) {
    let value = jsonData.radius[key].value;
    if (value === "circle") {
      value = "50%";
    } else {
      value = `${value}px`;
    }
    extractedData.borderRadii.borderRadii[key] = value;
  }

  for (const textKey in jsonData.text.weight) {
    const weight = jsonData.text.weight[textKey].value;
    const sizeData = jsonData.text.size[textKey]?.value;
    const lineHeightData = jsonData.text.lineHeight[textKey]?.value;

    const preset = { weight };

    if (sizeData || lineHeightData) {
      preset.size = {};

      if (sizeData) {
        preset.size.mobile = sizeData.mobile;
        preset.size.desktop = sizeData.desktop;
      }

      if (lineHeightData) {
        preset.lineHeight = {};

        if (lineHeightData.mobile) {
          preset.lineHeight.mobile = lineHeightData.mobile;
        }

        if (lineHeightData.desktop) {
          preset.lineHeight.desktop = lineHeightData.desktop;
        }
      }
    }

    extractedData.textPresets.textPresets[textKey] = preset;
  }

  if (jsonData.light) {
    for (const key in jsonData.light) {
      extractedData.colors[key] = getColorValue(
        jsonData.light[key].value,
        jsonData.global.palette
      );
    }
  }

  if (jsonData.dark) {
    for (const key in jsonData.dark) {
      extractedData.darkModeColors[key] = getColorValue(
        jsonData.dark[key].value,
        jsonData.global.palette
      );
    }
  }

  return extractedData;
}
