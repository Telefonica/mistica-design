import React, { useState, useEffect } from "react";
import getColorValue from "../helpers/getColorValue";
import {
  ButtonPrimary,
  Inline,
  Box,
  Title1,
  Text,
  Stack,
  NavigationBar,
  Header,
  MainSectionHeader,
  MainSectionHeaderLayout,
  Boxed,
  forceMobile,
  ResponsiveLayout,
} from "@telefonica/mistica";
import Preview from "../components/preview";

const ColorEditor = () => {
  const [jsonData, setJsonData] = useState({});
  const [selectedSkin, setSelectedSkin] = useState("vivo-new");
  const [skin, setSkin] = useState({});
  const [editedColors, setEditedColors] = useState(skin || {});

  const editableColors = {
    // List of colors that can be edited in the editor (not all colors are editable)
    buttonPrimaryBackground: skin.colors?.buttonPrimaryBackground,
    textPrimary: skin.colors?.textPrimary,
  };

  useEffect(() => {
    const fetchSkins = async () => {
      const skinNames = [
        "movistar",
        "movistar-legacy",
        "vivo",
        "vivo-new",
        "blau",
        "o2",
        "telefonica",
        "solar-360",
      ];
      const skins = {};

      try {
        for (let i = 0; i < skinNames.length; i++) {
          const skinName = skinNames[i];
          const response = await fetch(
            `https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/${skinName}.json`
          );
          const data = await response.json();
          skins[skinName] = data;
        }

        setJsonData(skins[selectedSkin]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSkins();
  }, [selectedSkin]);

  function extractColors(json) {
    const colors = json?.light ? {} : null;
    const darkModeColors = json?.dark ? {} : null;

    if (json?.light) {
      Object.keys(json.light).forEach((key) => {
        colors[key] = getColorValue(json.light[key].value, json.global.palette);
      });
    }

    if (json?.dark) {
      Object.keys(json.dark).forEach((key) => {
        darkModeColors[key] = getColorValue(
          json.dark[key].value,
          json.global.palette
        );
      });
    }

    return { colors, darkModeColors };
  }

  function extractPresets(jsonData) {
    const transformedData = { textPresets: {} };

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

      transformedData.textPresets[textKey] = preset;
    }

    return transformedData;
  }

  function extractBorderRadii(jsonData) {
    const borderRadii = { borderRadii: {} };

    for (const key in jsonData.radius) {
      let value = jsonData.radius[key].value;
      // Replace "circle" with "50%"
      if (value === "circle") {
        value = "50%";
      } else {
        value = `${value}px`;
      }
      borderRadii.borderRadii[key] = value; // Store the value in the correct property
    }

    return borderRadii;
  }

  useEffect(() => {
    // Check if jsonData is available before extracting colors and transforming
    if (jsonData && Object.keys(jsonData).length > 0) {
      const colors = extractColors(jsonData);
      const presets = extractPresets(jsonData); // Transform JSON structure
      const borderRadii = extractBorderRadii(jsonData); // Transform JSON structure

      const resolvedSkin = {
        name: "test",
        colors: colors.colors,
        darkModeColors: colors.darkModeColors,
        borderRadii: borderRadii.borderRadii,
        textPresets: presets.textPresets,
      };

      setSkin(resolvedSkin); // Set skin when jsonData or skinName changes
    }
  }, [jsonData]);

  const renderThemeProvider = Object.keys(skin).length > 0;

  const handleColorUpdate = (colorName, newValue) => {
    // Check if the new value is different from the previous color
    if (editedColors[colorName] !== newValue) {
      // Update the color in the state
      setEditedColors((prevColors) => ({
        ...prevColors,
        [colorName]: newValue === "" ? prevColors[colorName] : newValue,
      }));
    }
  };

  const handleApplyColors = () => {
    // Create a copy of the JSON data to make changes
    const updatedJsonData = { ...jsonData };

    // Update each color in the JSON data
    for (const colorName of Object.keys(editedColors)) {
      if (updatedJsonData.light && updatedJsonData.light[colorName]) {
        updatedJsonData.light[colorName].value = editedColors[colorName];
      }
    }

    // Extract the updated skin data and set it
    if (updatedJsonData && Object.keys(updatedJsonData).length > 0) {
      const colors = extractColors(updatedJsonData);
      const presets = extractPresets(updatedJsonData);
      const borderRadii = extractBorderRadii(updatedJsonData);

      const updatedSkin = {
        name: "test",
        colors: colors.colors,
        darkModeColors: colors.darkModeColors,
        borderRadii: borderRadii.borderRadii,
        textPresets: presets.textPresets,
      };

      // Update the state with the updated data
      setSkin(updatedSkin);
      setJsonData(updatedJsonData);
    }
  };

  return (
    <ResponsiveLayout>
      <div>
        <h3>Skin Object:</h3>
        <Inline space={48} fullWidth>
          <Stack space={8}>
            {Object.keys(editableColors).map((colorName) => (
              <Inline space={8} key={colorName}>
                <Text>{colorName}</Text>
                <input
                  type="color"
                  value={
                    editedColors[colorName] ||
                    (skin.colors && skin.colors[colorName]) ||
                    "#000000"
                  }
                  onChange={(e) => handleColorUpdate(colorName, e.target.value)}
                />
              </Inline>
            ))}
          </Stack>
          {/* Button to apply the color update */}
          <button onClick={handleApplyColors}>Update color</button>

          {renderThemeProvider && (
            <Box>
              <Boxed>
                <Preview skin={skin}>
                  <Box>
                    <MainSectionHeaderLayout>
                      <MainSectionHeader
                        title="Title"
                        description="Some text here"
                        button={
                          <ButtonPrimary href="asdf">Action</ButtonPrimary>
                        }
                      />
                    </MainSectionHeaderLayout>

                    <Title1>Button</Title1>
                    <Text>Button text</Text>
                    <ButtonPrimary onPress={() => {}}>Button</ButtonPrimary>
                    <ButtonPrimary onPress={() => {}}>Button</ButtonPrimary>
                  </Box>
                  {/* Add more components here */}
                </Preview>
              </Boxed>
            </Box>
          )}
        </Inline>
      </div>
    </ResponsiveLayout>
  );
};

export default ColorEditor;
