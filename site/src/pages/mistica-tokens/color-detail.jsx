import React, { useState } from "react";
import getContrastRatio from "../../helpers/contrastRatio";
import ContrastChecker from "../../helpers/contrastChecker";
import { useParams } from "react-router-dom";
import {
  ResponsiveLayout,
  Stack,
  Title2,
  Table,
  Tag,
  Title1,
  Inline,
  Box,
  Text,
  Circle,
  Select,
} from "@telefonica/mistica";
import styles from "./tokenDetail.module.css";
import ColorSample from "../../components/colorSample";
import getColorValue from "../../helpers/getColorValue";
import GetSkin from "../../helpers/getSkin";
import { getColorData } from "../../helpers/getTokenData";
import AppLayout from "../../components/app-layout";
import SubHeader from "../../components/sub-header";

const ColorDetail = () => {
  const { id, tokenType, branch, selectedSkin, selectedColor } = useParams();
  const [foregroundColor, setForegroundColor] = useState("textPrimary");
  const { skinData } = GetSkin({ branch });
  const colorKeys = Object.keys(skinData?.movistar?.light || {});

  // Create a box to represent the foreground color against the color of the detail

  const getColorBox = ({ skinName, colorScheme }) => {
    const palette = skinData?.[skinName]?.global?.palette;
    const borderRadius = "50%";
    const display = "flex";
    const alignItems = "center";
    const borderColor = getColorValue(
      skinData?.[skinName]?.[colorScheme]?.border?.value,
      palette,
    );
    const textColor = getColorValue(
      skinData?.[skinName]?.[colorScheme]?.[foregroundColor],
      palette,
    );

    const backgroundColor = getColorValue(
      skinData?.[skinName]?.[colorScheme]?.[id],
      palette,
    );

    return (
      <div
        style={{
          borderRadius,
          display,
          alignItems,
        }}
      >
        <Circle
          size={32}
          backgroundColor={backgroundColor}
          border={borderColor}
        >
          <Text color={textColor}>Aa</Text>
        </Circle>
      </div>
    );
  };

  const getTableContent = (colorScheme) => {
    if (Object.keys(skinData).length === 0) {
      return [];
    }

    return getColorData(skinData, id, colorScheme).map((tokens) => [
      tokens.skinName,
      <Tag type="success">{tokens.paletteValue}</Tag>,
      <ColorSample color={tokens.tokenValue} palette={tokens.paletteValue} />,
      <Inline space={8}>
        {getColorBox({
          skinName: tokens.skinName,
          colorScheme,
        })}
        <ContrastChecker
          contrastRatio={getContrastRatio(
            tokens.tokenValue,
            getColorValue(
              skinData?.[tokens.skinName]?.[colorScheme]?.[foregroundColor]
                .value,
              skinData?.[tokens.skinName]?.global?.palette,
            ),
          )}
        />
      </Inline>,
    ]);
  };

  const renderColorTable = () => {
    const heading = ["Skin", "Palette Token", "Value", "Contrast"];

    return (
      <Stack space={32}>
        <Inline fullWidth space="between">
          <div></div>
          <Select
            label="Select foreground color"
            onChangeValue={setForegroundColor}
            value={foregroundColor}
            options={colorKeys.map((token) => ({
              value: token,
              text: token,
              key: token,
            }))}
          ></Select>
        </Inline>
        <Title1>Light colors</Title1>
        <Table
          heading={heading}
          content={getTableContent("light")}
          boxed
          responsive="collapse-rows"
        />
        <Title1>Dark colors</Title1>
        <Table
          heading={heading}
          content={getTableContent("dark")}
          boxed
          responsive="collapse-rows"
        />
      </Stack>
    );
  };

  return (
    <AppLayout>
      <Box paddingY={48}>
        <ResponsiveLayout>
          <SubHeader
            to={`/tokens-map/?branch=${branch}&skin=${selectedSkin}&tokenType=${tokenType}&activeColor=${selectedColor}`}
          />
          <div className={styles.tokenDetail}>
            <Stack space={40}>
              <Title2>{id}</Title2>
              <Stack space={24}>{<>{renderColorTable()}</>}</Stack>
            </Stack>
          </div>
        </ResponsiveLayout>
      </Box>
    </AppLayout>
  );
};

export default ColorDetail;
