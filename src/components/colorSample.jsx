import {
  Inline,
  Text,
  skinVars,
  Tag,
  IconCopyRegular,
  IconButton,
  Snackbar,
} from "@telefonica/mistica";
import { useState } from "react";
import styles from "./colorSample.module.css";

const ColorSample = ({ color, palette }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarDanger, setSnackbarDanger] = useState(false);

  const copyToClipboard = (color) => {
    navigator.clipboard
      .writeText(color)
      .then(() => {})
      .catch((error) => {
        console.error("Error copying text to clipboard:", error);
      });
  };

  return (
    <>
      <div
        className={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Inline space={8} alignItems="center">
          {color !== undefined ? (
            <div
              style={{
                outline: `1px solid ${
                  palette === ("white" || "grey1")
                    ? skinVars.colors.neutralMedium
                    : undefined
                }`,
                width: "fit-content",
                borderRadius: "50%",
              }}
            >
              <div
                style={{
                  background: color,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                }}
              ></div>
            </div>
          ) : (
            <Tag type="error">Undefined</Tag>
          )}
          <div style={{ maxWidth: 360 }}>
            <span>{color}</span>
          </div>
        </Inline>

        {isHovered ? (
          <IconButton
            onPress={() => {
              copyToClipboard(color);
              setSnackbarOpen(true);
            }}
            small
            Icon={IconCopyRegular}
          />
        ) : (
          <div style={{ width: 32, height: 32 }}></div>
        )}
      </div>
      {snackbarOpen && (
        <Snackbar
          message={`Color copied to clipboard`}
          onClose={() => setSnackbarOpen(false)}
        />
      )}
    </>
  );
};

export default ColorSample;
