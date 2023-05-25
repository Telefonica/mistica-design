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

function GlobalPalette({
  skin,
  selectedSkin,
  filter,
  branch,
  selectedColor,
  setSelectedColor,
  tokenType,
}) {
  const palette = skin?.global?.palette || {};

  const colorKeys = Object.keys(palette).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <ResponsiveLayout>
      <Stack space={16}>
        <div className={styles.palette}>
          <Inline space={8} alignItems="center">
            <Tag type="inactive">{`Variables (${
              Object.keys(colorKeys).length
            })`}</Tag>
          </Inline>
        </div>
        <Boxed>
          <Box paddingX={24} paddingBottom={24} className={styles.palette}>
            {colorKeys.length > 0 ? (
              <table>
                <thead
                  style={{
                    borderBottom: `1px solid ${skinVars.colors.divider}`,
                  }}
                >
                  <tr>
                    <th>
                      <Text weight="medium">Example</Text>
                    </th>
                    <th>
                      <Text weight="medium">Token</Text>
                    </th>
                    <th>
                      <Text weight="medium">Value</Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colorKeys.map((key) => {
                    const value = palette[key]?.value;

                    return (
                      <tr key={key}>
                        <td>
                          <Circle backgroundColor={value} size={32}></Circle>
                        </td>
                        <td>
                          <Tag type="success">{key}</Tag>
                        </td>
                        <td>{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <Box paddingTop={24}>
                <Text size={16}>Not matching radius tokens found.</Text>
              </Box>
            )}
          </Box>
        </Boxed>
      </Stack>
    </ResponsiveLayout>
  );
}

export default GlobalPalette;
