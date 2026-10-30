import { useScreenSize } from "@telefonica/mistica";
import styles from "./content-container.module.css";

const ContentContainer = ({
  children,
  justify = "center",
  margin,
  overflowY = "hidden",
}) => {
  const { isMobile } = useScreenSize();
  return (
    <div
      style={{
        justifyContent: justify,
        margin: isMobile ? 0 : margin,
        overflowY: isMobile ? "inherit" : overflowY,
        gap: isMobile ? "1rem" : "2rem",
      }}
      className={`${
        isMobile ? styles.containerMobile : styles.containerDesktop
      }`}
    >
      {children}
    </div>
  );
};

export default ContentContainer;
