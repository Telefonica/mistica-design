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
} from "@telefonica/mistica";

const RadiiTable = ({ skin, filter, branch, selectedSkin, tokenType }) => {
  const radius = skin?.radius || {};

  const radiusKeys = Object.keys(radius).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <ResponsiveLayout>
      <Boxed>
        <Box padding={24} className={styles.palette}>
          {radiusKeys.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Token</th>
                  <th>Value</th>
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
                            borderRadius: value.endsWith("%")
                              ? value
                              : `${value}px`,
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
                          to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${key}`}
                        >
                          <Tag type="active">{key}</Tag>
                        </Touchable>
                      </td>
                      <td>{value.endsWith("%") ? value : `${value}px`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <Text size={16}>
              The <code>radius</code> tokens may not have been implemented in{" "}
              <code>{branch}</code>
            </Text>
          )}
        </Box>
      </Boxed>
    </ResponsiveLayout>
  );
};

export default RadiiTable;
