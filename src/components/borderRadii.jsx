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
} from "@telefonica/mistica";

const RadiiTable = ({ skin, filter, branch, selectedSkin, tokenType }) => {
  const radius = skin?.radius || {};

  const radiusKeys = Object.keys(radius).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase())
  );

  const radiusValue = (value) => {
    if (value.endsWith("%")) {
      return value;
    } else if (value.includes("circle")) {
      return "50%";
    } else {
      return `${value}px`;
    }
  };

  return (
    <ResponsiveLayout>
      <Stack space={16}>
        <div className={styles.palette}>
          <Inline space={8} alignItems="center">
            <Tag type="inactive">{`Constants (${
              Object.keys(radiusKeys).length
            })`}</Tag>
          </Inline>
        </div>
        <Boxed>
          <Box paddingX={24} paddingBottom={24} className={styles.palette}>
            {radiusKeys.length > 0 ? (
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
                  {radiusKeys.map((key) => {
                    const value = radius[key]?.value;

                    return (
                      <tr key={key}>
                        <td>
                          <div
                            style={{
                              borderRadius: radiusValue(value),
                              width: 48,
                              height: 48,
                              borderColor: skinVars.colors.brand,
                              borderWidth: 2,
                              borderStyle: "solid",
                              backgroundColor: skinVars.colors.brandLow,
                            }}
                          ></div>
                        </td>
                        <td>
                          <Touchable
                            to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${undefined}/${key}`}
                          >
                            <Tag type="active">{key}</Tag>
                          </Touchable>
                        </td>
                        <td>{radiusValue(value)}</td>
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
};

export default RadiiTable;
