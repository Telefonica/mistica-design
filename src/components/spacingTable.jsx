import React from "react";
import { useEffect } from "react";
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
    key.toLowerCase().includes(filter?.toLowerCase())
  );

  // Filter tokens

  return (
    <ResponsiveLayout>
      <Box paddingBottom={24}></Box>
      <Stack space={16}>
        <Boxed>
          <Box paddingX={24} paddingBottom={24} className={styles.palette}>
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
                    <Text weight="medium">Top value</Text>
                  </th>
                  <th>
                    <Text weight="medium">Bottom value</Text>
                  </th>
                  <th>
                    <Text weight="medium">Left value</Text>
                  </th>
                  <th>
                    <Text weight="medium">Right value</Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {spacingKeys.map((key) => {
                  const value = spacing[key]?.value;

                  // Default sides
                  const sides = ["top", "bottom", "left", "right"];

                  return (
                    <tr key={key}>
                      {/* Example box with desktop padding */}
                      <td>
                        <div
                          style={{
                            width: 50, // base width
                            height: 50, // base height
                            position: "relative",
                            backgroundColor: skinVars.colors.background,
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                          }}
                        >
                          {/* Top padding */}
                          {value.top && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: `${value.top.desktop / 4}px`,
                                backgroundColor: "rgba(255,0,0,0.5)",
                              }}
                            />
                          )}

                          {/* Bottom padding */}
                          {value.bottom && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: `${value.bottom.desktop / 4}px`,
                                backgroundColor: "rgba(255,0,0,0.5)",
                              }}
                            />
                          )}

                          {/* Left padding */}
                          {value.left && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 0,
                                width: `${value.left.desktop / 4}px`,
                                backgroundColor: "rgba(255,0,0,0.5)",
                              }}
                            />
                          )}

                          {/* Right padding */}
                          {value.right && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                right: 0,
                                width: `${value.right.desktop / 4}px`,
                                backgroundColor: "rgba(255,0,0,0.5)",
                              }}
                            />
                          )}

                          {/* Center label */}
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              fontSize: 8,
                              textAlign: "center",
                            }}
                          ></div>
                        </div>
                      </td>

                      {/* Token name / link */}
                      <td>
                        <Touchable
                          to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${undefined}/${key}`}
                        >
                          <Tag type="active">{key}</Tag>
                        </Touchable>
                      </td>

                      {/* Padding values for each side */}
                      {sides.map((side) => (
                        <td key={side}>
                          <Stack space={4}>
                            <Text>{`M: ${value[side]?.mobile || 0}px`}</Text>
                            <Text>{`D: ${value[side]?.desktop || 0}px`}</Text>
                          </Stack>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Boxed>
      </Stack>
    </ResponsiveLayout>
  );
};

export default SpacingTable;
