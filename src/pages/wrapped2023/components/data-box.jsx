import { Text3, Inline } from "@telefonica/mistica";
import styles from "./data-box.module.css";

const DataBox = ({ title, description }) => (
  <div className={styles.container}>
    <div className={styles.header}></div>
    <div className={styles.body}>
      <div className={styles.content}>
        <Inline alignItems="baseline">
          <span className={styles.title}>{title}</span>
          <Text3>{description}</Text3>
        </Inline>
      </div>
    </div>
  </div>
);
export default DataBox;
