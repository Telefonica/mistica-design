import React, { useState } from "react";
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
import { getSpacingData } from "../helpers/getTokenData";
import { DENSITIES } from "../helpers/density";

const SpacingTable = ({
  skin,
  filter,
  branch,
  selectedSkin,
  tokenType,
  selectedBranch,
  selectedColor,
}) => {
  const [density, setDensity] = useState("cozy");

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
  const tokens = getSpacingData(
    { [selectedSkin]: skin },
    undefined,
    density
  ).filter(({ tokenName }) =>
    tokenName.toLowerCase().includes(filter?.toLowerCase())
  );
  const showDensity = getSpacingData({ [selectedSkin]: skin }).some(
    (token) => token.hasDensity
  );

  return (
    <ResponsiveLayout>
      <Box paddingBottom={24}></Box>
      <Stack space={16}>
        {showDensity && (
          <RadioGroup
            onChange={setDensity}
            name="density-group"
            value={density}
          >
            <Inline space={8}>
              {Object.entries(DENSITIES).map(([key, label]) => (
                <RadioButton
                  key={key}
                  value={key}
                  render={({ checked, labelId }) => (
                    <Chip active={checked} id={labelId}>
                      {label}
                    </Chip>
                  )}
                />
              ))}
            </Inline>
          </RadioGroup>
        )}
        <Table
          heading={[
            "Example",
            "Token",
            "Top value",
            "Bottom value",
            "Left value",
            "Right value",
          ]}
          content={tokens.map(({ tokenName: key, tokenValue: value }) => {
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
                {
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
                }
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
