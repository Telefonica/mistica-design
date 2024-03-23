import React, { useState, useEffect } from "react";
import getContrastRatio from "../helpers/contrastRatio";
import ContrastChecker from "../helpers/contrastChecker";
import { useParams } from "react-router-dom";
import {
  ButtonLink,
  ResponsiveLayout,
  Stack,
  Title2,
  Tag,
  Title1,
  skinVars,
  Inline,
  Box,
  Text,
  IconChevronLeftRegular,
  Circle,
  Select,
} from "@telefonica/mistica";
import styles from "./tokenDetail.module.css";
import ColorCode from "../components/colorCode";
import getColorValue from "../helpers/getColorValue";
import GetSkin from "../helpers/getSkin";
import { getColorData } from "../helpers/getTokenData";
import AppLayout from "../components/app-layout";
import SubHeader from "../components/sub-header";

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
      palette
    );
    const textColor = getColorValue(
      skinData?.[skinName]?.[colorScheme]?.[foregroundColor],
      palette
    );

    const backgroundColor = getColorValue(
      skinData?.[skinName]?.[colorScheme]?.[id],
      palette
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

  const Row = ({ skinName, tokenValue, paletteValue, colorScheme }) => (
    <tr>
      <td>{skinName}</td>
      <td>
        <Tag type="success">{paletteValue}</Tag>
      </td>
      <td>
        <ColorCode color={tokenValue}></ColorCode>
      </td>
      <td>
        <Inline key={foregroundColor} space={8}>
          {getColorBox({
            skinName,
            colorScheme,
          })}
          <ContrastChecker
            contrastRatio={getContrastRatio(
              tokenValue,
              getColorValue(
                skinData?.[skinName]?.[colorScheme]?.[foregroundColor].value,
                skinData?.[skinName]?.global?.palette
              )
            )}
          ></ContrastChecker>{" "}
        </Inline>
      </td>
    </tr>
  );

  const renderColorTable = (skinData, id) => {
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
        <table>
          <thead>
            <tr>
              <th>Skin</th>
              <th>Palette Token</th>
              <th>Value</th>
              <th>Contrast</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(skinData).length > 0 &&
              getColorData(skinData, id, "light").map((tokens, index) => (
                <Row
                  key={index}
                  skinName={tokens.skinName}
                  paletteValue={tokens.paletteValue}
                  colorScheme="light"
                  tokenValue={tokens.tokenValue}
                />
              ))}
          </tbody>
        </table>
        <Title1>Dark colors</Title1>
        <table>
          <thead>
            <tr>
              <th>Skin</th>
              <th>Palette Token</th>
              <th>Value</th>
              <th>Contrast</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(skinData).length > 0 &&
              getColorData(skinData, id, "dark").map((tokens, index) => (
                <Row
                  key={index} // Make sure to specify a unique key for each mapped element
                  skinName={tokens.skinName}
                  paletteValue={tokens.paletteValue}
                  colorScheme="dark"
                  tokenValue={tokens.tokenValue}
                />
              ))}
          </tbody>
        </table>
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
              <Stack space={24}>{<>{renderColorTable(skinData, id)}</>}</Stack>
            </Stack>
          </div>
        </ResponsiveLayout>
      </Box>
    </AppLayout>
  );
};

export default ColorDetail;
