// This file defines the `CreateTypo` component, the second step in the skin creation flow. 
// It allows users to select a font and weight for display text, persists selections in localStorage using storageUtils, and provides a preview of the typography choices. 

// To-do: try to convert custom components to existing Mística components

import React, { useState, useEffect } from "react";
import {
  ResponsiveLayout,
  Text4,
  Text2,
  ButtonPrimary,
  Box,
  Text6,
  Text5,
  ProgressBarStepped,
  skinVars,
  Inline,
  ButtonSecondary,
  DisplayDataCard,
  Stack,
  DisplayMediaCard,
  Select,
} from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS, setStorageItem, getStorageItem, DEFAULT_VALUES } from '../utils/storageUtils';
import "./create-typo.css";
import "../fonts/fonts.css";

const CreateTypo = () => {

  // To redirect the user to previous or next steps
  const navigate = useNavigate();

  // Initialize states using getStorageItem from storageUtils
  const [typography, setTypography] = useState(() => 
    getStorageItem(STORAGE_KEYS.TYPOGRAPHY, DEFAULT_VALUES.typography)
  );

  // Highlights the selected weight button and applies corresponding weight
  const [activeIndex, setActiveIndex] = useState(() => {
    const weights = ["bold", "medium", "regular", "light"];
    return weights.indexOf(typography.weight);
  });

  const fonts = ["Telefonica Sans", "VivoType"];
  const weights = ["Bold", "Medium", "Regular", "Light"];

  // Effect hook to persist typography changes to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TYPOGRAPHY, typography);
  }, [typography]);

  // Function to handle font selection from the dropdown
  const handleFontChange = (newFont) => {
    setTypography(prev => ({
      ...prev,
      font: newFont
    }));
  };

  // Function to handle weight selection from buttons
  const handleClick = (index) => {
    const weight = weights[index].toLowerCase();
    setActiveIndex(index);
    setTypography(prev => ({
      ...prev,
      weight: weight
    }));
  };

  // Applied condititonally to the active weight button to visually indicate selection
  const selectedStyle = {
    border: `2px solid ${skinVars.colors.brand}`,
    cursor: "pointer",
    width: 60,
    height: 60,
    fontSize: 28,
    backgroundColor: "white",
  };

  return (
    <ResponsiveLayout>
      <div className="header">
        <p>loguito</p>
        <div className="progress-bar">
          <ProgressBarStepped steps="4" currentStep="2" />
        </div>
        <Text2 color={skinVars.colors.textSecondary}>Step 2 of 4</Text2>
      </div>

      <div className="title-section">
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
        <Text6>Define the typography</Text6>
        <Text2 color={skinVars.colors.textSecondary}>
          Choose a font and a weight for the display texts.
        </Text2>
      </div>

      <div className="typo-card">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 40,
          }}
        >
          <Box width={375}>
            <DisplayDataCard
              title="Telefonica Sans"
              description="4 styles"
              extra={
                <Box paddingTop={32}>
                  <Stack space={6}>
                    <Text2 color={skinVars.colors.textSecondary}>Preview</Text2>
                    <div style={{ fontFamily: typography.font }}>
                    <Text4
                      weight={typography.weight}
                      style={{ fontFamily: typography.font }}
                    >
                      Step outside your comfort zone. Dream big. Discover what's possible.
                    </Text4>
                    </div>
                  </Stack>
                </Box>
              }
            />
          </Box>

          <div style={{ fontFamily: typography.font }}>
          <Box width={375}>
            <DisplayMediaCard
              backgroundImage="https://picsum.photos/1200/1200"
              extra={
                <Text5
                  weight={typography.weight}
                  style={{ fontFamily: typography.font }}
                >
                  This is an example of Display Text
                </Text5>
              }
              description="Display Texts are often used in large text"
            />
          </Box>
          </div>
        </div>
        <Inline space={40} alignItems="center" flexDirection="column">
          <Select
            name="Font"
            label="Font Mística"
            options={fonts.map((font) => ({ value: font, text: font }))}
            fullWidth
            value={typography.font}
            onChangeValue={handleFontChange}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              margin: 0,
              width: "100%",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", gap: "20px" }}>
              {weights.map((label, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleClick(index)}
                    style={{
                      width: "60px",
                      height: "60px",
                      fontSize: "28px",
                      backgroundColor: "white",
                      fontWeight: weights[index],
                      border: `2px solid ${skinVars.colors.border}`,
                      ...(activeIndex === index ? selectedStyle : {}),
                    }}
                  >
                    <Text5 weight={label.toLowerCase()}>Aa</Text5>
                  </button>
                  <div style={{ marginTop: "8px", fontSize: "16px" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Inline>
      </div>

      <div className="buttons">
        <ButtonSecondary onPress={() => navigate("/create-skin")}>
          Back to colors
        </ButtonSecondary>
        <ButtonPrimary onPress={() => navigate("/create-border")}>
          Next step: border
        </ButtonPrimary>
      </div>
    </ResponsiveLayout>
  );
};

export default CreateTypo;