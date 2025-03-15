// This file defines a React component `ThemePreviewWithTools` that allows users to preview and customize a theme's color palette, typography, and borders.
// It integrates with localStorage to persist color selections, provides a navigation bar to switch between sections, and includes export functionality
// for the customized theme as JSON.

// Next steps:
//      1. change some code to Mística components (dialog, drawer) (maybe is it possible to mistify the colorbox component?)
//      2.

import React, { useState } from "react";
import {
  ResponsiveLayout,
  MainNavigationBar,
  ButtonPrimary,
  Text2,
  skinVars,
  Header,
  HeaderLayout,
  Inline,
  Row,
  IconChevronLeftRegular,
  IconShareRegular,
  IconTimeRegular,
  IconWifiRegular,
  IconCheckRegular,
  ButtonLayout,
  ButtonSecondary,
  Title2,
  Text5,
  Text1,
  IconButton,
  IconEditPencilRegular,
  Title1,
  BoxedRow,
  BoxedRowList,
  Box,
  GridLayout,
  Placeholder,
  Stack,
  Title3,
  Align,
  Tabs,
  TelefonicaLogo,
} from "@telefonica/mistica";
import { getColorScale, renderColorScale } from "./utils/color-utils";
import Theme from "./utils/theme";
import ColorDialog from "./utils/color-input";
import "./advanced-tools.css";
import MisticaLogo from "./assets/logo.tsx";

// Component definition for ThemePreviewWithTools
const ThemePreviewWithTools = () => {
  // State to track the currently selected section navIndex in the navigation bar
  const [navIndex, setNavIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  //State for the skin name, defaulting to custom-skin
  const [skinName, setSkinName] = useState("custom-skin");

  //State for the currently selected color in he color picker
  const [selectedColor, setSelectedColor] = useState("#0072F0");

  //State to manage the theme's color palette, initialized from localStorage or default
  const [colors, setColors] = useState(() => {
    const storedColors = localStorage.getItem("skinColors");
    return storedColors
      ? JSON.parse(storedColors)
      : {
          primaryColor: "#0072F0",
          secondaryColor: "#FFB600",
          warningColor: "#FF4C4C",
          successColor: "#00C9B0",
          highlightColor: "#B24FFF",
          neutralColor: "#001E64",
        };
  });

  //State to store the generated color scale for the selected color
  const [colorScaleOutput, setColorScaleOutput] = useState({});

  //State to track the key of the currently selected color for editing
  const [selectedColorKey, setSelectedColorKey] = useState(null);

  //State to control the visibility of the color dialog
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);

  //State to track the current color key being edited in the color dialog
  const [currentColorKey, setCurrentColorKey] = useState(null);

  // Temporary color value used in the color dialog before saving
  const [tempColor, setTempColor] = useState("#0072F0");

  // Array defining the sections available in the navigation bar
  const sections = [
    { title: "Color", onPress: () => setNavIndex(0) },
    { title: "Typography", onPress: () => setNavIndex(1) },
    { title: "Border", onPress: () => setNavIndex(2) },
    { title: "Skin Preview", onPress: () => setNavIndex(3) },
  ];

  const tabs = [
    { text: "Palette", onPress: () => setTabIndex(0) },
    { text: "Tokens", onPress: () => setTabIndex(1) },
  ];

  // Function to export the current theme configuration as a JSON file
  const handleExportJSON = () => {
    const exportData = {
      name: skinName,
      colors: colors,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${skinName}.json`;
    link.click();
  };

  // Function to handle clicking a color box, updating the selected color and its scale
  const handleColorClick = (key) => {
    setSelectedColor(colors[key]);
    setSelectedColorKey(key);
    setColorScaleOutput({
      [key]: getColorScale(colors[key]),
    });
  };

  // Function to open the color dialog for editting a specific color
  const openColorDialog = (colorKey) => {
    setCurrentColorKey(colorKey);
    setTempColor(colors[colorKey] || "#0072F0");
    setIsColorDialogOpen(true);
  };

  // Function to save the edited color from the dialog and update the theme
  const handleSaveColor = () => {
    if (currentColorKey) {
      const newColors = {
        ...colors,
        [currentColorKey]: tempColor,
      };
      setColors(newColors);
      setSelectedColor(tempColor);
      setColorScaleOutput({
        [currentColorKey]: getColorScale(tempColor),
      });
      localStorage.setItem("skinColors", JSON.stringify(newColors));
    }
    setIsColorDialogOpen(false);
  };

  //Function to update the temporary color value in the dialog
  const handleCancelColor = () => {
    setIsColorDialogOpen(false);
    setTempColor(colors[currentColorKey] || "#0072F0");
  };

  //Function to update the color value in the dialog
  const handleColorChange = (newColor) => {
    setTempColor(newColor);
  };

  // Component to render a single color box with optional edit icon
  const ColorBox = ({ colorKey, label, showEditIcon = false }) => {
    return (
      <BoxedRow
        asset={
          <div
            style={{
              backgroundColor: colors[colorKey] || "#FFFFFF",
              width: 40,
              height: 40,
              border: `1px solid ${skinVars.colors.border}`,
              borderRadius: "8px",
            }}
          />
        }
        title={label}
        description={
          colors[colorKey] ? colors[colorKey].toUpperCase() : "Definir color"
        }
        onPress={() => handleColorClick(colorKey)}
        withChevron={false}
        right={
          showEditIcon && (
            <div
              style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              <IconButton
                onPress={() => openColorDialog(colorKey)}
                Icon={IconEditPencilRegular}
                type="brand"
              />
            </div>
          )
        }
      />
    );
  };

  const SkinTokens = ({ colorKey, label, showEditIcon = false }) => {
    return (
      <BoxedRow
        asset={
          <div
            style={{
              backgroundColor: colors[colorKey] || "#FFFFFF",
              width: 40,
              height: 40,
              border: `1px solid ${skinVars.colors.border}`,
              borderRadius: "8px",
            }}
          />
        }
        title={label}
        description={
          colors[colorKey] ? colors[colorKey].toUpperCase() : "Definir color"
        }
        onPress={() => handleColorClick(colorKey)}
        withChevron={false}
        right={
          showEditIcon && (
            <div
              style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              <IconButton
                onPress={() => openColorDialog(colorKey)}
                Icon={IconEditPencilRegular}
                type="brand"
              />
            </div>
          )
        }
      />
    );
  };

  //Main render function for the component ColorBox
  return (
    <>
      <MainNavigationBar
        logo={<MisticaLogo size={250} type="imagotype" />}
        sections={sections}
        selectednavIndex={navIndex}
        right={
          <ButtonPrimary small onPress={handleExportJSON}>
            Export JSON
          </ButtonPrimary>
        }
      />
      <ResponsiveLayout>
        <Box paddingY={32}>
          <GridLayout
            template="3+9"
            left={
              <Stack space={64}>
                <Tabs
                  tabs={tabs}
                  selectedIndex={tabIndex}
                  onChange={setTabIndex}
                />

                {tabIndex === 0 ? (
                  <Stack space={40}>
                    <Stack space={24}>
                      <Title3>Skin palette colors</Title3>
                      <Text2 color={skinVars.colors.textSecondary}>
                        En base a los colores core se crea la paleta tonal usada
                        en los componentes. Puedes editar los colores core,
                        nombrarlos y añadir colores extra.
                      </Text2>
                    </Stack>
                    <BoxedRowList>
                      <ColorBox
                        colorKey="brandColor"
                        label="Brand"
                        showEditIcon={true}
                      />
                      <ColorBox
                        colorKey="errorColor"
                        label="Error"
                        showEditIcon={true}
                      />
                      <ColorBox
                        colorKey="warningColor"
                        label="Warning"
                        showEditIcon={true}
                      />
                      <ColorBox
                        colorKey="successColor"
                        label="Success"
                        showEditIcon={true}
                      />
                      <ColorBox
                        colorKey="promoColor"
                        label="Promo"
                        showEditIcon={true}
                      />
                      <ColorBox
                        colorKey="neutral1"
                        label="Neutral1"
                        showEditIcon={true}
                      />
                      <ColorBox
                        colorKey="neutral2"
                        label="Neutral2"
                        showEditIcon={true}
                      />
                      <ColorBox
                        colorKey="neutral3"
                        label="Neutral3"
                        showEditIcon={true}
                      />
                    </BoxedRowList>
                  </Stack>
                ) : (
                  <Stack space={40}>
                    <Stack space={24}>
                      <Title3>Tokens</Title3>
                      <Text2 color={skinVars.colors.textSecondary}>
                        Los tokens son valores transversale a todas las marcas a
                        los cuales se les asocia colores existentes en la paleta
                        de color.
                      </Text2>
                    </Stack>
                    <BoxedRowList>
                      <ColorBox
                        colorKey="brandColor"
                        label="Brand"
                        showEditIcon={true}
                      />
                    </BoxedRowList>
                  </Stack>
                )}
              </Stack>
            }
            right={
              <Box paddingTop={124}>
                {(navIndex === 0 && (
                  <Stack space={64}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,

                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Title3>Tonal Palette</Title3>
                      <div style={{ width: 480, textAlign: "center" }}>
                        <Text2
                          textAlign="center"
                          color={skinVars.colors.textSecondary}
                        >
                          Visualiza los colores de la paleta tonal derivados del
                          color principal, puedes editarlos y ver cuáles son
                          usados en los componentes.
                        </Text2>
                      </div>
                    </div>
                    <Align x="center" height="fit-content">
                      {Object.entries(colorScaleOutput).map(([key, scale]) =>
                        renderColorScale(key, scale, Stack, Inline)
                      )}
                    </Align>
                  </Stack>
                )) ||
                  (navIndex === 3 && (
                    <Stack space={64}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 24,

                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Title3>Preview</Title3>
                        <div style={{ width: 480, textAlign: "center" }}>
                          <Text2
                            textAlign="center"
                            color={skinVars.colors.textSecondary}
                          >
                            Visualiza los colores de la paleta tonal derivados
                            del color principal, puedes editarlos y ver cuáles
                            son usados en los componentes.
                          </Text2>
                        </div>
                      </div>
                      <Align x="center">
                        <Theme themeColors={{ ...colors, selectedColor }}>
                          <div className="preview-card">
                            <div
                              className="preview-header"
                              style={{ backgroundColor: colors.brandColor }}
                            >
                              <div className="preview-header-top">
                                <IconChevronLeftRegular />
                                <IconShareRegular />
                              </div>
                              <HeaderLayout
                                isInverse={true}
                                header={
                                  <Header
                                    headline="Hussle"
                                    title="Save on winter workouts with a free gym Day Pass"
                                  />
                                }
                                extra={
                                  <Inline space={16}>
                                    <Row
                                      asset={<IconTimeRegular />}
                                      title="Ends Tue 28 Feb"
                                    />
                                    <Row
                                      asset={<IconWifiRegular />}
                                      title="Online"
                                    />
                                  </Inline>
                                }
                              />
                            </div>
                            <div className="preview-content">
                              <Title2>At a glance</Title2>
                              <Row
                                asset={<IconCheckRegular />}
                                description="Enjoy day of access to over 1000 gyms nationwide"
                              />
                              <Row
                                asset={<IconCheckRegular />}
                                description="Only available for gyms with a Day Pass RRP of 15 or under"
                              />
                              <ButtonLayout
                                align="full-width"
                                primaryButton={
                                  <ButtonPrimary onPress={() => {}}>
                                    Use Now
                                  </ButtonPrimary>
                                }
                                secondaryButton={
                                  <ButtonSecondary onPress={() => {}}>
                                    Save
                                  </ButtonSecondary>
                                }
                              />
                            </div>
                          </div>
                        </Theme>
                      </Align>
                    </Stack>
                  ))}
              </Box>
            }
          />
        </Box>
      </ResponsiveLayout>
      <ColorDialog
        isOpen={isColorDialogOpen}
        onClose={handleCancelColor}
        onSave={handleSaveColor}
        colorName={skinName}
        onColorNameChange={setSkinName}
        colorValue={tempColor}
        onColorChange={handleColorChange}
      />
    </>
  );
};

export default ThemePreviewWithTools;
