import styles from "./subGrid.module.css";

const SubGrid = (props) => {
  return (
    <div
      className={`${styles.grid} ${styles[`columns-${props.columns}`]}`}
      style={{ gap: props.gap }}
    >
      {props.children}
    </div>
  );
};

export default SubGrid;
