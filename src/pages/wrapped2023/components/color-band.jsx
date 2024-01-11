import styles from "./color-band.module.css";
import { useScreenSize } from "@telefonica/mistica";

const ColorBand = ({ color, rotate, text, origin, top }) => {
  const { isMobile } = useScreenSize();

  return (
    <div
      className={styles.band}
      style={{
        background: color,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: origin ?? "center",
        margin: 8,
        top: top ?? 0,
      }}
    >
      <span className={styles.text}>{text.repeat(10)}</span>
    </div>
  );
};

export default ColorBand;
