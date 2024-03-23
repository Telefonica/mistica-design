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
  Circle,
  Inline,
  Stack,
  IconWarningFilled,
  Tooltip,
} from "@telefonica/mistica";
import getColorValue from "../helpers/getColorValue";
import getPaletteKey from "../helpers/get-palette-key";
import ColorSample from "./colorSample";

const Palette = ({ skin, filter, branch, selectedSkin, tokenType }) => {
  const colors = skin?.light || {};
  const darkColors = skin?.dark || {};
  const palette = skin?.global?.palette || {};

  const colorKeys = Object.keys(colors).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase())
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
    palette
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

        <Boxed width={"100%"}>
          <Box paddingX={24} paddingBottom={24}>
            <div className={styles.palette}>
              {colorKeys.length > 0 ? (
                <table>
                  <thead
                    style={{
                      borderBottom: `1px solid ${skinVars.colors.divider}`,
                    }}
                  >
                    <tr>
                      <th>
                        <Text weight="medium">Token</Text>
                      </th>
                      <th>
                        <Text weight="medium">Light value</Text>
                      </th>
                      <th>
                        <Text weight="medium">Dark value</Text>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorKeys.map((key) => {
                      const lightInfo = getAllColorInfo(colors[key], "light");
                      const darkInfo = getAllColorInfo(darkColors[key], "dark");

                      return (
                        <tr
                          key={key}
                          style={{
                            background:
                              lightInfo.value === undefined ||
                              darkInfo.value === undefined
                                ? skinVars.colors.errorLow
                                : lightInfo.descriptionMatch &&
                                  darkInfo.descriptionMatch
                                ? undefined
                                : skinVars.colors.warningLow,
                          }}
                        >
                          {/* Column 1: Key */}
                          <td>
                            <Touchable
                              to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${key}/`}
                            >
                              <Tag type="active">{key}</Tag>
                            </Touchable>
                          </td>
                          {/* Column 2: Light */}
                          <td>
                            <ColorCell
                              value={lightInfo.value}
                              reference={lightInfo.reference}
                              descriptionMatch={lightInfo.descriptionMatch}
                              description={lightInfo.description}
                            />
                          </td>
                          {/* Column 4: Dark */}
                          <td>
                            <ColorCell
                              value={darkInfo.value}
                              reference={darkInfo.reference}
                              descriptionMatch={darkInfo.descriptionMatch}
                              description={darkInfo.description}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <Box paddingTop={24}>
                  <Text size={16}>No matching color tokens found.</Text>
                </Box>
              )}
            </div>
          </Box>
        </Boxed>
      </Stack>
    </ResponsiveLayout>
  );
};

export default Palette;
