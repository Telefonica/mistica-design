// This file defines the `ColorDialog` component, a modal dialog for editing a color's name and value. 
// It provides inputs for text and color selection, with save and cancel options.
// It is used within the ThemePreviewWithTools component. 

// To-do: adapt this custom component to Mistica existing Dialog or Drawer component

import React from "react";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonLayout,
  skinVars,
} from "@telefonica/mistica";

const ColorDialog = ({
  isOpen,
  onClose,
  onSave,
  colorName,
  onColorNameChange,
  colorValue,
  onColorChange,
}) => {
  //Return null if the dialog is not open
  if (!isOpen) return null;

  return (
    <>
      <div className="color-dialog-overlay" onClick={onClose}>
        <div className="color-dialog" onClick={(e) => e.stopPropagation()}>
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
          <p style={{ marginBottom: "16px", color: skinVars.colors.textSecondary }}>
            If you change a core color of the palette, the derived tones will automatically change, taking the new color as reference.
          </p>
          <ButtonLayout
            align="full-width"
            primaryButton={<ButtonPrimary onPress={onSave}>Save</ButtonPrimary>}
            secondaryButton={<ButtonSecondary onPress={onClose} type="secondary">Cancel</ButtonSecondary>}
          />
        </div>
      </div>

      <style jsx>{`
        .color-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          width: 400px;
          z-index: 1000;
        }
        .color-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
      `}</style>
    </>
  );
};

export default ColorDialog;