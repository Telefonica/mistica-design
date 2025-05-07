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
  ButtonLayout,
  IconWifiRegular,
  DataCard,
  HighlightedCard,
  PosterCard,
  Image,
  BoxedRow,
  Tag,
  Inline,
  Row,
  ThemeContext,
} from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS, setStorageItem, getStorageItem, DEFAULT_VALUES } from '../utils/storageUtils';
import './create-typo.css';

const CreateBorder = () => {
  const navigate = useNavigate();

  // Holds the current theme context from ThemeContext, providing baseline theme settings to extend with custom border styles
  const currentTheme = useContext(ThemeContext);

  // Defines the available border radius options in pixels, corresponding to Ultra Soft, Soft and Square * NOT FINAL VALUES
  const borderRadiusValues = [32, 24, 0];

  // Drives the custom theme’s border settings and is updated when the user selects a new radius or toggles rounded buttons, persisting changes to localStorage
  const [borderConfig, setBorderConfig] = useState(() => 
    getStorageItem(STORAGE_KEYS.BORDER, DEFAULT_VALUES.border)
  );

  // An extended version of currentTheme with updated border-related properties reflecting user selections
  const customTheme = {
    ...currentTheme,
    borders: {
      ...currentTheme.borders,
      radius: borderConfig.radius + "px",
    },
    borderRadii: {
      ...currentTheme.borderRadii,
      container: borderConfig.radius + "px",
      button: borderConfig.roundedButtons ? "999px" : borderConfig.radius + "px",
    },
    components: {
      ...currentTheme.components,
      Card: {
        ...currentTheme.components?.Card,
        borderRadius: borderConfig.radius + "px",
      },
      DataCard: {
        ...currentTheme.components?.DataCard,
        borderRadius: borderConfig.radius + "px",
      },
      HighlightedCard: {
        ...currentTheme.components?.HighlightedCard,
        borderRadius: borderConfig.radius + "px",
      },
      PosterCard: {
        ...currentTheme.components?.PosterCard,
        borderRadius: borderConfig.radius + "px",
      },
      BoxedRow: {
        ...currentTheme.components?.BoxedRow,
        borderRadius: borderConfig.radius + "px",
      },
    },
  };

  // Array of objects defining the border style options, each with a label and an SVG icon for visual representation
  const borders = [
    {
      label: "Ultra Soft",
      svg: (
        <svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 41V26C2 12.7452 12.7452 2 26 2H42" stroke="#031A34" strokeWidth="2.5"/>
        </svg>
      ),
    },
    {
      label: "Soft",
      svg: (
        <svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 41V18C2 9.16344 9.16344 2 18 2H42" stroke="#031A34" strokeWidth="2.5"/>
        </svg>
      ),
    },
    {
      label: "Square",
      svg: (
        <svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 41V4C2 2.89543 2.89543 2 4 2H42" stroke="#031A34" strokeWidth="2.5"/>
        </svg>
      ),
    },
  ];

  // Determines the initial index of the selected border radius in borderRadiusValues based on the stored borderConfig.radius
  const getInitialBorderIndex = () => {
    const savedRadius = borderConfig.radius;
    return borderRadiusValues.findIndex(value => value === savedRadius) || 0;
  };

  // State variable tracking the currently selected border style’s index in the borders array
  const [activeBorderIndex, setActiveBorderIndex] = useState(getInitialBorderIndex);

  // Effect hook to persist borderConfig changes to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.BORDER, borderConfig);
  }, [borderConfig]);

  // Updates the selected border radius when a border style button is clicked
  const handleBorderClick = (index) => {
    setActiveBorderIndex(index);
    setBorderConfig(prev => ({
      ...prev,
      radius: borderRadiusValues[index]
    }));
  };

  // Toggles the roundedButtons property in borderConfig when the user switches the "Rounded buttons" option * FIX, variable works but is not reflected on the UI
  const handleRoundedButtonsChange = (value) => {
    setBorderConfig(prev => ({
      ...prev,
      roundedButtons: value
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

  // A wrapper component that applies the selected border radius to its children (various Mística cards). * FIX, the border stroke disappears when is rounded
  const CardWrapper = ({ children, style, ...props }) => (
    <div 
      style={{ 
        borderRadius: `${borderConfig.radius}px`,
        overflow: 'hidden',
        ...style 
      }} 
      {...props}
    >
      {children}
    </div>
  );
  
  return (
    <ThemeContext.Provider value={customTheme}>
      <ResponsiveLayout>
        <div className="header">
          <p>loguito</p>
          <div className="progress-bar">
            <ProgressBarStepped steps="4" currentStep="3" />
          </div>
          <Text2 color={skinVars.colors.textSecondary}>Step 3 of 4</Text2>
        </div>

        <div className="title-section">
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 36V24C10 17.3726 15.3726 12 22 12H35" stroke="#031A34" strokeWidth="2.5"/>
            <rect x="1.25" y="1.25" width="34.5" height="34.5" rx="7.75" stroke="#0066FF" strokeWidth="2.5"/>
          </svg>

          <Text6>Adjust border radius</Text6>
          <Text2 color={skinVars.colors.textSecondary}>
            Set a border radius style for elements and components with visible corners.
          </Text2>
        </div>

        <div className="typo-card">
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "872px"}}>
            <Grid columns={4} rows={2} gap={8}>
              <GridItem rowSpan={2}>
                <CardWrapper>
                  <PosterCard
                    aspectRatio="7:10"
                    title="Out & About"
                    description="11 offers"
                    backgroundImage="https://picsum.photos/1200/1200"
                  />
                </CardWrapper>
              </GridItem>
              <GridItem rowSpan={1} columnSpan={2}>
                <CardWrapper>
                  <HighlightedCard
                    title="This is new!"
                    description="Discover iPhone 16"
                    imageUrl="https://m.media-amazon.com/images/I/41mw+mi7l2L._AC_SL1239_.jpg"
                    imageFit="fill"
                    onClose={() => {}}
                    button={
                      <ButtonPrimary small onPress={() => {}}>
                        Explore marketplace
                      </ButtonPrimary>
                    }
                  />
                </CardWrapper>
              </GridItem>
              <GridItem rowSpan={2}>
                <CardWrapper>
                  <DataCard
                    button={
                      <ButtonLayout
                        primaryButton={
                          <ButtonPrimary onPress={() => {}}>Hey Ho!</ButtonPrimary>
                        }
                        secondaryButton={
                          <ButtonSecondary onPress={() => {}}>Let's Go!</ButtonSecondary>
                        }
                      />
                    }
                    asset={<IconWifiRegular color={skinVars.colors.brand} />}
                    title="Title"
                    description="Description"
                  />
                </CardWrapper>
              </GridItem>
              <GridItem columnSpan={2}>
                <CardWrapper>
                  <BoxedRow
                    asset={
                      <Image
                        src="https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MP_95771590/fee_786_587_png"
                        height={120}
                        aspectRatio="1:1"
                      />
                    }
                    headline={<Tag type="promo">Teléfono móvil</Tag>}
                    title="iPhone 12 128GB"
                    onPress={() => {}}
                  />
                </CardWrapper>
              </GridItem>
            </Grid>
          </div>

          <Inline space={40} alignItems="center">
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
                  <div style={{ marginTop: "8px", fontSize: "16px" }}>{border.label}</div>
                </div>
              ))}
            </div>

            <div>
              <Row
                title="Rounded buttons"
                description="Allows you to define rounded buttons in any style"
                switch={{ 
                  defaultValue: borderConfig.roundedButtons,
                  onChange: handleRoundedButtonsChange
                }}
              />
            </div>
          </Inline>
        </div>

        <div className="buttons">
          <ButtonSecondary onPress={() => navigate('/create-typo')}>Back to typography</ButtonSecondary>
          <ButtonPrimary onPress={() => navigate('/onboarding-complete')}>Finish</ButtonPrimary>
        </div>
      </ResponsiveLayout>
    </ThemeContext.Provider>
  );
};

export default CreateBorder;