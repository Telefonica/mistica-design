import React from "react";
import styles from "./borderRadii.module.css";
import hexToRgbA from "../helpers/hexToRgba";
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

const Palette = ({
  skin,
  filter,
  branch,
  selectedSkin,
  tokenType,
  selectedColor,
}) => {
  const colors = skin?.light || {};
  const darkColors = skin?.dark || {};
  const palette = skin?.global?.palette || {};

  const colorKeys = Object.keys(colors).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase())
  );

  // Get the palette key from the token value

  function getPaletteKey(value) {
    const match = value?.match(/\{palette\.([^\}]+)\}/);
    return match ? match[1] : null;
  }

  // Get the color value from the palette

  function getColorValue(color, palette) {
    if (color.type === "color") {
      const paletteKey = getPaletteKey(color.value);
      if (paletteKey) {
        return palette[paletteKey]?.value || undefined;
      } else {
        return color.value;
      }
    } else {
      return undefined;
    }
  }

  // Check if the palette reference matches the description

  function checkDescription(tokenValue, description) {
    const paletteName = getPaletteKey(tokenValue);
    return paletteName === description;
  }

  // Get the alpha value from a token value

  function getAlphaValue(tokenValue) {
    const match = tokenValue.match(/rgba?\(.*,\s*([\d.]+)\s*\)/);
    return match ? match[1] : "";
  }

  // Check if the color has alpha and convert the hex to rgba

  function applyAlpha(value, alphaValue) {
    return alphaValue < "0" ? value : hexToRgbA(value, alphaValue);
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

  return (
    <ResponsiveLayout>
      <Stack space={16}>
        <div className={styles.palette}>
          <Boxed width="100%">
            <Box padding={24}>
              <Inline space={16}>
                <Text>
                  Total constants:{" "}
                  <Text weight="medium">{Object.keys(colorKeys).length}</Text>
                </Text>
                <Text>
                  Total variables:{" "}
                  <Text weight="medium">{Object.keys(palette).length}</Text>
                </Text>
                <Text>
                  <Inline space={4} alignItems="center">
                    Unreferenced tokens:
                    <Text weight="medium">
                      <Circle
                        size={24}
                        backgroundColor={
                          totalUnreferencedCount !== 0
                            ? skinVars.colors.errorLow
                            : skinVars.colors.successLow
                        }
                      >
                        <Text
                          color={
                            totalUnreferencedCount !== 0
                              ? skinVars.colors.errorHigh
                              : skinVars.colors.successHigh
                          }
                        >
                          {totalUnreferencedCount}
                        </Text>
                      </Circle>
                    </Text>
                  </Inline>
                </Text>
                <Text>
                  <Inline space={4} alignItems="center">
                    Unmatched descriptions:
                    <Text weight="medium">
                      <Circle
                        size={24}
                        backgroundColor={
                          totalUnmatchedCount !== 0
                            ? skinVars.colors.errorLow
                            : skinVars.colors.successLow
                        }
                      >
                        <Text
                          color={
                            totalUnmatchedCount !== 0
                              ? skinVars.colors.errorHigh
                              : skinVars.colors.successHigh
                          }
                        >
                          {totalUnmatchedCount}
                        </Text>
                      </Circle>
                    </Text>
                  </Inline>
                </Text>
              </Inline>
            </Box>
          </Boxed>
        </div>
        <Boxed>
          <Box padding={24} className={styles.palette}>
            {colorKeys.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Light Value</th>
                    <th>Dark Value</th>
                  </tr>
                </thead>
                <tbody>
                  {colorKeys.map((key) => {
                    const color = colors[key];
                    const darkColor = darkColors[key];
                    const lightReference = getPaletteKey(color.value);
                    const darkReference = getPaletteKey(darkColor.value);
                    let value = getColorValue(color, palette);
                    let darkValue = getColorValue(darkColor, palette);

                    const alphaValue = color.value
                      ? getAlphaValue(color.value)
                      : "";
                    const darkAlphaValue = darkColor.value
                      ? getAlphaValue(darkColor.value)
                      : "";

                    const lightDescriptionMatch = checkDescription(
                      color.value,
                      color.description
                    );

                    const darkDescriptionMatch = checkDescription(
                      darkColor.value,
                      darkColor.description
                    );

                    return (
                      <tr key={key}>
                        <td>
                          <Touchable
                            to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${selectedColor}/${key}/`}
                          >
                            <Tag type="active">{key}</Tag>
                          </Touchable>
                        </td>
                        <td>
                          <table
                            style={{ textAlign: "left", width: "fit-content" }}
                          >
                            <tbody>
                              <tr>
                                <td>
                                  {value !== undefined ? (
                                    <div
                                      style={{
                                        outline: `1px solid ${
                                          lightReference ===
                                          ("white" || "grey1")
                                            ? skinVars.colors.neutralMedium
                                            : undefined
                                        }`,
                                        width: "fit-content",
                                        borderRadius: "50%",
                                      }}
                                    >
                                      <Circle
                                        size={16}
                                        backgroundColor={applyAlpha(
                                          value,
                                          alphaValue
                                        )}
                                      ></Circle>
                                    </div>
                                  ) : (
                                    "Ø"
                                  )}
                                </td>
                                <td>{applyAlpha(value, alphaValue)}</td>
                                <td>
                                  <Tag
                                    type={
                                      value === undefined ? "error" : "success"
                                    }
                                  >
                                    {lightReference}
                                  </Tag>
                                  {alphaValue < "0" ? (
                                    ""
                                  ) : (
                                    <Tag type="warning">hasAlpha</Tag>
                                  )}
                                  {lightDescriptionMatch ? undefined : (
                                    <Tooltip
                                      target={
                                        <IconWarningFilled
                                          color={skinVars.colors.error}
                                          size={16}
                                        />
                                      }
                                      description="Unmatched description"
                                    ></Tooltip>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td>
                          <table
                            style={{ textAlign: "left", width: "fit-content" }}
                          >
                            <tbody>
                              <tr>
                                <td>
                                  {darkValue !== undefined ? (
                                    <div
                                      style={{
                                        outline: `1px solid ${
                                          darkReference === ("white" || "grey1")
                                            ? skinVars.colors.neutralMedium
                                            : undefined
                                        }`,
                                        width: "fit-content",
                                        borderRadius: "50%",
                                      }}
                                    >
                                      <Circle
                                        size={16}
                                        backgroundColor={applyAlpha(
                                          darkValue,
                                          darkAlphaValue
                                        )}
                                      ></Circle>
                                    </div>
                                  ) : (
                                    "Ø"
                                  )}
                                </td>
                                <td>{applyAlpha(darkValue, darkAlphaValue)}</td>
                                <td>
                                  <Tag
                                    type={
                                      darkValue === undefined
                                        ? "error"
                                        : "success"
                                    }
                                  >
                                    {darkReference}
                                  </Tag>
                                  {darkAlphaValue < "0" ? (
                                    ""
                                  ) : (
                                    <Tag type="warning">hasAlpha</Tag>
                                  )}
                                  {darkDescriptionMatch ? undefined : (
                                    <Tooltip
                                      target={
                                        <IconWarningFilled
                                          color={skinVars.colors.error}
                                          size={16}
                                        />
                                      }
                                      description="Unmatched description"
                                    ></Tooltip>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <Text size={16}>No matching tokens</Text>
            )}
          </Box>
        </Boxed>
      </Stack>
    </ResponsiveLayout>
  );
};

export default Palette;
