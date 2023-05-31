import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ButtonLink,
  Circle,
  ResponsiveLayout,
  Stack,
  Title2,
  Tag,
  Title1,
  skinVars,
  TextField,
  ButtonPrimary,
  Inline,
  Box,
  Text,
  IconChevronLeftRegular,
} from "@telefonica/mistica";
import styles from "./tokenDetail.module.css";

const TokenDetail = () => {
  const [skins, setSkins] = useState([]);
  const { id, tokenType, branch, selectedSkin } = useParams();

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
    const paletteKey = skin?.[type]?.[tokenKey]?.description;
    return paletteKey ? skin?.global?.palette?.[paletteKey]?.value : "";
  };

  const getRadiusValue = (skin, tokenKey) => {
    return skin?.radius?.[tokenKey]?.value || "";
  };

  const tranformRadiusValue = (value) => {
    if (value.endsWith("%")) {
      return value;
    } else if (value.includes("circle")) {
      return "50%";
    } else {
      return `${value}px`;
    }
  };

  const getWeightValue = (skin, tokenKey) => {
    return skin?.text?.weight?.[tokenKey]?.value || "";
  };

  const renderRadiusTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Skin</th>
            <th>Value</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {skins.map((skin, index) => {
            const value = getRadiusValue(skin, id);
            return (
              <tr key={index}>
                <td>{skin.name}</td>
                <td>
                  <Tag type="active">{tranformRadiusValue(value)}</Tag>
                </td>
                <td>
                  <div
                    style={{
                      borderRadius: tranformRadiusValue(value),
                      width: 48,
                      height: 48,
                      borderColor: skinVars.colors.brand,
                      borderWidth: 2,
                      borderStyle: "solid",
                      backgroundColor: skinVars.colors.brandLow,
                    }}
                  ></div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderWeightTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Skin</th>
            <th>Value</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {skins.map((skin, index) => {
            const value = getWeightValue(skin, id);
            return (
              <tr key={index}>
                <td>{skin.name}</td>
                <td>
                  <Tag type="active">{value}</Tag>
                </td>
                <td>
                  <Text size={24} weight={value}>
                    Aa
                  </Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderDoubleTable = (skins, tokenKey) => {
    const lightRows = skins.map((skin) => (
      <tr key={`${skin.name}-light`}>
        <td>{skin.name}</td>
        <td>
          <Tag type="active">{skin?.light?.[tokenKey]?.description}</Tag>
        </td>
        <td>{getPaletteValue(skin, tokenKey, "light")}</td>
        <td
          style={{ backgroundColor: getPaletteValue(skin, tokenKey, "light") }}
        >
          <Inline space={8}>
            <Text color={getPaletteValue(skin, "textPrimary", "light")}>
              Aa
            </Text>
            <Text color={getPaletteValue(skin, "textPrimaryInverse", "light")}>
              Aa
            </Text>
          </Inline>
        </td>
      </tr>
    ));
    const darkRows = skins.map((skin) => (
      <tr key={`${skin.name}-dark`}>
        <td>{skin.name}</td>
        <td>
          <Tag type="active">{skin?.dark?.[tokenKey]?.description}</Tag>
        </td>
        <td>{getPaletteValue(skin, tokenKey, "dark")}</td>
        <td
          style={{ backgroundColor: getPaletteValue(skin, tokenKey, "dark") }}
        >
          <Inline space={8}>
            <Text color={getPaletteValue(skin, "textPrimary", "dark")}>Aa</Text>
            <Text color={getPaletteValue(skin, "textPrimaryInverse", "dark")}>
              Aa
            </Text>
          </Inline>
        </td>
      </tr>
    ));

    return (
      <Stack space={24}>
        <Title1>Light values</Title1>
        <table>
          <thead>
            <tr>
              <th>Skin</th>
              <th>Palette token</th>
              <th>Value</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>{lightRows}</tbody>
        </table>
        <Title1>Dark values</Title1>
        <table>
          <thead>
            <tr>
              <th>Skin</th>
              <th>Palette token</th>
              <th>Value</th>
              <th>Example</th>
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
            to={`/tokens-map/?branch=${branch}&skin=${selectedSkin}&tokenType=${tokenType}`}
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
          <Stack space={24}>
            {tokenType === "color" && <>{renderDoubleTable(skins, id)}</>}
            {tokenType === "radius" && <>{renderRadiusTable(skins, id)}</>}
            {tokenType === "text" && <>{renderWeightTable(skins, id)}</>}
          </Stack>
        </Stack>
      </div>
    </ResponsiveLayout>
  );
};

export default TokenDetail;