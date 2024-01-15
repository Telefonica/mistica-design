import styles from "./golden-graph.module.css";
import { formatCount } from "../utils";
import { Text } from "@telefonica/mistica";

const GoldenGraph = ({ items }) => {
  return (
    <ul className={styles.graph}>
      {items.map((item, index) => (
        <li key={item.name} className={styles.column}>
          <div>
            #{index + 2} {item.name}
          </div>
          <div
            className={styles.bar}
            style={{ height: (item.count * 100) / 50000, minWidth: 100 }}
          >
            <div>
              <span className={styles.barText}>{formatCount(item.count)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GoldenGraph;
