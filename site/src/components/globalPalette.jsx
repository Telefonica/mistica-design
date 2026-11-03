import React from "react";
import styles from "./palette.module.css";
import {
  Boxed,
  Text,
  Box,
  Tag,
  Circle,
  Inline,
  Stack,
  ResponsiveLayout,
  Table,
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
    key.toLowerCase().includes(filter?.toLowerCase()),
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

        {colorKeys.length > 0 ? (
          <Table
            heading={["Example", "Token", "Value"]}
            content={colorKeys.map((key) => {
              const value = palette[key]?.value;

              return [
                <Circle backgroundColor={value} size={32} />,
                <Tag type="success">{key}</Tag>,
                <Text>{value}</Text>,
              ];
            })}
            boxed
            responsive="collapse-rows"
          />
        ) : (
          <Box paddingTop={24}>
            <Text size={16}>Not matching radius tokens found.</Text>
          </Box>
        )}
      </Stack>
    </ResponsiveLayout>
  );
}

export default GlobalPalette;
