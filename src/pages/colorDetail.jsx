import React, { useState, useEffect } from "react";
import hexToRgbA from "../helpers/hexToRgba";
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

const ColorDetail = () => {
  const [skins, setSkins] = useState([]);
  const [foregroundColor, setForegroundColor] = useState("textPrimary");
  const { id, tokenType, branch, selectedSkin, selectedColor } = useParams();
  const textTokens = [
    "textPrimary",
    "textPrimaryInverse",
    "textSecondary",
    "textSecondaryInverse",
    "textLink",
  ];
  const colorKeys = Object.keys(skins[0]?.light || {});

  // List of skins to load

  const skinFiles = [
    { name: "Movistar", filename: "movistar.json" },
    { name: "Vivo", filename: "vivo.json" },
    { name: "O2", filename: "o2.json" },
    { name: "Blau", filename: "blau.json" },
    { name: "Telefónica", filename: "telefonica.json" },
    { name: "Solar 360", filename: "solar-360.json" },
  ];

  // Load the skins

  useEffect(() => {
    const loadSkins = async () => {
      try {
        const skinData = await Promise.all(
          skinFiles.map(({ name, filename }) =>
            fetch(
              `https://raw.githubusercontent.com/Telefonica/mistica-design/${branch}/tokens/${filename}`
            )
              .then((response) => response.json())
              .then((skin) => ({ ...skin, name }))
          )
        );
        setSkins(skinData);
      } catch (error) {
        console.error(error);
      }
    };

    loadSkins();
  }, []);

  // Get the color value from the skin

  const getPaletteValue = (skin, tokenKey, type) => {
    const paletteValue = skin?.[type]?.[tokenKey]?.value;

    if (!paletteValue) return "";

    const rgbaMatch = paletteValue.match(/rgba\({palette\.(.*?)\},\s*(.*?)\)/);
    const paletteKey = paletteValue.match(/{palette.(.*?)}/)?.[1];

    if (rgbaMatch) {
      const alphaValue = rgbaMatch[2];
      const paletteColor = skin?.global?.palette?.[rgbaMatch[1]]?.value;
      if (!paletteColor)
        throw new Error(`Palette color not found: ${paletteKey}`);
      return hexToRgbA(paletteColor, alphaValue);
    }

    if (paletteKey) {
      const paletteColor = skin?.global?.palette?.[paletteKey]?.value;
      if (!paletteColor)
        throw new Error(`Palette color not found: ${paletteKey}`);
      return paletteColor;
    }

    return paletteValue;
  };

  // Create a box to represent the foreground color against the color of the detail

  const getColorBox = ({ color, skin, colorType, foregroundColor }) => {
    const borderRadius = "50%";
    const display = "flex";
    const alignItems = "center";
    const border = `1px solid ${getPaletteValue(skin, "border", colorType)}`;
    const textColor = getPaletteValue(skin, foregroundColor, colorType);

    return (
      <div
        style={{
          borderRadius,
          display,
          alignItems,

          border,
        }}
      >
        <Circle size={32} backgroundColor={color}>
          <Text color={textColor}>Aa</Text>
        </Circle>
      </div>
    );
  };

  // Render the color table

  const renderColorTable = (skins, tokenKey) => {
    const getColorRow = (skin, colorType) => {
      const color = getPaletteValue(skin, tokenKey, colorType);
      console.log(color);
      return (
        <tr key={`${skin.name}-${colorType}`}>
          <td>{skin.name}</td>
          <td>
            <Tag type="success">
              {skin?.[colorType]?.[tokenKey]?.description}
            </Tag>
          </td>
          <td>
            <ColorCode color={color}></ColorCode>
          </td>
          <td>
            <Inline key={foregroundColor} space={8}>
              {getColorBox({
                color,
                skin,
                colorType,
                foregroundColor,
              })}
              <ContrastChecker
                contrastRatio={getContrastRatio(
                  color,
                  getPaletteValue(skin, foregroundColor, colorType)
                )}
              ></ContrastChecker>
            </Inline>
          </td>
        </tr>
      );
    };

    const lightRows = skins.map((skin) => getColorRow(skin, "light"));
    const darkRows = skins.map((skin) => getColorRow(skin, "dark"));

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
          <tbody>{lightRows}</tbody>
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
          <tbody>{darkRows}</tbody>
        </table>
      </Stack>
    );
  };

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Inline space="between" alignItems="center">
          <ButtonLink
            to={`/tokens-map/?branch=${branch}&skin=${selectedSkin}&tokenType=${tokenType}&activeColor=${selectedColor}`}
            aligned
          >
            <IconChevronLeftRegular color={skinVars.colors.textLink} />
            Go back
          </ButtonLink>
        </Inline>
      </Box>

      <div className={styles.tokenDetail}>
        <Stack space={40}>
          <Title2>{id}</Title2>
          <Stack space={24}>{<>{renderColorTable(skins, id)}</>}</Stack>
        </Stack>
      </div>
    </ResponsiveLayout>
  );
};

export default ColorDetail;
