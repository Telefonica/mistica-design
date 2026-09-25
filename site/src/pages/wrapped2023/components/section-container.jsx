import styles from "./section-container.module.css";

const SectionContainer = ({ children, overflow, height = "100vh" }) => {
  return (
    <div
      className={`${styles.container}`}
      style={{ overflow: overflow ? "hidden" : "", height: height }}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
