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
} from "@telefonica/mistica";
import getColorScale from "./utils/getColorScale";
import Theme from "./utils/theme";
import ColorDialog from "./utils/color-input";

// Component definition for ThemePreviewWithTools
const ThemePreviewWithTools = () => {
  // State to track the currently selected section index in the navigation bar
  const [index, setIndex] = useState(0);

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
    { title: "Color Palette", onPress: () => setIndex(0) },
    { title: "Preview", onPress: () => setIndex(1) },
    { title: "Typography", onPress: () => setIndex(2) },
    { title: "Border", onPress: () => setIndex(3) },
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
      <div
        className="each-color"
        onClick={() => handleColorClick(colorKey)}
        style={{
          cursor: "pointer",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor:
            selectedColor === colors[colorKey]
              ? "rgba(0, 0, 0, 0.05)"
              : "transparent",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          marginBottom: "16px",
          width: "100%",
        }}
      >
        <div
          className="color-preview"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: colors[colorKey] || "#FFFFFF",
            border: `2px solid ${skinVars.colors.border}`,
            borderRadius: "8px",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            marginLeft: "16px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Text2 weight="medium">{label}</Text2>
          <Text1 color={skinVars.colors.textSecondary}>
            {colors[colorKey]
              ? colors[colorKey].toUpperCase()
              : "Definir color"}
          </Text1>
        </div>
        {showEditIcon && (
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <IconButton
              onPress={() => openColorDialog(colorKey)}
              Icon={IconEditPencilRegular}
              type="brand"
            />
          </div>
        )}
      </div>
    );
  };

  //Main render function for the component ColorBox
  return (
    <>
      <style>{`
        .color-list {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .color-preview {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .color-swatch-large {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          margin: 4px;
        }
        .preview-section {
          flex-grow: 1;
        }
        .preview-card {
          width: 384px;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        .preview-header {
          padding: 24px;
          color: white;
        }
        .preview-header-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .preview-content {
          padding: 24px;
        }
      `}</style>
      <ResponsiveLayout>
        <MainNavigationBar
          sections={sections}
          selectedIndex={index}
          right={
            <ButtonPrimary small onPress={handleExportJSON}>
              Export JSON
            </ButtonPrimary>
          }
        />

        {index === 0 && (
          <div
            style={{
              display: `flex`,
              justifyContent: "space-between",
              padding: `32px`,
            }}
          >
            <div style={{ width: "280px", flexShrink: 0 }}>
              <Text2>Core palette colors</Text2>
              <div className="color-list">
                <ColorBox
                  colorKey="brandColor"
                  label="Brand"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="errorColor"
                  label="Error"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="warningColor"
                  label="Warning"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="successColor"
                  label="Success"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="promoColor"
                  label="Promo"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="neutral1"
                  label="Neutral1"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="neutral2"
                  label="Neutral2"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="neutral3"
                  label="Neutral3"
                  showEditIcon={false}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 600,
                gap: "32px",
              }}
            >
              <Text5>Primary colors</Text5>
              <Text2 color={skinVars.colors.textSecondary}>
                Based on the core color of the palette, the rest of the colors
                are derived. You can manually adjust each derived color if you
                need to.
              </Text2>
              {selectedColorKey && (
                <ColorBox
                  colorKey={selectedColorKey}
                  label={selectedColorKey}
                  showEditIcon={true}
                />
              )}
              {Object.entries(colorScaleOutput).map(([key, scale]) => (
                <div key={key}>
                  <Text2>{key.replace("Color", "")} Scale</Text2>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", marginTop: 16 }}
                  >
                    {scale.map((color, index) => (
                      <div
                        key={index}
                        className="color-swatch-large"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {index === 1 && (
          <div style={{ display: `flex`, gap: `32px`, padding: `32px` }}>
            <div style={{ width: "280px", flexShrink: 0 }}>
              <Text2>Core palette colors</Text2>
              <div className="color-list">
                <ColorBox
                  colorKey="brandColor"
                  label="Brand"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="errorColor"
                  label="Error"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="warningColor"
                  label="Warning"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="successColor"
                  label="Success"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="promoColor"
                  label="Promo"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="neutral1"
                  label="Neutral1"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="neutral2"
                  label="Neutral2"
                  showEditIcon={false}
                />
                <ColorBox
                  colorKey="neutral3"
                  label="Neutral3"
                  showEditIcon={false}
                />
              </div>
            </div>
            <div className="preview-section">
              <Title1>Preview</Title1>
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
                          <Row asset={<IconWifiRegular />} title="Online" />
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
            </div>
          </div>
        )}
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
