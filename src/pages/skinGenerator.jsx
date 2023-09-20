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
  const [selectedSkin, setSelectedSkin] = useState("vivo-new");
  const { skinData } = GetSkin({ selectedSkin, branch: "production" });
  const [skin, setSkin] = useState({});
  const [editedColors, setEditedColors] = useState(skin || {});

  // Generate the skin object from the JSON data for the theme provider

  useEffect(() => {
    setSkin(SkinDataTransformer(skinData));
  }, [skinData]);

  // List of colors that can be edited in the editor (not all colors are editable)

  const editableColors = Object.keys(skin).length > 0 && skin.colors;

  const handleColorUpdate = (prevValue, newValue) => {
    // Check if the new value is different from the previous color
    if (editedColors[prevValue] !== newValue) {
      // Update the color in the state
      setEditedColors((prevColors) => ({
        ...prevColors,
        [prevValue]: newValue === "" ? prevColors[prevValue] : newValue,
      }));
    }
  };

  const handleApplyColors = () => {
    // Create a copy of the JSON data to make changes
    const modifiedSkinData = { ...skinData };

    // Update each color in the JSON data
    for (const colorName of Object.keys(editedColors)) {
      if (modifiedSkinData.light && modifiedSkinData.light[colorName]) {
        modifiedSkinData.light[colorName].value = editedColors[colorName];
      }
    }

    // Extract the updated skin data and set it
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
