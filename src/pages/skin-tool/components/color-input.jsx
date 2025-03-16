// Este archivo define el componente `ColorDialog` usando el Sheet nativo de Mística.
// Proporciona la misma funcionalidad que la versión personalizada anterior,
// pero utilizando componentes nativos de Mística para mejor consistencia de UI.

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
  Text3,
  Text5,
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
  mode = "edit", // "edit" o "palette"
  availableColors = {},
  currentColorKey,
  onSelectColor,
}) => {
  // Si no está abierto, no mostramos nada
  if (!isOpen) return null;

  return (
    <Sheet onClose={onClose}>
      {({ modalTitleId }) => (
        <SheetBody modalTitleId={modalTitleId}>
          <Box paddingBottom={{ mobile: 16, desktop: 0 }}>
            {mode === "edit" ? (
              <Stack space={24}>
                <Text5>Core palette color</Text5>
                <Grid columns={2} gap={24}>
                  <input
                    type="color"
                    value={colorValue}
                    onChange={(e) => onColorChange(e.target.value)}
                  />
                  <Stack space={16}>
                    <TextField
                      label="Name"
                      value={colorName}
                      onChange={(e) => onColorNameChange(e.target.value)}
                      fullWidth
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
                  <Checkbox name="checkbox" defaultChecked>
                    <Stack space={8}>
                      Activar cambio automático de la paleta tonal
                      <Text2 color={skinVars.colors.textSecondary}>
                        If you change a core color of the palette, the derived
                        tones will automatically change, taking the new color as
                        reference.
                      </Text2>
                    </Stack>
                  </Checkbox>

                  <ButtonLayout
                    align="full-width"
                    primaryButton={
                      <ButtonPrimary
                        onPress={() => {
                          onSave();
                          onClose();
                        }}
                      >
                        Save
                      </ButtonPrimary>
                    }
                    secondaryButton={
                      <ButtonSecondary onPress={onClose} type="secondary">
                        Cancel
                      </ButtonSecondary>
                    }
                  />
                </Stack>
              </Stack>
            ) : (
              // Modo selección de paleta
              <Stack space={24}>
                <Text5>{currentColorKey}</Text5>
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
                        Cancel
                      </ButtonSecondary>
                    }
                  />
                </Stack>
              </Stack>
            )}
          </Box>
        </SheetBody>
      )}
    </Sheet>
  );
};

export default ColorDialog;
