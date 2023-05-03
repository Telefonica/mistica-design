import React, { useState, useEffect } from "react";
import hexToRgbA from "../helpers/hexToRgba";
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
} from "@telefonica/mistica";
import styles from "./tokenDetail.module.css";

const ColorDetail = () => {
  const [skins, setSkins] = useState([]);
  const { id, tokenType, branch, selectedSkin, selectedColor } = useParams();

  const skinFiles = [
    { name: "Movistar", filename: "movistar.json" },
    { name: "Vivo", filename: "vivo.json" },
    { name: "O2", filename: "o2.json" },
    { name: "Blau", filename: "blau.json" },
    { name: "Telefónica", filename: "telefonica.json" },
    { name: "Solar 360", filename: "solar-360.json" },
  ];

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

  const renderColorTable = (skins, tokenKey) => {
    const getColorRow = (skin, colorType) => {
      const color = getPaletteValue(skin, tokenKey, colorType);
      const alphaText = color.includes("rgba") ? "hasAlpha" : "";
      return (
        <tr key={`${skin.name}-${colorType}`}>
          <td>{skin.name}</td>
          <td>
            <Tag type="success">
              {skin?.[colorType]?.[tokenKey]?.description}
            </Tag>
            <Tag type="warning">{alphaText}</Tag>
          </td>
          <td>{color}</td>
          <td style={{ backgroundColor: color }}>
            <Inline space={8}>
              <Text color={getPaletteValue(skin, "textPrimary", colorType)}>
                Aa
              </Text>
              <Text
                color={getPaletteValue(skin, "textPrimaryInverse", colorType)}
              >
                Aa
              </Text>
            </Inline>
          </td>
        </tr>
      );
    };

    const lightRows = skins.map((skin) => getColorRow(skin, "light"));
    const darkRows = skins.map((skin) => getColorRow(skin, "dark"));

    return (
      <Stack space={32}>
        <Title1>Light colors</Title1>
        <table>
          <thead>
            <tr>
              <th>Skin</th>
              <th>Palette Token</th>
              <th>Value</th>
              <th>Text Example</th>
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
              <th>Text Example</th>
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
