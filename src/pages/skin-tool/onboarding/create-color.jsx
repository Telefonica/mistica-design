// This file defines the `CreateColor` component, the first step in the skin creation flow.
// It allows users to define a color palette for their brand using color pickers, persists selections in localStorage, and provides navigation to other steps.

import {
  ResponsiveLayout,
  TextLink,
  skinVars,
  ButtonPrimary,
  ButtonSecondary,
  Text6,
  Text2,
  ProgressBarStepped,
  IconLayersRegular,
  Text1,
  Grid,
  GridItem,
  Inline,
  Box,
  Stack,
  ButtonLink,
} from "@telefonica/mistica";
import React, { useState, useEffect } from "react";
import "./create-color.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import StepHeader from "../template/Onboarding.jsx";

// Initilal color palette with empty values
const initialColors = {
  brandColor: "",
  successColor: "",
  errorColor: "",
  warningColor: "",
  promoColor: "",
  neutral1: "",
  neutral2: "",
  neutral3: "",
};

const CreateColor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateSkinPage = location.pathname === "/create-skin";

  // State to manage the color palette, initialized from localStorage or initialColors
  const [colors, setColors] = useState(() => {
    const storedColors = localStorage.getItem("skinColors");
    return storedColors ? JSON.parse(storedColors) : initialColors;
  });

  // Effect hook to persist color changes in localStorage
  useEffect(() => {
    localStorage.setItem("skinColors", JSON.stringify(colors));
  }, [colors]);

  // Function to update a specific color in the palette
  const handleColorChange = (key, value) => {
    setColors((prevColors) => ({
      ...prevColors,
      [key]: value,
    }));
  };

  // Function to reset all the colors to their initial empty state
  const handleResetColors = () => {
    setColors(initialColors);
    localStorage.setItem("userColors", JSON.stringify(initialColors));
  };

  // Component to render a single color picker box
  const ColorBox = ({ colorKey, label }) => (
    <Stack space={8} className="colorCard" id={colorKey}>
      <div
        className="color-preview"
        style={{
          backgroundColor: colors[colorKey] || "#FFFFFF",
          border: `2px solid ${skinVars.colors.border}`,
        }}
        onClick={() => document.getElementById(`${colorKey}-input`).click()}
      >
        {!colors[colorKey] && (
          <IconLayersRegular size={40} color={skinVars.colors.border} />
        )}
      </div>
      <Box width={120}>
        <Stack space={0}>
          <input
            id={`${colorKey}-input`}
            type="color"
            value={colors[colorKey] || "#FFFFFF"}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            style={{
              position: "absolute",
              visibility: "hidden",
            }}
          />
          <Text1 weight="medium">{label}</Text1>
          {colors[colorKey] ? (
            <Text1>{colors[colorKey].toUpperCase()}</Text1>
          ) : (
            <ButtonLink
              small
              bleedLeft
              bleedY
              onPress={() =>
                document.getElementById(`${colorKey}-input`).click()
              }
            >
              Define color
            </ButtonLink>
          )}
        </Stack>
      </Box>
    </Stack>
  );

  return (
    <StepHeader
      currentStep={1}
      totalSteps={4}
      title="Build Your Brand's Palette"
      description="Choose the colors that will define your Mística Skin."
      icon={<IconLayersRegular size={40} />}
      prevRoute="/skin-tool"
      nextRoute="/create-typo"
      nextLabel="Continue to typography"
      onReset={handleResetColors}
    >
      <Box padding={40}>
        <Grid columns={8} gap={24} rows={2}>
          <GridItem rowSpan={2} columnSpan={2}>
            <ColorBox colorKey="brandColor" label="Brand" />
          </GridItem>
          <GridItem rowSpan={1} columnSpan={6}>
            <Inline space={16} fullWidth>
              <ColorBox colorKey="successColor" label="Success" />
              <ColorBox colorKey="errorColor" label="Error" />
              <ColorBox colorKey="warningColor" label="Warning" />
              <ColorBox colorKey="promoColor" label="Promo" />
            </Inline>
          </GridItem>
          <GridItem rowSpan={1} columnSpan={6}>
            <Inline space={16} fullWidth>
              <ColorBox colorKey="neutral1" label="Neutral 1" />
              <ColorBox colorKey="neutral2" label="Neutral 2" />
              <ColorBox colorKey="neutral3" label="Neutral 3" />
            </Inline>
          </GridItem>
        </Grid>
      </Box>
    </StepHeader>
  );
};

export default CreateColor;
