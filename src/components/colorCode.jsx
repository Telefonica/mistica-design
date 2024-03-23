import { Inline, Text } from "@telefonica/mistica";
import styles from "./colorCode.module.css";

const ColorCode = ({ color }) => {
  return (
    <div className={styles.container}>
      <Inline space={4} alignItems="center">
        <div
          className={
            color === "#FFFFFF"
              ? `${styles.circleBorder}  ${styles.circleContainer}`
              : styles.circleContainer
          }
        >
          <div
            style={{
              background: `${color}`,
              height: 20,
              width: 20,
              borderRadius: "50%",
            }}
          ></div>
        </div>
        <Text>{color}</Text>
      </Inline>
    </div>
  );
};

export default ColorCode;
