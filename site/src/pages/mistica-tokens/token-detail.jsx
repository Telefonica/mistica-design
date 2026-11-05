import React from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveLayout,
  Stack,
  Title2,
  Table,
  Tag,
  skinVars,
  Inline,
  Box,
  Text,
} from "@telefonica/mistica";
import styles from "./tokenDetail.module.css";
import useSkin from "../../helpers/getSkin";
import {
  getRadiusData,
  getSizeData,
  getWeightData,
  getLineHeightData,
  getSpacingData,
} from "../../helpers/getTokenData";
import AppLayout from "../../components/app-layout";
import SubHeader from "../../components/sub-header";

const TokenDetail = () => {
  const { id, tokenType, branch, tokenTextType, selectedSkin } = useParams();
  const { skinData } = useSkin({ branch });

  const renderRadiusTable = () => {
    const content = getRadiusData(skinData, id).map((skin) => [
      skin.skinName,
      skin.tokenValue,
      <div
        style={{
          borderRadius: skin.tokenValue,
          width: 48,
          height: 48,
          borderColor: skinVars.colors.brand,
          borderWidth: 2,
          borderStyle: "solid",
          backgroundColor: skinVars.colors.brandLow,
        }}
      />,
    ]);

    return (
      <Table
        heading={["Skin", "Value", "Example"]}
        content={content}
        boxed
        responsive="collapse-rows"
      />
    );
  };

  const renderWeightTable = () => {
    const content =
      Object.keys(skinData).length > 0
        ? getWeightData(skinData, id).map((skin) => [
            skin.skinName,
            <Tag type="active">{skin.tokenValue}</Tag>,
            <Text size={24} weight={skin.tokenValue}>
              Aa
            </Text>,
          ])
        : [];

    return (
      <Table
        heading={["Skin", "Value", "Example"]}
        content={content}
        boxed
        responsive="collapse-rows"
      />
    );
  };

  const renderSizeTable = () => {
    const content =
      Object.keys(skinData).length > 0
        ? getSizeData(skinData, id).map((skin) => [
            skin.skinName,
            <Text>{skin.tokenValueMobile}px</Text>,
            <Text>{skin.tokenValueDesktop}px</Text>,
            <Inline space={16}>
              <Text size={skin.tokenValueMobile} weight="regular">
                Aa
              </Text>
              <Text size={skin.tokenValueDesktop} weight="regular">
                Aa
              </Text>
            </Inline>,
          ])
        : [];

    return (
      <Table
        heading={["Skin", "Mobile value", "Desktop value", "Example"]}
        content={content}
        boxed
        responsive="collapse-rows"
      />
    );
  };

  const renderLineHeightTable = () => {
    const content =
      Object.keys(skinData).length > 0
        ? getLineHeightData(skinData, id).map((skin) => [
            skin.skinName,
            <Text>{skin.tokenValueMobile}px</Text>,
            <Text>{skin.tokenValueDesktop}px</Text>,
            <Inline space={16}>
              <Text size={skin.tokenValueMobile} weight="regular">
                Aa
              </Text>
              <Text size={skin.tokenValueDesktop} weight="regular">
                Aa
              </Text>
            </Inline>,
          ])
        : [];

    return (
      <Table
        heading={["Skin", "Mobile value", "Desktop value", "Example"]}
        content={content}
        boxed
        responsive="collapse-rows"
      />
    );
  };

  const renderSpacingTable = () => {
    const content =
      Object.keys(skinData).length > 0
        ? getSpacingData(skinData, id).map((skin) => {
            const compact = getSpacingData(skinData, id, "compact").find(
              (item) => item.skinName === skin.skinName
            );
            const format = ({ mobile, desktop }) =>
              `${mobile}px / ${desktop}px`;

            return [
              skin.skinName,
              ...["top", "bottom", "left", "right"].map((side) =>
                skin.hasDensity ? (
                  <Stack space={4}>
                    <Text>{`Cozy: ${format(skin.tokenValue[side])}`}</Text>
                    <Text>{`Compact: ${format(
                      compact.tokenValue[side]
                    )}`}</Text>
                  </Stack>
                ) : (
                  format(skin.tokenValue[side])
                )
              ),
            ];
          })
        : [];

    return (
      <Table
        heading={[
          "Skin",
          "Top (mobile / desktop)",
          "Bottom (mobile / desktop)",
          "Left (mobile / desktop)",
          "Right (mobile / desktop)",
        ]}
        content={content}
        boxed
        responsive="collapse-rows"
      />
    );
  };

  return (
    <AppLayout>
      <ResponsiveLayout>
        <Box paddingY={48}>
          <SubHeader
            to={`/tokens-map/?branch=${branch}&skin=${selectedSkin}&tokenType=${tokenType}`}
          />
        </Box>

        <div className={styles.tokenDetail}>
          <Stack space={40}>
            <Title2>{id}</Title2>
            <Stack space={24}>
              {tokenType === "radius" && <>{renderRadiusTable()}</>}
              {tokenType === "spacing" && <>{renderSpacingTable()}</>}
              {tokenTextType === "size" && <>{renderSizeTable()}</>}
              {tokenTextType === "weight" && <>{renderWeightTable()}</>}
              {tokenTextType === "lineHeight" && renderLineHeightTable()}
            </Stack>
          </Stack>
        </div>
      </ResponsiveLayout>
    </AppLayout>
  );
};

export default TokenDetail;
