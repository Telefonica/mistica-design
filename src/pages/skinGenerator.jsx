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
import GetSkin from "../helpers/getSkin";
import { SkinDataTransformer } from "../helpers/skinDataTransformer";

const ColorEditor = () => {
  const [selectedSkin, setSelectedSkin] = useState("movistar");
  const { skinData } = GetSkin({ selectedSkin, branch: "production" });
  const [skin, setSkin] = useState({});
  const [editedLightColors, setEditedLightColors] = useState(skin.colors || {});
  const [editedDarkColors, setEditedDarkColors] = useState(
    skin.darkModeColors || {}
  );

  // Generate the skin object from the JSON data for the theme provider

  useEffect(() => {
    setSkin(SkinDataTransformer(skinData));
  }, [skinData]);

  // List of colors that can be edited in the editor (not all colors are editable)

  const editableColors = Object.keys(skin).length > 0 && skin.colors;

  const handleColorUpdate = (colorName, colorScheme, newValue) => {
    if (colorScheme === "light") {
      // Update the light color in the state
      setEditedLightColors((prevColors) => ({
        ...prevColors,
        [colorName]: newValue === "" ? prevColors[colorName] : newValue,
      }));
    } else if (colorScheme === "dark") {
      // Update the dark color in the state
      setEditedDarkColors((prevColors) => ({
        ...prevColors,
        [colorName]: newValue === "" ? prevColors[colorName] : newValue,
      }));
    }
  };

  const handleApplyColors = () => {
    const modifiedSkinData = { ...skinData };

    // Update light colors
    for (const colorName of Object.keys(editedLightColors)) {
      if (modifiedSkinData.light && modifiedSkinData.light[colorName]) {
        modifiedSkinData.light[colorName].value = editedLightColors[colorName];
      }
    }

    // Update dark colors
    for (const colorName of Object.keys(editedDarkColors)) {
      if (modifiedSkinData.dark && modifiedSkinData.dark[colorName]) {
        modifiedSkinData.dark[colorName].value = editedDarkColors[colorName];
      }
    }

    if (modifiedSkinData && Object.keys(modifiedSkinData).length > 0) {
      setSkin(SkinDataTransformer(modifiedSkinData));
    }
  };

  // Prevent to render the theme provider before the skin object is generated

  const renderThemeProvider = Object.keys(skin).length > 0;

  return (
    <ResponsiveLayout>
      <div>
        <h3>Skin Object:</h3>
        <Inline space={48} fullWidth>
          <Stack space={8}>
            <table>
              {Object.keys(editableColors).map((colorName) => (
                <tr>
                  <td>
                    <Text>{colorName}</Text>
                  </td>
                  <td>
                    <input
                      type="color"
                      value={
                        editedLightColors[colorName] ||
                        (skin.colors && skin.colors[colorName]) ||
                        "#000000"
                      }
                      onChange={(e) =>
                        handleColorUpdate(colorName, "light", e.target.value)
                      }
                    />
                  </td>
                  <input
                    type="color"
                    value={
                      editedDarkColors[colorName] ||
                      (skin.darkModeColors && skin.darkModeColors[colorName]) ||
                      "#000000"
                    }
                    onChange={(e) =>
                      handleColorUpdate(colorName, "dark", e.target.value)
                    }
                  ></input>
                </tr>
              ))}
            </table>
          </Stack>

          {/* Button to apply the color update */}
          <button onClick={handleApplyColors}>Update color</button>

          {renderThemeProvider && (
            <Box>
              <Boxed>
                <Preview skin={skin}>
                  <Box>
                    <MainSectionHeaderLayout>
                      <Box paddingX={16}>
                        <MainSectionHeader
                          title="Title"
                          description="Some text here"
                          button={
                            <ButtonPrimary href="asdf">Action</ButtonPrimary>
                          }
                        />
                      </Box>
                    </MainSectionHeaderLayout>
                    <Box paddingX={16}>
                      <Title1>Button</Title1>
                      <Text>Button text</Text>
                      <ButtonPrimary onPress={() => {}}>Button</ButtonPrimary>
                      <ButtonPrimary onPress={() => {}}>Button</ButtonPrimary>
                    </Box>
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
