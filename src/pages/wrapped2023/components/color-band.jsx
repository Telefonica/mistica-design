import styles from "./color-band.module.css";
import { useScreenSize } from "@telefonica/mistica";

const ColorBand = ({ color, rotate, text, origin, index }) => {
  const { isMobile } = useScreenSize();

  return (
    <div
      className={styles.container}
      style={{ zIndex: isMobile ? 0 : index ?? 1 }}
    >
      <div
        className={styles.band}
        style={{
          background: color,
          transform: `rotate(${rotate}deg)`,
          transformOrigin: origin ?? "center",
          margin: 8,
        }}
      >
        <span className={styles.text}>{text.repeat(10)}</span>
      </div>
    </div>
  );
};

export default ColorBand;
