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
  Checkbox,
  Text2,
} from "@telefonica/mistica";
import { useState } from "react";

const Palette = ({
  skin,
  filter,
  branch,
  selectedSkin,
  tokenType,
  selectedColor,
}) => {
  const [showProminent, setShowProminent] = useState(false);

  const colors = skin?.light || {};
  const darkColors = skin?.dark || {};
  const palette = skin?.global?.palette || {};
  const prominentColors = skin?.prominent || {};
  const extendedLight = skin?.light?.extended || {};
  const extendedDark = skin?.dark?.extended || {};

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

  // Get the extended color value from the skin

  function getExtendedColorValue(skin, color, extended) {
    const extendedColor = extended?.[color.extended];
    if (extendedColor) {
      const paletteKey = getPaletteKey(extendedColor.value);
      if (paletteKey) {
        return palette[paletteKey]?.value || undefined;
      } else {
        return extendedColor.value;
      }
    }
  }

  function getProminentColorValue(prominentColor, palette) {
    if (prominentColor && Object.keys(prominentColor).length > 0) {
      if (prominentColor) {
        const paletteKey = getPaletteKey(prominentColor.value);
        if (paletteKey) {
          return palette[paletteKey]?.value || undefined;
        } else {
          return prominentColor.value;
        }
      }
    }

    // Return undefined when prominentColors is not defined or empty
    return undefined;
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
    if (!alphaValue || alphaValue === "") {
      return value;
    }

    const numericAlphaValue = parseFloat(alphaValue);
    return numericAlphaValue < 0 ? value : hexToRgbA(value, alphaValue);
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

            {prominentColors && Object.keys(prominentColors).length > 0 && (
              <Inline space={8}>
                <Checkbox
                  onChange={() => setShowProminent(!showProminent)}
                  value={showProminent}
                />
                <Text2>Show prominent values</Text2>
              </Inline>
            )}
          </Inline>
        </div>
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
                      {!showProminent &&
                        prominentColors &&
                        Object.keys(prominentColors).length > 0 && (
                          <th>
                            <Text weight="medium">Prominent value</Text>
                          </th>
                        )}

                      <th>
                        <Text weight="medium">Dark value</Text>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorKeys.map((key) => {
                      const color = colors[key];
                      const darkColor = darkColors[key];
                      const extendedLightColor = extendedLight[key];
                      const extendedDarkColor = extendedDark[key];
                      const prominentColor = prominentColors[key];

                      const lightReference = getPaletteKey(color.value);
                      const darkReference = getPaletteKey(darkColor.value);
                      const prominentReference = getPaletteKey(
                        prominentColor?.value
                      );

                      let value = getColorValue(color, palette);
                      let darkValue = getColorValue(darkColor, palette);
                      let extendedLightValue = getExtendedColorValue(
                        extendedLightColor,
                        palette
                      );
                      let extendedDarkValue = getExtendedColorValue(
                        extendedDarkColor,
                        palette
                      );
                      let prominentValue = getProminentColorValue(
                        prominentColor,
                        palette
                      );

                      const alphaValue = color.value
                        ? getAlphaValue(color.value)
                        : "";
                      const darkAlphaValue = darkColor.value
                        ? getAlphaValue(darkColor.value)
                        : "";
                      const prominentAlphaValue = prominentColor?.value
                        ? getAlphaValue(prominentColor.value ?? "")
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
                        <tr
                          key={key}
                          style={{
                            background:
                              value === undefined || darkValue === undefined
                                ? skinVars.colors.errorLow
                                : lightDescriptionMatch && darkDescriptionMatch
                                ? undefined
                                : skinVars.colors.warningLow,
                          }}
                        >
                          <td>
                            <Touchable
                              to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${selectedColor}/${key}/`}
                            >
                              <Tag type="active">{key}</Tag>
                            </Touchable>
                          </td>
                          <td>
                            <table
                              style={{
                                textAlign: "left",
                                width: "fit-content",
                              }}
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
                                      <Tag type="error">Undefined</Tag>
                                    )}
                                  </td>
                                  <td>{applyAlpha(value, alphaValue)}</td>
                                  <td>
                                    <Tag
                                      type={
                                        value === undefined
                                          ? "error"
                                          : "success"
                                      }
                                    >
                                      {lightReference}
                                    </Tag>
                                    {value != undefined ? undefined : (
                                      <Tooltip
                                        target={
                                          <IconWarningFilled
                                            color={skinVars.colors.error}
                                            size={16}
                                          />
                                        }
                                        description={`The value of this color references an unexistent or wrong palette token (${color.description})`}
                                      ></Tooltip>
                                    )}
                                    {lightDescriptionMatch ? undefined : (
                                      <Tooltip
                                        target={
                                          <IconWarningFilled
                                            color={skinVars.colors.warning}
                                            size={16}
                                          />
                                        }
                                        description={`Token description doesn't match (${color.description})`}
                                      ></Tooltip>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          {!showProminent &&
                            prominentColors &&
                            Object.keys(prominentColors).length > 0 && (
                              <td>
                                <table
                                  style={{
                                    textAlign: "left",
                                    width: "fit-content",
                                  }}
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        {prominentValue !== undefined ? (
                                          <div
                                            style={{
                                              outline: `1px solid ${
                                                prominentReference ===
                                                ("white" || "grey1")
                                                  ? skinVars.colors
                                                      .neutralMedium
                                                  : undefined
                                              }`,
                                              width: "fit-content",
                                              borderRadius: "50%",
                                            }}
                                          >
                                            <Circle
                                              size={16}
                                              backgroundColor={applyAlpha(
                                                prominentValue,
                                                prominentAlphaValue
                                              )}
                                            ></Circle>
                                          </div>
                                        ) : (
                                          <Tag type="error">Undefined</Tag>
                                        )}
                                      </td>
                                      <td>
                                        {applyAlpha(
                                          prominentValue,
                                          prominentAlphaValue
                                        )}
                                      </td>
                                      <td>
                                        <Tag
                                          type={
                                            prominentValue === undefined
                                              ? "error"
                                              : "success"
                                          }
                                        >
                                          {prominentReference}
                                        </Tag>
                                        {prominentValue !=
                                        undefined ? undefined : (
                                          <Tooltip
                                            target={
                                              <IconWarningFilled
                                                color={skinVars.colors.error}
                                                size={16}
                                              />
                                            }
                                            description={`The value of this color references an unexistent or wrong palette token (${color.description})`}
                                          ></Tooltip>
                                        )}
                                        {lightDescriptionMatch ? undefined : (
                                          <Tooltip
                                            target={
                                              <IconWarningFilled
                                                color={skinVars.colors.warning}
                                                size={16}
                                              />
                                            }
                                            description={`Token description doesn't match (${color.description})`}
                                          ></Tooltip>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            )}
                          <td>
                            <table
                              style={{
                                textAlign: "left",
                                width: "fit-content",
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    {darkValue !== undefined ? (
                                      <div
                                        style={{
                                          outline: `1px solid ${
                                            darkReference ===
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
                                            darkValue,
                                            darkAlphaValue
                                          )}
                                        ></Circle>
                                      </div>
                                    ) : (
                                      <Tag type="error">Undefined</Tag>
                                    )}
                                  </td>
                                  <td>
                                    {applyAlpha(darkValue, darkAlphaValue)}
                                  </td>
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
                                    {darkValue != undefined ? undefined : (
                                      <Tooltip
                                        target={
                                          <IconWarningFilled
                                            color={skinVars.colors.error}
                                            size={16}
                                          />
                                        }
                                        description={`The value of this color references an unexistent or wrong palette token (${color.description})`}
                                      ></Tooltip>
                                    )}
                                    {darkDescriptionMatch ? undefined : (
                                      <Tooltip
                                        target={
                                          <IconWarningFilled
                                            color={skinVars.colors.warning}
                                            size={16}
                                          />
                                        }
                                        description={`Token description doesn't match (${darkColor.description})`}
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
