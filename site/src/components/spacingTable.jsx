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
  RadioGroup,
  RadioButton,
  Chip,
  Table,
} from "@telefonica/mistica";

const SpacingTable = ({
  skin,
  filter,
  branch,
  selectedSkin,
  tokenType,
  selectedBranch,
  selectedColor,
}) => {
  if (!skin || !skin.spacing) {
    // Show a loading/fallback state if spacing is not available yet
    return (
      <ResponsiveLayout>
        <Box padding={24}>
          <Text>Loading spacing tokens...</Text>
        </Box>
      </ResponsiveLayout>
    );
  }
  const spacing = skin?.spacing;

  const spacingKeys = Object.keys(spacing).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase()),
  );

  // Filter tokens

  return (
    <ResponsiveLayout>
      <Box paddingBottom={24}></Box>
      <Stack space={16}>
        <Table
          heading={[
            "Example",
            "Token",
            "Top value",
            "Bottom value",
            "Left value",
            "Right value",
          ]}
          content={spacingKeys.map((key) => {
            const value = spacing[key]?.value;
            const sides = ["top", "bottom", "left", "right"];

            return [
              <div
                style={{
                  width: 50,
                  height: 50,
                  position: "relative",
                  backgroundColor: skinVars.colors.background,
                  border: `1px solid ${skinVars.colors.divider}`,
                  boxSizing: "border-box",
                }}
              >
                {value.top && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: `${value.top.desktop / 4}px`,
                      backgroundColor: skinVars.colors.brandLow,
                    }}
                  />
                )}
                {value.bottom && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${value.bottom.desktop / 4}px`,
                      backgroundColor: skinVars.colors.brandLow,
                    }}
                  />
                )}
                {value.left && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: `${value.left.desktop / 4}px`,
                      backgroundColor: skinVars.colors.brandLow,
                    }}
                  />
                )}
                {value.right && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      right: 0,
                      width: `${value.right.desktop / 4}px`,
                      backgroundColor: skinVars.colors.brandLow,
                    }}
                  />
                )}
              </div>,
              <Touchable
                to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${undefined}/${key}`}
              >
                <Tag type="active">{key}</Tag>
              </Touchable>,
              ...sides.map((side) => (
                <Stack space={4}>
                  <Text>{`M: ${value[side]?.mobile || 0}px`}</Text>
                  <Text>{`D: ${value[side]?.desktop || 0}px`}</Text>
                </Stack>
              )),
            ];
          })}
          boxed
          responsive="collapse-rows"
        />
      </Stack>
    </ResponsiveLayout>
  );
};

export default SpacingTable;
