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
  IconChevronLeftRegular,
  ButtonLink,
  Text2,
  TextField,
  ResponsiveLayout,
  Select,
} from "@telefonica/mistica";
import Preview from "../components/preview";
import GetSkin from "../helpers/getSkin";
import { getHCLScale, getHSLScale } from "../helpers/getColorScale";

const PaletteGenerator = () => {
  const [selectedSkin, setSelectedSkin] = useState("movistar");
  const { skinData, skinNames, skinError } = GetSkin({
    selectedSkin,
    branch: "production",
  });
  const [selectedColor, setSelectedColor] = useState(undefined);
  const [colorModel, setColorModel] = useState("getHCLScale");
  const [paletteSteps, setPaletteSteps] = useState(10);
  const [newPalette, setNewPalette] = useState();

  const ColorBox = ({ color = "white" }) => {
    return (
      <>
        <div
          style={{
            width: 100,
            height: 100,
            backgroundColor: color,
            borderRadius: 8,
            border: "1px solid black",
          }}
        />
        <Stack space={4}>
          <Text2>{color}</Text2>
        </Stack>
      </>
    );
  };

  const COLOR_MODE_FUNCTIONS = {
    getHCLScale,
    getHSLScale,
  };

  return (
    <div>
      <MainSectionHeaderLayout isInverse={true}>
        <MainSectionHeader title="Palette Generator" />
      </MainSectionHeaderLayout>
      <ResponsiveLayout>
        <Stack space={32}>
          <Boxed>
            <Box padding={32}>
              <Stack space={32}>
                <Stack space={16}>
                  <Inline space={32}>
                    <ColorBox color={selectedColor} />
                    <TextField
                      label="Color"
                      value={selectedColor}
                      onChangeValue={setSelectedColor}
                    />
                    <Select
                      label="colorModel"
                      options={[
                        { value: "getHCLScale", text: "HCL" },
                        { value: "getHSLScale", text: "HSL" },
                      ]}
                      value={colorModel}
                      onChangeValue={setColorModel}
                    />
                    <TextField
                      label="Palette steps"
                      value={paletteSteps}
                      onChangeValue={setPaletteSteps}
                    />
                  </Inline>

                  <ButtonPrimary onPress={() => setNewPalette(selectedColor)}>
                    Generate palette
                  </ButtonPrimary>
                </Stack>
              </Stack>
            </Box>
          </Boxed>
          <Stack space={32}>
            <Inline space={32}>
              {COLOR_MODE_FUNCTIONS[colorModel]?.(
                newPalette,
                paletteSteps
              )?.map((color, index) => (
                <ColorBox key={index} color={color} />
              ))}
            </Inline>
            <Text2>
              {COLOR_MODE_FUNCTIONS[colorModel]?.(newPalette, paletteSteps)}
            </Text2>
          </Stack>
        </Stack>
      </ResponsiveLayout>
    </div>
  );
};

export default PaletteGenerator;
