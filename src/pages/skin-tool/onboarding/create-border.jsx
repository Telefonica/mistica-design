// This file defines the `CreateBorder` component, the third step in the skin creation flow.
// It allows users to adjust border radius styles for UI elements and toggle rounded buttons, persisting selections in localStorage.

// To-do: fix the problem with the rounded borders not appearing and fix buttons roundness when checkbox is not selected. Add final ultra soft, soft and square pixel values

import React, { useState, useEffect, useContext } from "react";
import {
  ResponsiveLayout,
  Text2,
  ButtonPrimary,
  Text6,
  ProgressBarStepped,
  skinVars,
  ButtonSecondary,
  Grid,
  GridItem,
  IconWifiRegular,
  DataCard,
  PosterCard,
  Image,
  BoxedRow,
  Tag,
  Inline,
  Row,
  ThemeContextProvider,
  getTelefonicaSkin,
  Box,
  Align,
  Boxed,
  Stack,
  Callout,
  IconBoxRegular,
  SnapCard,
  ButtonLayout,
  IconLightbulbRegular,
} from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import {
  STORAGE_KEYS,
  setStorageItem,
  getStorageItem,
  DEFAULT_VALUES,
} from "../utils/storageUtils";
import "./create-typo.css";
import OnboardingTemplate from "../template/Onboarding";

const CreateBorder = () => {
  const navigate = useNavigate();

  // Defines the available border radius options in pixels, corresponding to Ultra Soft, Soft and Square * NOT FINAL VALUES
  const containerBorderRadiusValues = [16, 8, 0];
  const buttonBorderRadiusValues = [12, 8, 0];

  // Drives the custom theme’s border settings and is updated when the user selects a new radius or toggles rounded buttons, persisting changes to localStorage
  const [borderConfig, setBorderConfig] = useState(() =>
    getStorageItem(STORAGE_KEYS.BORDER, DEFAULT_VALUES.border)
  );
  const [buttonConfig, setButtonConfig] = useState(() => ({
    radius:
      getStorageItem(STORAGE_KEYS.BORDER, DEFAULT_VALUES.border).radius / 2,
    roundedButtons: getStorageItem(STORAGE_KEYS.BORDER, DEFAULT_VALUES.border)
      .roundedButtons,
  }));

  // Array of objects defining the border style options, each with a label and an SVG icon for visual representation
  const borders = [
    {
      label: "Ultra Soft",
      svg: (
        <svg
          width="42"
          height="41"
          viewBox="0 0 42 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 41V26C2 12.7452 12.7452 2 26 2H42"
            stroke="#031A34"
            strokeWidth="2.5"
          />
        </svg>
      ),
    },
    {
      label: "Soft",
      svg: (
        <svg
          width="42"
          height="41"
          viewBox="0 0 42 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 41V18C2 9.16344 9.16344 2 18 2H42"
            stroke="#031A34"
            strokeWidth="2.5"
          />
        </svg>
      ),
    },
    {
      label: "Square",
      svg: (
        <svg
          width="42"
          height="41"
          viewBox="0 0 42 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 41V4C2 2.89543 2.89543 2 4 2H42"
            stroke="#031A34"
            strokeWidth="2.5"
          />
        </svg>
      ),
    },
  ];

  // Determines the initial index of the selected border radius in containerBorderRadiusValues based on the stored borderConfig.radius
  const getInitialBorderIndex = () => {
    const savedRadius = borderConfig.radius;
    return (
      containerBorderRadiusValues.findIndex((value) => value === savedRadius) ||
      0
    );
  };

  // State variable tracking the currently selected border style’s index in the borders array
  const [activeBorderIndex, setActiveBorderIndex] = useState(
    getInitialBorderIndex
  );

  // Effect hook to persist borderConfig changes to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.BORDER, borderConfig);
  }, [borderConfig]);

  // Updates the selected border radius when a border style button is clicked
  const handleBorderClick = (index) => {
    setActiveBorderIndex(index);
    const containerRadius = containerBorderRadiusValues[index];
    const buttonRadius = buttonBorderRadiusValues[index];
    setBorderConfig((prev) => ({
      ...prev,
      radius: containerRadius,
    }));
    setButtonConfig((prev) => ({
      ...prev,
      radius: buttonRadius,
    }));
  };

  // Toggles the roundedButtons property in borderConfig when the user switches the "Rounded buttons" option * FIX, variable works but is not reflected on the UI
  const handleRoundedButtonsChange = (value) => {
    setBorderConfig((prev) => ({
      ...prev,
      roundedButtons: value,
    }));
    setButtonConfig((prev) => ({
      ...prev,
      roundedButtons: value,
    }));
  };

  // Defines CSS styles for the currently selected border style button, providing visual feedback. * TRY TO CONVERT TO MISTICA
  const selectedStyle = {
    border: `2px solid ${skinVars.colors.brand}`,
    cursor: "pointer",
    width: 60,
    height: 60,
    fontSize: 28,
    backgroundColor: "white",
  };

  return (
    <ThemeContextProvider
      theme={{
        i18n: {
          locale: "es-ES",
          phoneNumberFormattingRegionCode: "ES",
        },
        skin: {
          ...getTelefonicaSkin(),
          borderRadii: {
            ...skinVars.borderRadii,
            container: `${borderConfig.radius}px`,
            indicator: `${borderConfig.radius}px`,
            legacyDisplay: `${borderConfig.radius}px`,
            button: buttonConfig.roundedButtons
              ? "999px"
              : `${buttonConfig.radius}px`,
          },
        },
      }}
    >
      <OnboardingTemplate
        currentStep={3}
        totalSteps={4}
        title="Define the borders"
        description="Choose the border radius style for your UI elements."
        prevRoute="/create-typo"
        nextRoute="/onboarding-complete"
        prevLabel="Back to typography"
        nextLabel="Finish"
        icon={
          <svg
            width="343"
            height="44"
            viewBox="0 0 343 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M173.409 32H170.689L168.545 26.24H157.473L155.329 32H152.609L161.089 9.6H164.929L173.409 32ZM162.689 12.32L158.369 23.84H167.649L163.329 12.32H162.689ZM180.622 32.32C177.262 32.32 175.022 30.24 175.022 27.36C175.022 24.32 176.942 22.24 181.422 22.24H185.742V21.76C185.742 19.36 184.302 17.92 181.902 17.92C179.502 17.92 178.062 19.2 177.902 20.64H175.502C175.662 18.08 177.902 15.68 181.902 15.68C185.742 15.68 188.142 17.92 188.142 21.76V32H186.062L185.742 30.08H185.582C184.974 31.04 183.182 32.32 180.622 32.32ZM180.622 30.08C183.822 30.08 185.742 28.16 185.742 25.12V24.48H181.422C178.542 24.48 177.422 25.76 177.422 27.36C177.422 28.96 178.542 30.08 180.622 30.08Z"
              fill="black"
            />
            <rect x="153" y="40" width="36" height="4" fill="#0066FF" />
          </svg>
        }
      >
        <Boxed>
          <ResponsiveLayout fullWidth variant="alternative">
            <Box padding={40}>
              <Grid
                columns={3}
                rows={1}
                gap={24}
                alignItems="end"
                justifyItems="stretch"
              >
                <GridItem>
                  <div style={{ height: 244 }}>
                    <PosterCard
                      title="Out & About"
                      description="11 offers"
                      backgroundImage="https://picsum.photos/1200/1200"
                      onPress={() => {}}
                      aspectRatio="7:10"
                    />
                  </div>
                </GridItem>
                <GridItem rowSpan={1}>
                  <Stack space={24}>
                    <Callout
                      asset={
                        <IconLightbulbRegular color={skinVars.colors.brand} />
                      }
                      onClose={() => {}}
                      title="Some title"
                      description="This is a description for the callout"
                    />
                    <BoxedRow
                      asset={
                        <Image
                          src="https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MP_95771590/fee_786_587_png"
                          height={56}
                          loadingFallback={false}
                          aspectRatio="1:1"
                          noBorderRadius
                        />
                      }
                      headline={<Tag type="promo">Teléfono móvil</Tag>}
                      title="iPhone 12 128GB"
                      onPress={() => {}}
                    />
                  </Stack>
                </GridItem>

                <GridItem>
                  <Stack space={24}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <ButtonPrimary
                        style={{ width: "100%" }}
                        onPress={() => {}}
                      >
                        Hey Ho!
                      </ButtonPrimary>
                      <ButtonSecondary
                        style={{ width: "100%" }}
                        onPress={() => {}}
                      >
                        Let's Go!
                      </ButtonSecondary>
                    </div>
                    <DataCard
                      asset={<IconWifiRegular color={skinVars.colors.brand} />}
                      title="Internet"
                      description="30 GB + Unlimited voice"
                    />
                  </Stack>
                </GridItem>
              </Grid>
            </Box>
          </ResponsiveLayout>
          <Box padding={40}>
            <Inline space="between" alignItems="flex-start">
              <div style={{ display: "flex", gap: "20px" }}>
                {borders.map((border, index) => (
                  <div key={index} style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleBorderClick(index)}
                      style={{
                        position: "relative",
                        width: "60px",
                        height: "60px",
                        backgroundColor: "white",
                        border: `2px solid ${skinVars.colors.border}`,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        ...(activeBorderIndex === index ? selectedStyle : {}),
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          display: "inline-flex",
                        }}
                      >
                        {border.svg}
                      </div>
                    </button>
                    <div style={{ marginTop: "8px", fontSize: "16px" }}>
                      {border.label}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Row
                  title="Rounded buttons"
                  description="Allows you to define rounded buttons in any style"
                  switch={{
                    defaultValue: borderConfig.roundedButtons,
                    onChange: handleRoundedButtonsChange,
                  }}
                />
              </div>
            </Inline>
          </Box>
        </Boxed>
      </OnboardingTemplate>
    </ThemeContextProvider>
  );
};

export default CreateBorder;
