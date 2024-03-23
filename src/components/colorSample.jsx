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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
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
            onClick={copyToClipboard()}
            small
            Icon={IconCopyRegular}
          />
        ) : (
          <div style={{ width: 32, height: 32 }}></div>
        )}
      </div>
    </>
  );
};

export default ColorSample;
