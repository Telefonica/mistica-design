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
            legacyDisplay: `${borderConfig.radius}px`,
            button: buttonConfig.roundedButtons
              ? "999px"
              : `${buttonConfig.radius}px`,
          },
        },
      }}
    >
      <ResponsiveLayout>
        <div className="header">
          <p>loguito</p>
          <div className="progress-bar">
            <ProgressBarStepped steps="4" currentStep="3" />
          </div>
          <Text2 color={skinVars.colors.textSecondary}>Step 3 of 4</Text2>
        </div>
        <Stack space={48}>
          <div className="title-section">
            <svg
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 36V24C10 17.3726 15.3726 12 22 12H35"
                stroke="#031A34"
                strokeWidth="2.5"
              />
              <rect
                x="1.25"
                y="1.25"
                width="34.5"
                height="34.5"
                rx="7.75"
                stroke="#0066FF"
                strokeWidth="2.5"
              />
            </svg>

            <Text6>Adjust border radius</Text6>
            <Text2 color={skinVars.colors.textSecondary}>
              Set a border radius style for elements and components with visible
              corners.
            </Text2>
          </div>
          <Align x="center">
            <Boxed>
              <ResponsiveLayout fullWidth variant="alternative">
                <Box width={872} padding={40}>
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
                            <IconLightbulbRegular
                              color={skinVars.colors.brand}
                            />
                          }
                          onClose={() => {}}
                          title="Some title"
                          description="This is a description for the callout"
                        />
                        <BoxedRow
                          asset={
                            <Image
                              src="https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MP_95771590/fee_786_587_png"
                              height={80}
                              aspectRatio="1:1"
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
                          asset={
                            <IconWifiRegular color={skinVars.colors.brand} />
                          }
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
                            ...(activeBorderIndex === index
                              ? selectedStyle
                              : {}),
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
          </Align>
        </Stack>

        <div className="buttons">
          <ButtonSecondary onPress={() => navigate("/create-typo")}>
            Back to typography
          </ButtonSecondary>
          <ButtonPrimary onPress={() => navigate("/onboarding-complete")}>
            Finish
          </ButtonPrimary>
        </div>
      </ResponsiveLayout>
    </ThemeContextProvider>
  );
};

export default CreateBorder;
