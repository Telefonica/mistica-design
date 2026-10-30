import { Stack, useScreenSize, Text, Inline } from "@telefonica/mistica";
import styles from "./new-components.module.css";
import { newComponents } from "../data/figmaData";
import SectionTitle from "../components/section-title";
import { newComponentsSubtitle } from "../data/texts";
import {
  FigureLeftBottom,
  FigureLeftTop,
  FigureRightBottom,
  FigureRightTop,
} from "../components/svg-figures";
import ContentContainer from "../components/content-container";

const NewComponents = () => {
  const { isMobile, isTablet } = useScreenSize();

  const listColors = [
    "var(--yellow)",
    "var(--red)",
    "var(--green)",
    "var(--purple)",
  ];

  const generateRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * listColors.length);
    return listColors[randomIndex];
  };

  return (
    <ContentContainer overflowY={true}>
      <div className={styles.content}>
        <Stack space={0}>
          <div
            className={styles.listContainer}
            style={{ width: isMobile ? "100vw" : 400, padding: "0 16px" }}
          >
            <ul className={styles.list}>
              {newComponents.map((component, index) => (
                <li
                  key={component.name}
                  style={{
                    borderBottom: `${
                      isMobile ? "3px" : "6px"
                    } solid ${generateRandomColor()}`,
                    paddingBottom: isMobile ? 4 : 8,
                  }}
                >
                  <Text size={isMobile ? 18 : 24} weight="bold">
                    {index + 1}. {component.name}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </Stack>
      </div>
      {isMobile ? (
        <></>
      ) : (
        <div
          className={styles.figures}
          style={{ width: isTablet ? "110vw" : "85vw" }}
        >
          <div className={styles.figuresLeft}>
            <FigureLeftTop></FigureLeftTop>
            <FigureLeftBottom></FigureLeftBottom>
          </div>
          <div className={styles.figuresRight}>
            <FigureRightTop></FigureRightTop>
            <FigureRightBottom></FigureRightBottom>
          </div>
        </div>
      )}
    </ContentContainer>
  );
};

export default NewComponents;
