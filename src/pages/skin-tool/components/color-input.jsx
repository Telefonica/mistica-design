// This file defines the `ColorDialog` component, a modal dialog for editing a color's name and value.
// It provides inputs for text and color selection, with save and cancel options.
// It is used within the ThemePreviewWithTools component.

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
} from "@telefonica/mistica";
import "./color-input.css";

const ColorDialog = ({
  isOpen,
  onClose,
  onSave,
  colorName,
  onColorNameChange,
  colorValue,
  onColorChange,
  // Nuevos props para el modo de selección de paleta
  mode = "edit", // "edit" o "palette"
  availableColors = {},
  currentColorKey,
  onSelectColor,
}) => {
  //Return null if the dialog is not open
  if (!isOpen) return null;

  // Solo para el modo "palette": Obtiene los colores disponibles en la paleta (excluyendo valores vacíos)
  const validColors =
    mode === "palette"
      ? Object.entries(availableColors).filter(
          ([key, value]) => value && value.trim() !== ""
        )
      : [];

  return (
    <>
      <div className="color-dialog-overlay" onClick={onClose}>
        <div className="color-dialog" onClick={(e) => e.stopPropagation()}>
          {mode === "edit" ? (
            // Modo edición - el original
            <>
              <h2>Core palette color</h2>
              <input
                type="text"
                value={colorName}
                onChange={(e) => onColorNameChange(e.target.value)}
                placeholder="Name"
                style={{
                  width: "100%",
                  marginBottom: "16px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: `1px solid ${skinVars.colors.border}`,
                }}
              />
              <input
                type="color"
                value={colorValue}
                onChange={(e) => onColorChange(e.target.value)}
                style={{ marginBottom: "16px", width: "100%" }}
              />
              <input
                type="text"
                value={colorValue}
                onChange={(e) => onColorChange(e.target.value)}
                placeholder="HEX #"
                style={{
                  width: "100%",
                  marginBottom: "16px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: `1px solid ${skinVars.colors.border}`,
                }}
              />
              <p
                style={{
                  marginBottom: "16px",
                  color: skinVars.colors.textSecondary,
                }}
              >
                If you change a core color of the palette, the derived tones
                will automatically change, taking the new color as reference.
              </p>
              <ButtonLayout
                align="full-width"
                primaryButton={
                  <ButtonPrimary onPress={onSave}>Save</ButtonPrimary>
                }
                secondaryButton={
                  <ButtonSecondary onPress={onClose} type="secondary">
                    Cancel
                  </ButtonSecondary>
                }
              />
            </>
          ) : (
            // Modo selección de paleta
            <>
              <h2>Seleccionar color de la paleta</h2>
              <Stack space={16} style={{ marginBottom: "16px" }}>
                <Text2 color={skinVars.colors.textSecondary}>
                  Selecciona un color de la paleta para asignarlo al token:{" "}
                  <Text2 weight="medium">{currentColorKey}</Text2>
                </Text2>

                <BoxedRowList>
                  {validColors.map(([key, value]) => (
                    <BoxedRow
                      key={key}
                      asset={
                        <div
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
                      onPress={() => onSelectColor(key, value)}
                      withChevron={false}
                    />
                  ))}
                </BoxedRowList>
              </Stack>
              <ButtonLayout
                align="full-width"
                secondaryButton={
                  <ButtonSecondary onPress={onClose} type="secondary">
                    Cancel
                  </ButtonSecondary>
                }
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ColorDialog;
