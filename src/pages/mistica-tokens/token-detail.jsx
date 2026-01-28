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
import GetSkin from "../../helpers/getSkin";
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
  const { skinData } = GetSkin({ branch });

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
          {getRadiusData(skinData, id).map((skin, index) => {
            return (
              <tr key={index}>
                <td>{skin.skinName}</td>
                <td>{skin.tokenValue}</td>
                <td>
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
          {Object.keys(skinData).length > 0 &&
            getWeightData(skinData, id).map((skin, index) => {
              return (
                <tr key={index}>
                  <td>{skin.skinName}</td>
                  <td>
                    <Tag type="active">{skin.tokenValue}</Tag>
                  </td>
                  <td>
                    <Text size={24} weight={skin.tokenValue}>
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
          {Object.keys(skinData).length > 0 &&
            getSizeData(skinData, id).map((skin, index) => {
              return (
                <tr key={index}>
                  <td>{skin.skinName}</td>
                  <td>
                    <Text>{skin.tokenValueMobile}px</Text>
                  </td>
                  <td>
                    <Text>{skin.tokenValueDesktop}px</Text>
                  </td>
                  <td>
                    <Inline space={16}>
                      <Text size={skin.tokenValueMobile} weight="regular">
                        Aa
                      </Text>
                      <Text size={skin.tokenValueDesktop} weight="regular">
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
          {Object.keys(skinData).length > 0 &&
            getLineHeightData(skinData, id).map((skin, index) => {
              return (
                <tr key={index}>
                  <td>{skin.skinName}</td>
                  <td>
                    <Text>{skin.tokenValueMobile}px</Text>
                  </td>
                  <td>
                    <Text>{skin.tokenValueDesktop}px</Text>
                  </td>
                  <td>
                    <Inline space={16}>
                      <Text size={skin.tokenValueMobile} weight="regular">
                        Aa
                      </Text>
                      <Text size={skin.tokenValueDesktop} weight="regular">
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

  const renderSpacingTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Skin</th>
            <th>
              Top
              <table>
                <thead>
                  <tr>
                    <th>Mobile</th>
                    <th>Desktop</th>
                  </tr>
                </thead>
              </table>
            </th>
            <th>
              Bottom
              <table>
                <thead>
                  <tr>
                    <th>Mobile</th>
                    <th>Desktop</th>
                  </tr>
                </thead>
              </table>
            </th>
            <th>
              Left
              <table>
                <thead>
                  <tr>
                    <th>Mobile</th>
                    <th>Desktop</th>
                  </tr>
                </thead>
              </table>
            </th>
            <th>
              Right
              <table>
                <thead>
                  <tr>
                    <th>Mobile</th>
                    <th>Desktop</th>
                  </tr>
                </thead>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(skinData).length > 0 &&
            getSpacingData(skinData, id).map((skin, index) => {
              const { top, bottom, left, right } = skin.tokenValue;

              return (
                <tr key={index}>
                  <td>{skin.skinName}</td>

                  {/* Top */}
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td>{top.mobile}px</td>
                          <td>{top.desktop}px</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Bottom */}
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td>{bottom.mobile}px</td>
                          <td>{bottom.desktop}px</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Left */}
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td>{left.mobile}px</td>
                          <td>{left.desktop}px</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Right */}
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td>{right.mobile}px</td>
                          <td>{right.desktop}px</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
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
              {tokenTextType === "size" && <>{renderSizeTable(skinData, id)}</>}
              {tokenTextType === "weight" && <>{renderWeightTable()}</>}
              {tokenTextType === "lineHeight" &&
                renderLineHeightTable(skinData, id)}
            </Stack>
          </Stack>
        </div>
      </ResponsiveLayout>
    </AppLayout>
  );
};

export default TokenDetail;
