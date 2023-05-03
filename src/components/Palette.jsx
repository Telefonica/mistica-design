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

  // Get the number of unrefered colors

  const count = colorKeys.reduce((acc, key) => {
    const color = colors[key];
    const darkColor = darkColors[key];
    const value =
      color.type === "color"
        ? palette[color.description]?.value || "---"
        : color.value || "---";
    const darkValue =
      darkColor.type === "color"
        ? palette[darkColor.description]?.value || "---"
        : darkColor.value || "---";

    if (value === "---" || darkValue === "---") {
      return acc + 1;
    }

    return acc;
  }, 0);

  // Check if the color has alpha and convert the hx to rgba

  function applyAlpha(value, alphaValue) {
    return alphaValue < "0" ? value : hexToRgbA(value, alphaValue);
  }

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
                  Unreferenced tokens: <Text weight="medium">{count}</Text>
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
                    const lightReference = colors[key]?.description || "";
                    const darkReference = darkColors[key]?.description || "";
                    const value =
                      color.type === "color"
                        ? palette[color.description]?.value || "---"
                        : color.value || "---";

                    const darkValue =
                      darkColor.type === "color"
                        ? palette[darkColor.description]?.value || "---"
                        : darkColor.value || "---";

                    const alphaValue = color.value
                      ? color.value.match(/rgba\(.*,\s*(.*)\)/)?.[1] || ""
                      : "";
                    const darkAlphaValue = darkColor.value
                      ? darkColor.value.match(/rgba\(.*,\s*(.*)\)/)?.[1] || ""
                      : "";

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
                                  <div
                                    style={{
                                      outline: `1px solid ${
                                        lightReference === ("white" || "grey1")
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
                                </td>
                                <td>{applyAlpha(value, alphaValue)}</td>
                                <td>
                                  <Tag
                                    type={value === "---" ? "error" : "success"}
                                  >
                                    {lightReference}
                                  </Tag>
                                  {alphaValue < "0" ? (
                                    ""
                                  ) : (
                                    <Tag type="warning">hasAlpha</Tag>
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
                                  <div
                                    style={{
                                      outline: `1px solid ${
                                        darkReference === "white"
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
                                </td>
                                <td>{applyAlpha(darkValue, darkAlphaValue)}</td>
                                <td>
                                  <Tag
                                    type={
                                      darkValue === "---" ? "error" : "success"
                                    }
                                  >
                                    {darkReference}
                                  </Tag>
                                  {darkAlphaValue < "0" ? (
                                    ""
                                  ) : (
                                    <Tag type="warning">hasAlpha</Tag>
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
