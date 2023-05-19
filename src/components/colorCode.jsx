import { Circle, Inline, Text, Tooltip } from "@telefonica/mistica";
import styles from "./colorCode.module.css";
import hexToHsl from "../helpers/hexToHsl";
import rgbaToHex from "../helpers/rgbaToHex";
import hexToRgbA from "../helpers/hexToRgba";

const ColorCode = (props) => {
  let hex = props.color;
  let rgba = props.color;
  let hsl = "";

  if (props.color.startsWith("#")) {
    // Convert hex to RGBA and HSL
    rgba = hexToRgbA(props.color);
    hsl = hexToHsl(props.color);
  } else if (props.color.startsWith("rgba")) {
    // Convert RGBA to hex and HSL
    hex = rgbaToHex(props.color);
    hsl = hexToHsl(props.color);
  }

  return (
    <div className={styles.container}>
      <Inline space={4} alignItems="center">
        <div
          className={
            props.color === "#FFFFFF"
              ? `${styles.circleBorder}  ${styles.circleContainer}`
              : styles.circleContainer
          }
        >
          <Tooltip
            target={<Circle size={16} backgroundColor={props.color} />}
            description={
              <div className={styles.tooltip}>
                <div className={styles.tooltipRow}>
                  <Text size="small" weight="medium">
                    {hex}
                  </Text>
                </div>
                <div className={styles.tooltipRow}>
                  <Text size="small" weight="medium">
                    {rgba}
                  </Text>
                </div>
                <div className={styles.tooltipRow}>
                  <Text size="small" weight="medium">
                    {hsl}
                  </Text>
                </div>
              </div>
            }
          ></Tooltip>
        </div>
        <Text>{props.color}</Text>
      </Inline>
    </div>
  );
};

export default ColorCode;
