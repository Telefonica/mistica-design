// Componente ColorDialog actualizado para src/pages/skin-tool/components/color-input.jsx

import React from "react";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonLayout,
  skinVars,
  Stack,
  Text2,
  BoxedRow,
  BoxedRowList,
  Sheet,
  SheetBody,
  Text1,
  Input,
  Box,
  Text5,
  Text3,
  TextField,
  Grid,
  GridItem,
  Divider,
  Checkbox,
} from "@telefonica/mistica";

import "./color-input.css";

// Componente principal para el selector de color
const ColorDialog = ({
  isOpen,
  onClose,
  onSave,
  colorName,
  onColorNameChange,
  colorValue,
  onColorChange,

  // Props para el modo de selección de paleta
  mode = "edit", // "edit", "create" o "palette"
  availableColors = {},
  currentColorKey,
  onSelectColor,
}) => {
  // Si no está abierto, no mostramos nada
  if (!isOpen) return null;

  // Determinar el título según el modo
  const getDialogTitle = () => {
    if (mode === "create") return "Nuevo color personalizado";
    if (mode === "edit") return "Editar color";
    return currentColorKey || "Seleccionar color";
  };

  // Determinar el texto del botón según el modo
  const getButtonText = () => {
    if (mode === "create") return "Crear";
    return "Guardar";
  };

  return (
    <Sheet onClose={onClose}>
      {({ modalTitleId }) => (
        <SheetBody title={getDialogTitle()} modalTitleId={modalTitleId}>
          <Box paddingBottom={{ mobile: 16, desktop: 0 }} paddingTop={40}>
            {mode === "edit" || mode === "create" ? (
              <Stack space={24}>
                <Grid columns={2} gap={24}>
                  <input
                    type="color"
                    value={colorValue}
                    onChange={(e) => onColorChange(e.target.value)}
                  />
                  <Stack space={16}>
                    <TextField
                      label={mode === "create" ? "Color name" : "Color name"}
                      value={colorName}
                      onChange={(e) => onColorNameChange(e.target.value)}
                      fullWidth
                      placeholder={mode === "create" ? "Oceanic blue" : ""}
                    />
                    <Stack space={8}>
                      <TextField
                        label="HEX #"
                        value={colorValue}
                        onChange={(e) => onColorChange(e.target.value)}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                </Grid>
                <Stack space={56}>
                  {mode === "edit" && (
                    <Checkbox name="checkbox" defaultChecked>
                      <Stack space={8}>
                        Activar cambio automático de la paleta tonal
                        <Text2 color={skinVars.colors.textSecondary}>
                          If you change a core color of the palette, the derived
                          tones will automatically change, taking the new color
                          as reference.
                        </Text2>
                      </Stack>
                    </Checkbox>
                  )}

                  <ButtonLayout
                    align="full-width"
                    primaryButton={
                      <ButtonPrimary
                        onPress={() => {
                          onSave();
                        }}
                      >
                        {getButtonText()}
                      </ButtonPrimary>
                    }
                    secondaryButton={
                      <ButtonSecondary onPress={onClose} type="secondary">
                        Cancelar
                      </ButtonSecondary>
                    }
                  />
                </Stack>
              </Stack>
            ) : (
              // Modo selección de paleta
              <Stack space={24}>
                <Box paddingTop={40}>
                  <Stack space={16}>
                    <BoxedRowList>
                      {Object.entries(availableColors)
                        .filter(([key, value]) => value && value.trim() !== "")
                        .map(([key, value]) => (
                          <BoxedRow
                            key={key}
                            asset={
                              <Box
                                style={{
                                  backgroundColor: value,
                                  width: 40,
                                  height: 40,
                                  border: `1px solid ${skinVars.colors.border}`,
                                  borderRadius: "8px",
                                }}
                              />
                            }
                            title={key}
                            description={value.toUpperCase()}
                            onPress={() => {
                              onSelectColor(key, value);
                              onClose();
                            }}
                            withChevron={false}
                          />
                        ))}
                    </BoxedRowList>
                    <ButtonLayout
                      align="full-width"
                      secondaryButton={
                        <ButtonSecondary onPress={onClose} type="secondary">
                          Cancelar
                        </ButtonSecondary>
                      }
                    />
                  </Stack>
                </Box>
              </Stack>
            )}
          </Box>
        </SheetBody>
      )}
    </Sheet>
  );
};

export default ColorDialog;
