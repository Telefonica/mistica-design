import React from "react";
import styles from "./borderRadii.module.css";
import {
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

const TextTable = ({
  skin,
  filter,
  branch,
  selectedSkin,
  tokenType,
  selectedBranch,
  selectedColor,
}) => {
  const weight = skin?.text?.weight || {};
  const size = skin?.text?.size || {};
  const lineHeight = skin?.text?.lineHeight || {};

  const [active, setActive] = React.useState("size");

  const weightKeys = Object.keys(weight).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase()),
  );

  const sizeKeys = Object.keys(size).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase()),
  );

  const lineHeightKeys = Object.keys(lineHeight).filter((key) =>
    key.toLowerCase().includes(filter?.toLowerCase()),
  );

  // Filter tokens

  return (
    <ResponsiveLayout>
      <Box paddingBottom={24}>
        <RadioGroup onChange={setActive} name="chip-group" value={active}>
          <Inline space={8}>
            <RadioButton
              value="size"
              render={({ checked, labelId }) => (
                <Chip active={checked} id={labelId}>
                  Font size
                </Chip>
              )}
            />
            <RadioButton
              value="weight"
              render={({ checked, labelId }) => (
                <Chip active={checked} id={labelId}>
                  Font weight
                </Chip>
              )}
            />
            <RadioButton
              value="lineHeight"
              render={({ checked, labelId }) => (
                <Chip active={checked} id={labelId}>
                  Line height
                </Chip>
              )}
            />
          </Inline>
        </RadioGroup>
      </Box>
      <Stack space={16}>
        <div className={styles.palette}>
          <Inline space={8} alignItems="center">
            <Tag type="inactive">{`Constants (${
              (active === "weight" && Object.keys(weightKeys).length) ||
              (active === "size" && Object.keys(sizeKeys).length) ||
              (active === "lineHeight" && Object.keys(lineHeightKeys).length)
            })`}</Tag>
          </Inline>
        </div>

        <Table
          heading={
            active === "size" || active === "lineHeight"
              ? ["Example", "Token", "Mobile value", "Desktop value"]
              : ["Example", "Token", "Value"]
          }
          content={
            active === "size"
              ? sizeKeys.map((key) => {
                  const mobileValue = size[key]?.value?.mobile;
                  const desktopValue = size[key]?.value?.desktop;
                  const mobileLineHeight = lineHeight[key]?.value?.mobile;
                  const desktopLineHeight = lineHeight[key]?.value?.desktop;

                  return [
                    <Stack space={8}>
                      <Text
                        size={mobileValue}
                        weight="regular"
                        lineHeight={mobileLineHeight}
                      >
                        The quick brown fox jumps over the lazy dog
                      </Text>
                      <Text
                        size={desktopValue}
                        weight="regular"
                        lineHeight={desktopLineHeight}
                      >
                        The quick brown fox jumps over the lazy dog
                      </Text>
                    </Stack>,
                    <Touchable
                      to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${active}/${key}`}
                    >
                      <Tag type="active">{key}</Tag>
                    </Touchable>,
                    <Text>{mobileValue}px</Text>,
                    <Text>{desktopValue}px</Text>,
                  ];
                })
              : active === "weight"
                ? weightKeys.map((key) => {
                    const value = weight[key]?.value;

                    return [
                      <Text size={24} weight={value}>
                        The quick brown fox jumps over the lazy dog
                      </Text>,
                      <Touchable
                        to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${active}/${key}`}
                      >
                        <Tag type="active">{key}</Tag>
                      </Touchable>,
                      <Text>{value}</Text>,
                    ];
                  })
                : lineHeightKeys.map((key) => {
                    const mobileValue = lineHeight[key]?.value?.mobile;
                    const desktopValue = lineHeight[key]?.value?.desktop;

                    return [
                      <Stack space={8}>
                        <Text
                          size={16}
                          weight="regular"
                          lineHeight={mobileValue}
                        >
                          The quick brown fox jumps over the lazy dog
                        </Text>
                        <Text
                          size={16}
                          weight="regular"
                          lineHeight={desktopValue}
                        >
                          The quick brown fox jumps over the lazy dog
                        </Text>
                      </Stack>,
                      <Touchable
                        to={`/tokens-map/${branch}/${selectedSkin}/${tokenType}/${active}/${key}`}
                      >
                        <Tag type="active">{key}</Tag>
                      </Touchable>,
                      <Text>{mobileValue}px</Text>,
                      <Text>{desktopValue}px</Text>,
                    ];
                  })
          }
          boxed
          responsive="collapse-rows"
        />
      </Stack>
    </ResponsiveLayout>
  );
};

export default TextTable;
