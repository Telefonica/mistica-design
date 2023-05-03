import { useState, useEffect } from "react";
import styles from "./palette.module.css";
import {
  Boxed,
  Text,
  Box,
  Tag,
  Touchable,
  Title1,
  Circle,
  skinVars,
  Inline,
  Stack,
  ResponsiveLayout,
} from "@telefonica/mistica";

function ReferencePalette({
  skin,
  selectedSkin,
  filter,
  branch,
  selectedColor,
  setSelectedColor,
  tokenType,
}) {
  const [selected, setSelected] = useState(selectedColor || undefined);

  const lightColors = skin?.light || {};
  const darkColors = skin?.dark || {};
  const palette = skin?.global?.palette || {};

  const matchingLightColors = Object.keys(lightColors).filter((key) => {
    const color = lightColors[key];
    const value =
      color.type === "color"
        ? palette[color.description]?.value || "fallback value"
        : color.value || "fallback value";
    return value === selected || value === palette[selectedColor]?.value;
  });
  const matchingDarkColors = Object.keys(darkColors).filter((key) => {
    const color = darkColors[key];
    const value =
      color.type === "color"
        ? palette[color.description]?.value || "fallback value"
        : color.value || "fallback value";
    return value === selected || value === palette[selectedColor]?.value;
  });

  const getMatchingCount = (value, colors = ["light", "dark"]) => {
    let matchingCount = 0;
    colors.forEach((colorType) => {
      const colorPalette = colorType === "light" ? lightColors : darkColors;
      Object.keys(colorPalette).forEach((key) => {
        const color = colorPalette[key];
        const colorValue =
          color.type === "color"
            ? (palette[color.description] &&
                palette[color.description].value) ||
              undefined
            : color.value || undefined;
        if (colorValue === value) {
          matchingCount++;
        }
      });
    });
    return matchingCount;
  };

  const handleClick = (value, key) => {
    setSelected(value);
    setSelectedColor(key);
  };

  const filteredPaletteKeys = Object.keys(palette).filter((key) =>
    key.toLowerCase().includes(filter.toLowerCase())
  );

  const unusedColors = Object.keys(palette).filter((key) => {
    const color = palette[key];
    if (color.type !== "color") return false;

    const value = color.value;
    const matchingCount = getMatchingCount(value);

    return matchingCount === 0;
  }).length;

  let totalMatchingCount = 0;
  filteredPaletteKeys.forEach((key) => {
    const color = palette[key];
    if (color.type !== "color") return null;
    const value = color.value;
    const matchingCount = getMatchingCount(value);
    totalMatchingCount += matchingCount;
  });

  return (
    <ResponsiveLayout>
      <Stack space={16}>
        <div className={styles.palette}>
          <Boxed width="100%">
            <Box padding={24}>
              <Inline space={16}>
                <Text>
                  Total variables:{" "}
                  <Text weight="medium">{Object.keys(palette).length}</Text>
                </Text>
                <Text>
                  Unused variables: <Text weight="medium">{unusedColors}</Text>
                </Text>
                <Text>
                  Constants referenced:{" "}
                  <Text weight="medium">{totalMatchingCount}</Text> (No. of
                  constants x2)
                </Text>
              </Inline>
            </Box>
          </Boxed>
        </div>
        <div className={styles.palette}>
          <Boxed width="100%">
            <Box padding={24}>
              <div className={styles.tableContainer}>
                <Title1>Palette</Title1>

                <table>
                  <thead>
                    <tr>
                      <th></th>

                      <th>Description</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPaletteKeys.map((key) => {
                      const color = palette[key];
                      if (color.type !== "color") return null;

                      const value = color.value;
                      const isSelected =
                        value === selected || key === selectedColor;
                      const matchingCount = getMatchingCount(value);

                      return (
                        <tr
                          style={{
                            outline: isSelected ? "2px solid" : undefined,
                            outlineColor: isSelected
                              ? skinVars.colors.brand
                              : undefined,
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          key={key}
                          onClick={() => handleClick(value, key)}
                        >
                          <td>
                            <div
                              style={{
                                outline: `1px solid ${
                                  key === "white"
                                    ? skinVars.colors.neutralMedium
                                    : undefined
                                }`,
                                width: "fit-content",
                                borderRadius: "50%",
                              }}
                            >
                              <Circle
                                size={16}
                                backgroundColor={value}
                              ></Circle>
                            </div>
                          </td>
                          <td>
                            <Tag type="success">{key}</Tag>
                          </td>
                          <td>
                            {matchingCount != 0 ? (
                              <Circle
                                size={24}
                                backgroundColor={skinVars.colors.successLow}
                              >
                                <Text size={14} weight="medium">
                                  {matchingCount}
                                </Text>
                              </Circle>
                            ) : (
                              <Circle
                                size={24}
                                backgroundColor={skinVars.colors.error}
                              >
                                <Text
                                  size={14}
                                  weight="medium"
                                  color={skinVars.colors.textPrimaryInverse}
                                >
                                  {matchingCount}
                                </Text>
                              </Circle>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Box>
          </Boxed>
          <Boxed width="100%">
            <Box padding={24}>
              <div className={styles.tableContainer}>
                <Title1>Light Colors</Title1>
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchingLightColors.length === 0 ? (
                      <tr>
                        <td colSpan={2}>No matching light colors</td>
                      </tr>
                    ) : (
                      matchingLightColors.map((key) => {
                        return (
                          <tr key={key}>
                            <td>
                              <Touchable
                                to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${selectedColor}/${key}/`}
                              >
                                <Tag type="active">{key}</Tag>
                              </Touchable>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Box>
          </Boxed>
          <Boxed width="100%">
            <Box padding={24}>
              <div className={styles.tableContainer}>
                <Title1>Dark Colors</Title1>
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchingDarkColors.length === 0 ? (
                      <tr>
                        <td colSpan={2}>No matching dark colors</td>
                      </tr>
                    ) : (
                      matchingDarkColors.map((key) => {
                        return (
                          <tr key={key}>
                            <td>
                              <Touchable
                                to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${selectedColor}/${key}`}
                              >
                                <Tag type="active">{key}</Tag>
                              </Touchable>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Box>
          </Boxed>
        </div>
      </Stack>
    </ResponsiveLayout>
  );
}

export default ReferencePalette;
