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
  Table,
} from "@telefonica/mistica";

const RadiiTable = ({ skin, filter, branch, selectedSkin, tokenType }) => {
  const radius = skin?.radius || {};

  const radiusKeys = Object.keys(radius).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase()),
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

        {radiusKeys.length > 0 ? (
          <Table
            heading={["Example", "Token", "Value"]}
            content={radiusKeys.map((key) => {
              const value = radius[key]?.value;

              return [
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
                ></div>,
                <Touchable
                  to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${undefined}/${key}`}
                >
                  <Tag type="active">{key}</Tag>
                </Touchable>,
                <Text>{radiusValue(value)}</Text>,
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
};

export default RadiiTable;
