import styles from "./margin-layout.module.css";
const { useScreenSize } = require("@telefonica/mistica");

const MarginLayout = ({ children }) => {
  const { isMobile } = useScreenSize();
  return (
    <div className={isMobile ? styles.containerMobile : ""}>{children}</div>
  );
};

export default MarginLayout;
