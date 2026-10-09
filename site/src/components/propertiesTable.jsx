import React from "react";
import {
  ResponsiveLayout,
  Box,
  Table,
  Tag,
  Text,
  Stack,
} from "@telefonica/mistica";

const PropertiesTable = ({ skin, filter }) => {
  if (!skin) return null;

  const themeVariant = skin?.themeVariant || {};
  const componentProperties = skin?.componentProperties || {};

  const allEntries = [
    ...Object.entries(themeVariant).map(([key, token]) => ({
      key,
      value: token.value,
      category: "Theme Variant",
    })),
    ...Object.entries(componentProperties).map(([key, token]) => ({
      key,
      value: token.value,
      category: "Component Property",
    })),
  ].filter(({ key }) =>
    key.toLowerCase().includes((filter || "").toLowerCase())
  );

  return (
    <ResponsiveLayout>
      <Box paddingBottom={24} />
      <Stack space={16}>
        {allEntries.length > 0 ? (
          <Table
            heading={["Token", "Value", "Category"]}
            content={allEntries.map(({ key, value, category }) => [
              <Tag type="active">{key}</Tag>,
              <Text>{value}</Text>,
              <Tag type="inactive">{category}</Tag>,
            ])}
            boxed
            responsive="collapse-rows"
          />
        ) : (
          <Box paddingTop={24}>
            <Text size={16}>No matching property tokens found.</Text>
          </Box>
        )}
      </Stack>
    </ResponsiveLayout>
  );
};

export default PropertiesTable;
