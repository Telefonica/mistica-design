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

const TextTable = ({ skin, filter, branch, selectedSkin, tokenType }) => {
  const weight = skin?.text?.weight || {};
  const weightKeys = Object.keys(weight).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <ResponsiveLayout>
      <Boxed>
        <Box padding={24} className={styles.palette}>
          {weightKeys.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Token</th>
                  <th>Value</th>
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
            <Text size={16}>
              The <code>text.weight</code> tokens may not have been implemented
              in <code>{branch}</code>
            </Text>
          )}
        </Box>
      </Boxed>
    </ResponsiveLayout>
  );
};

export default TextTable;
