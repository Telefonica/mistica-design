import styles from "./list.module.css";
import { Text, useScreenSize, Inline } from "@telefonica/mistica";

const List = ({ content }) => {
  const { isMobile } = useScreenSize();
  return (
    <ul className={styles.listContainer}>
      {content.map((item) => (
        <li className={styles.listItem}>
          <Text size={isMobile ? 20 : 32} weight="bold">
            {item.name}
          </Text>
          <Text size={isMobile ? 18 : 32}>{item.count} discussions</Text>
        </li>
      ))}
    </ul>
  );
};

export default List;
