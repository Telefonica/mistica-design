import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ButtonLink,
  ResponsiveLayout,
  Stack,
  Title2,
  Tag,
  skinVars,
  Inline,
  Box,
  Text,
  IconChevronLeftRegular,
} from "@telefonica/mistica";
import styles from "./tokenDetail.module.css";
import GetSkin from "../helpers/getSkin";

const TokenDetail = () => {
  const { id, tokenType, branch, tokenTextType, selectedSkin } = useParams();
  const { skinData } = GetSkin({ selectedSkin, branch });

  const getRadiusValue = (skin, tokenKey) => {
    return skin?.radius?.[tokenKey]?.value || "";
  };

  const tranformRadiusValue = (value) => {
    if (value.endsWith("%")) {
      return value;
    } else if (value.includes("circle")) {
      return "50%";
    } else {
      return `${value}px`;
    }
  };

  const getWeightValue = (skin, tokenKey) => {
    return skin?.text?.weight?.[tokenKey]?.value || "";
  };

  const getSizeValue = (skin, tokenKey) => {
    const mobileValue = skin?.text?.size?.[tokenKey]?.value?.mobile || "";
    const desktopValue = skin?.text?.size?.[tokenKey]?.value?.desktop || "";
    return [mobileValue, desktopValue];
  };

  const getLineHeightValue = (skin, tokenKey) => {
    const mobileValue = skin?.text?.lineHeight?.[tokenKey]?.value?.mobile || "";
    const desktopValue =
      skin?.text?.lineHeight?.[tokenKey]?.value?.desktop || "";
    return [mobileValue, desktopValue];
  };

  const renderRadiusTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Skin</th>
            <th>Value</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {skinData.map((skin, index) => {
            const value = getRadiusValue(skin, id);
            return (
              <tr key={index}>
                <td>{skin.name}</td>
                <td>
                  <Tag type="active">{tranformRadiusValue(value)}</Tag>
                </td>
                <td>
                  <div
                    style={{
                      borderRadius: tranformRadiusValue(value),
                      width: 48,
                      height: 48,
                      borderColor: skinVars.colors.brand,
                      borderWidth: 2,
                      borderStyle: "solid",
                      backgroundColor: skinVars.colors.brandLow,
                    }}
                  ></div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderWeightTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Skin</th>
            <th>Value</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {skinData.map((skin, index) => {
            const value = getWeightValue(skin, id);
            return (
              <tr key={index}>
                <td>{skin.name}</td>
                <td>
                  <Tag type="active">{value}</Tag>
                </td>
                <td>
                  <Text size={24} weight={value}>
                    Aa
                  </Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderSizeTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Skin</th>
            <th>Mobile value</th>
            <th>Desktop value</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {skinData.map((skin, index) => {
            const value = getSizeValue(skin, id);
            return (
              <tr key={index}>
                <td>{skin.name}</td>
                <td>
                  <Text>{value[0]}px</Text>
                </td>
                <td>
                  <Text>{value[1]}px</Text>
                </td>
                <td>
                  <Inline space={16}>
                    <Text size={value[0]} weight="regular">
                      Aa
                    </Text>
                    <Text size={value[1]} weight="regular">
                      Aa
                    </Text>
                  </Inline>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderLineHeightTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Skin</th>
            <th>Mobile value</th>
            <th>Desktop value</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {skinData.map((skin, index) => {
            const value = getLineHeightValue(skin, id);
            return (
              <tr key={index}>
                <td>{skin.name}</td>
                <td>
                  <Text>{value[0]}px</Text>
                </td>
                <td>
                  <Text>{value[1]}px</Text>
                </td>
                <td>
                  <Inline space={16}>
                    <Text size={value[0]} weight="regular">
                      Aa
                    </Text>
                    <Text size={value[1]} weight="regular">
                      Aa
                    </Text>
                  </Inline>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Inline space="between" alignItems="center">
          <ButtonLink
            to={`/tokens-map/?branch=${branch}&skin=${selectedSkin}&tokenType=${tokenType}`}
            aligned
          >
            <IconChevronLeftRegular color={skinVars.colors.textLink} />
            Go back
          </ButtonLink>
        </Inline>
      </Box>

      <div className={styles.tokenDetail}>
        <Stack space={40}>
          <Title2>{id}</Title2>
          <Stack space={24}>
            {tokenType === "radius" && <>{renderRadiusTable(skinData, id)}</>}
            {tokenTextType === "size" && <>{renderSizeTable(skinData, id)}</>}
            {tokenTextType === "weight" && (
              <>{renderWeightTable(skinData, id)}</>
            )}
            {tokenTextType === "lineHeight" &&
              renderLineHeightTable(skinData, id)}
          </Stack>
        </Stack>
      </div>
    </ResponsiveLayout>
  );
};

export default TokenDetail;
