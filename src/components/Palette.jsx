import React from "react";
import styles from "./borderRadii.module.css";
import {
  skinVars,
  ResponsiveLayout,
  Tag,
  Boxed,
  Box,
  Touchable,
  Text,
  Inline,
  Stack,
  IconWarningFilled,
  Tooltip,
  Table,
} from "@telefonica/mistica";
import getColorValue from "../helpers/getColorValue";
import getPaletteKey from "../helpers/get-palette-key";
import ColorSample from "./colorSample";

const Palette = ({ skin, filter, branch, selectedSkin, tokenType }) => {
  const colors = skin?.light || {};
  const darkColors = skin?.dark || {};
  const palette = skin?.global?.palette || {};

  const colorKeys = Object.keys(colors).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase()),
  );

  // Check if the palette reference matches the description

  function checkDescription(tokenValue, description) {
    if (description === undefined || description === null) {
      return undefined;
    }

    const paletteName = getPaletteKey(tokenValue);
    return paletteName === description;
  }

  function getAllColorInfo(color, scheme) {
    const value = getColorValue(color, palette);

    const descriptionMatch = checkDescription(color?.value, color.description);
    const reference = getPaletteKey(color?.value);

    return {
      value,
      descriptionMatch,
      description: color?.description,
      reference,
    };
  }
  // Get the number of unrefered colors

  function countUnreferencedColors(colors, darkColors, palette) {
    const colorKeys = Object.keys(colors);
    const unreferencedCount = colorKeys.reduce((acc, key) => {
      const color = colors[key];
      const darkColor = darkColors[key];
      const value = getColorValue(color, palette);
      const darkValue = getColorValue(darkColor, palette);

      if (value === undefined || darkValue === undefined) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return unreferencedCount;
  }

  const totalUnreferencedCount = countUnreferencedColors(
    colors,
    darkColors,
    palette,
  );

  // Obtain the number of unmatched descriptions

  function countUnmatchedColors(colors) {
    let unmatchedCount = 0;

    for (let key in colors) {
      const color = colors[key];
      const descriptionMatch = checkDescription(color.value, color.description);

      if (!descriptionMatch) {
        unmatchedCount++;
      }
    }

    return unmatchedCount;
  }

  const lightUnmatchedCount = countUnmatchedColors(colors);
  const darkUnmatchedCount = countUnmatchedColors(darkColors);
  const totalUnmatchedCount = lightUnmatchedCount + darkUnmatchedCount;

  const ColorCell = ({ value, reference, descriptionMatch, description }) => {
    return (
      <>
        <ColorSample color={value} palette={reference} />
        <div>
          <Tag type={value === undefined ? "error" : "success"}>
            {reference}
          </Tag>
          {value !== undefined ? undefined : (
            <Tooltip
              target={
                <IconWarningFilled color={skinVars.colors.error} size={16} />
              }
              description={`The value of this color references an unexistent or wrong palette token (${description})`}
            ></Tooltip>
          )}
          {descriptionMatch ? undefined : (
            <Tooltip
              target={
                <IconWarningFilled color={skinVars.colors.warning} size={16} />
              }
              description={`Token description doesn't match (${description})`}
            ></Tooltip>
          )}
        </div>
      </>
    );
  };

  return (
    <ResponsiveLayout>
      <Stack space={16}>
        <Inline space="between" fullWidth>
          <Inline space={8} alignItems="center">
            <Tag type="inactive">{`Constants (${
              Object.keys(colorKeys).length
            })`}</Tag>

            {totalUnreferencedCount !== 0 ? (
              <Tag type="error">{`Undefined palette values (${totalUnreferencedCount})`}</Tag>
            ) : null}
            {totalUnmatchedCount !== 0 ? (
              <Tag type="warning">{`Not matching descriptions (${totalUnmatchedCount})`}</Tag>
            ) : null}
          </Inline>
        </Inline>

        {colorKeys.length > 0 ? (
          <Table
            responsive="collapse-rows"
            heading={["Token", "Light value", "Dark value"]}
            content={colorKeys.map((key) => {
              const lightInfo = getAllColorInfo(colors[key], "light");
              const darkInfo = getAllColorInfo(darkColors[key], "dark");

              const rowBackground =
                lightInfo.value === undefined || darkInfo.value === undefined
                  ? skinVars.colors.errorLow
                  : lightInfo.descriptionMatch && darkInfo.descriptionMatch
                    ? undefined
                    : skinVars.colors.warningLow;

              const withStateBackground = (content) =>
                rowBackground ? (
                  <div style={{ backgroundColor: rowBackground, padding: 8 }}>
                    {content}
                  </div>
                ) : (
                  content
                );

              return [
                withStateBackground(
                  <Touchable
                    to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${key}/`}
                  >
                    <Tag type="active">{key}</Tag>
                  </Touchable>,
                ),
                withStateBackground(
                  <ColorCell
                    value={lightInfo.value}
                    reference={lightInfo.reference}
                    descriptionMatch={lightInfo.descriptionMatch}
                    description={lightInfo.description}
                  />,
                ),
                withStateBackground(
                  <ColorCell
                    value={darkInfo.value}
                    reference={darkInfo.reference}
                    descriptionMatch={darkInfo.descriptionMatch}
                    description={darkInfo.description}
                  />,
                ),
              ];
            })}
            boxed
          />
        ) : (
          <Boxed width={"100%"}>
            <Box padding={24}>
              <Text size={16}>No matching color tokens found.</Text>
            </Box>
          </Boxed>
        )}
      </Stack>
    </ResponsiveLayout>
  );
};

export default Palette;
