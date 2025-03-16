// Actualización de ThemePreviewWithTools para usar el ColorDialog modificado
// para ambos casos: editar colores y seleccionar desde paleta

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
import { colorTokens } from "./utils/skin-contract.js";
import { getColorScale, renderColorScale } from "./utils/color-utils";
import Theme from "./utils/theme";
import ColorDialog from "./components/color-input";
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

  // Nuevos estados para la selección desde paleta
  const [isPaletteSelectorOpen, setIsPaletteSelectorOpen] = useState(false);
  const [currentTokenKey, setCurrentTokenKey] = useState(null);

  // Temporary color value used in the color dialog before saving
  const [tempColor, setTempColor] = useState("#0072F0");

  // Array defining the sections available in the navigation bar
  const sections = [
    { title: "Color", onPress: () => setNavIndex(0) },
    { title: "Typography", onPress: () => setNavIndex(1) },
    { title: "Border", onPress: () => setNavIndex(2) },
    { title: "Skin Preview", onPress: () => setNavIndex(3) },
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
      // El color anterior que estamos cambiando
      const oldColorValue = colors[currentColorKey];

      // El nuevo valor del color
      const newColorValue = tempColor;

      let newColors = {
        ...colors,
        [currentColorKey]: newColorValue,
      };

      // Actualizar todos los tokens que usan el color anterior
      // pero solo si estamos editando un color de la paleta
      const paletteColorKeys = [
        "brandColor",
        "errorColor",
        "warningColor",
        "successColor",
        "promoColor",
        "neutral1",
        "neutral2",
        "neutral3",
      ];

      if (paletteColorKeys.includes(currentColorKey)) {
        // Recorrer todos los colores para encontrar tokens que usan el color anterior
        Object.entries(colors).forEach(([key, value]) => {
          // Solo actualizar tokens, no colores de la paleta
          if (!paletteColorKeys.includes(key) && value === oldColorValue) {
            // Este token usa el color que estamos cambiando, actualízalo
            newColors[key] = newColorValue;
          }
        });
      }

      setColors(newColors);
      setSelectedColor(newColorValue);
      setColorScaleOutput({
        [currentColorKey]: getColorScale(newColorValue),
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

  // Estado para rastrear el token actualmente seleccionado
  const [selectedTokenKey, setSelectedTokenKey] = useState(null);

  // Función para abrir el selector de paleta para un token específico
  const openPaletteSelector = (tokenKey) => {
    setCurrentTokenKey(tokenKey);
    setSelectedTokenKey(tokenKey); // Guardar el token seleccionado
    setIsPaletteSelectorOpen(true);
  };

  // Función para manejar la selección de un color de la paleta
  const handleSelectPaletteColor = (sourceKey, colorValue) => {
    // Actualiza el color seleccionado del token
    const newColors = {
      ...colors,
      [currentTokenKey]: colorValue,
      // También podríamos guardar una relación entre token y color de paleta aquí si fuera necesario
    };
    setColors(newColors);
    localStorage.setItem("skinColors", JSON.stringify(newColors));
    setIsPaletteSelectorOpen(false);
    setSelectedTokenKey(null); // Limpiar la selección
  };

  // Función que se llama al cerrar el selector de paleta
  const handleClosePaletteSelector = () => {
    setIsPaletteSelectorOpen(false);
    setSelectedTokenKey(null); // Limpiar la selección cuando se cierra
  };

  // Component to render a single color box with optional edit icon
  const ColorBox = ({ colorKey, label, showEditIcon = false }) => {
    // Verificar si este color está seleccionado actualmente
    const isSelected = selectedColorKey === colorKey;

    return (
      <div
        style={{
          transition: "all 0.08s ease-in-out",
          outline: isSelected ? `2px solid ${skinVars.colors.brand}` : "none",
          outlineOffset: isSelected ? "2px" : "0px",
          borderRadius: "8px",
        }}
      >
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
      </div>
    );
  };

  // Función para encontrar el nombre del color de la paleta por su valor
  const findPaletteColorName = (colorValue) => {
    if (!colorValue) return "Definir color";

    // Normalizar el valor de color (convertir a minúsculas para evitar problemas de case sensitivity)
    const normalizedColorValue = colorValue.toLowerCase();

    // Definir cuáles son las claves de los colores de la paleta
    const paletteColorKeys = [
      "brandColor",
      "errorColor",
      "warningColor",
      "successColor",
      "promoColor",
      "neutral1",
      "neutral2",
      "neutral3",
    ];

    // Convertir los nombres internos a nombres más amigables
    const friendlyNames = {
      brandColor: "Brand",
      errorColor: "Error",
      warningColor: "Warning",
      successColor: "Success",
      promoColor: "Promo",
      neutral1: "Neutral 1",
      neutral2: "Neutral 2",
      neutral3: "Neutral 3",
    };

    // Busca solo en los colores de la paleta si hay alguna coincidencia con el valor
    for (const key of paletteColorKeys) {
      const paletteColor = colors[key];
      if (paletteColor && paletteColor.toLowerCase() === normalizedColorValue) {
        return friendlyNames[key] || key;
      }
    }

    // Si no se encuentra coincidencia, devolver el valor hexadecimal
    return colorValue.toUpperCase();
  };

  // Componente para renderizar un token de color con su nombre y valor
  const SkinTokens = ({ colorKey, label, showEditIcon = false }) => {
    // Obtener el valor del color para este token
    const colorValue = colors[colorKey] || "";

    // Buscar el nombre del color en la paleta
    const colorSource = findPaletteColorName(colorValue);

    // Verificar si este token está seleccionado actualmente
    const isSelected = selectedTokenKey === colorKey;

    return (
      <div
        style={{
          transition: "all 0.08s ease-in-out",
          outline: isSelected ? `2px solid ${skinVars.colors.brand}` : "none",
          outlineOffset: isSelected ? "2px" : "0px",
          borderRadius: "8px",
        }}
      >
        <BoxedRow
          asset={
            <div
              style={{
                backgroundColor: colorValue || "#FFFFFF",
                width: 40,
                height: 40,
                border: `1px solid ${skinVars.colors.border}`,
                borderRadius: "999px",
              }}
            />
          }
          onPress={() => openPaletteSelector(colorKey)}
          withChevron={false}
          extra={
            <Stack space={4}>
              <Text1 medium>{colorKey}</Text1>
              <Text2>{colorValue ? colorSource : "Definir color"}</Text2>
            </Stack>
          }
        />
      </div>
    );
  };

  // Function to render a group of color tokens
  const renderColorTokenGroup = (
    groupName,
    tokenGroup,
    showEditIcon = true
  ) => {
    return (
      <Stack space={24} key={groupName}>
        <Title1>{groupName}</Title1>
        <Stack space={-1}>
          {Object.entries(tokenGroup).map(([tokenKey, tokenLabel]) => (
            <SkinTokens
              key={tokenKey}
              colorKey={tokenKey}
              label={tokenLabel}
              showEditIcon={showEditIcon}
            />
          ))}
        </Stack>
      </Stack>
    );
  };

  //Main render function for the component ColorBox
  return (
    <>
      <MainNavigationBar
        logo={<MisticaLogo size={250} type="imagotype" />}
        sections={sections}
        selectedIndex={navIndex}
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
                  tabs={[{ text: "Palette" }, { text: "Tokens" }]}
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
                        Los tokens son valores transversales a todas las marcas
                        a los cuales se les asocia colores existentes en la
                        paleta de color.
                      </Text2>
                    </Stack>
                    <Stack space={40}>
                      {Object.entries(colorTokens).map(
                        ([groupName, tokenGroup]) =>
                          renderColorTokenGroup(groupName, tokenGroup)
                      )}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            }
            right={
              <div
                style={{
                  height: "calc(100vh - 248px)",
                  position: "sticky",
                  top: 248,
                }}
              >
                <Box paddingTop={0}>
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
                            Visualiza los colores de la paleta tonal derivados
                            del color principal, puedes editarlos y ver cuáles
                            son usados en los componentes.
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
              </div>
            }
          />
        </Box>
      </ResponsiveLayout>

      {/* Color Dialog para editar colores de la paleta */}
      <ColorDialog
        isOpen={isColorDialogOpen}
        onClose={handleCancelColor}
        onSave={handleSaveColor}
        colorName={skinName}
        onColorNameChange={setSkinName}
        colorValue={tempColor}
        onColorChange={handleColorChange}
        mode="edit"
      />

      {/* Color Dialog para seleccionar colores de la paleta para los tokens */}
      <ColorDialog
        isOpen={isPaletteSelectorOpen}
        onClose={handleClosePaletteSelector}
        mode="palette"
        currentColorKey={currentTokenKey}
        availableColors={{
          brandColor: colors.brandColor || "",
          errorColor: colors.errorColor || "",
          warningColor: colors.warningColor || "",
          successColor: colors.successColor || "",
          promoColor: colors.promoColor || "",
          neutral1: colors.neutral1 || "",
          neutral2: colors.neutral2 || "",
          neutral3: colors.neutral3 || "",
        }}
        onSelectColor={handleSelectPaletteColor}
      />
    </>
  );
};

export default ThemePreviewWithTools;
