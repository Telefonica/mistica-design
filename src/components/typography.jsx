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

const TextTable = ({ skin, filter, branch, selectedSkin, tokenType }) => {
  const weight = skin?.text?.weight || {};
  const weightKeys = Object.keys(weight).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <ResponsiveLayout>
      <Stack space={16}>
        <div className={styles.palette}>
          <Inline space={8} alignItems="center">
            <Tag type="inactive">{`Constants (${
              Object.keys(weightKeys).length
            })`}</Tag>
          </Inline>
        </div>
        <Boxed>
          <Box paddingX={24} paddingBottom={24} className={styles.palette}>
            {weightKeys.length > 0 ? (
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
                  {weightKeys.map((key) => {
                    const value = weight[key]?.value;

                    return (
                      <tr key={key}>
                        <td>
                          <Text size={24} weight={value}>
                            Aa
                          </Text>
                        </td>
                        <td>
                          <Touchable
                            to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${key}`}
                          >
                            <Tag type="active">{key}</Tag>
                          </Touchable>
                        </td>
                        <td>{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <Box paddingTop={24}>
                <Text size={16}>Not matching text tokens found.</Text>
              </Box>
            )}
          </Box>
        </Boxed>
      </Stack>
    </ResponsiveLayout>
  );
};

export default TextTable;
