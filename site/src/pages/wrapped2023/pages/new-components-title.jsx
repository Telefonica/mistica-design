import { Stack, useScreenSize, Text, Inline } from "@telefonica/mistica";
import styles from "./new-components-title.module.css";
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

const NewComponentsTitle = () => {
  const { isMobile } = useScreenSize();

  return (
    <ContentContainer>
      <SectionTitle
        align="center"
        title={newComponents.length}
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isMobile ? "100" : "305"}
            height={isMobile ? "auto" : "109"}
            viewBox="0 0 305 109"
            fill="none"
          >
            <path
              d="M18.9802 105H0.220215V7.00004H24.7202L60.0002 74.48H62.8002V7.00004H81.4202V105H56.9202L21.7802 37.52H18.9802V105Z"
              fill="#E66C64"
            />
            <path
              d="M161.579 1.96004L162.139 1.82004C164.519 5.60004 166.899 14.28 166.899 23.66C166.899 29.96 165.359 38.22 159.479 38.22C148.979 38.22 142.959 9.10004 123.499 9.10004C118.739 9.10004 103.899 11.2 108.379 28.98C115.659 58.1 152.059 38.5 152.059 50.12C152.059 57.54 137.779 52.64 130.639 52.5C116.219 52.22 108.659 68.46 116.919 81.48C132.179 105.42 158.919 107.52 165.359 93.3801C172.639 77.42 141.559 73.6401 139.459 81.0601C138.899 83.3001 139.039 84.5601 141.699 87.6401L140.999 88.0601C133.579 80.5001 126.159 66.92 130.079 62.0201C139.599 49.9801 175.999 69.16 167.039 93.66C158.219 117.6 87.939 113.96 87.939 76.86C87.939 47.32 131.059 50.12 139.039 50.12V49.28C131.759 49 89.479 47.32 89.479 21.56C89.479 14.42 92.699 0.700041 108.239 0.700041C127.839 0.560043 138.759 18.34 152.619 18.34C159.059 18.34 165.079 9.24005 161.579 1.96004Z"
              fill="#E66C64"
            />
            <path
              d="M218.905 105H193.285L169.205 7.00004H189.505L205.885 75.32H208.685L226.465 7.00004H247.885L265.665 75.32H268.465L284.705 7.00004H305.005L281.065 105H255.445L238.505 38.5H235.705L218.905 105Z"
              fill="#E66C64"
            />
          </svg>
        }
        title2="Components"
        subtitle={newComponentsSubtitle}
      />
      {isMobile ? (
        <div className={styles.figuresMobile}>
          <div className={styles.figuresLeft}>
            <FigureLeftTop></FigureLeftTop>
            <FigureLeftBottom></FigureLeftBottom>
          </div>
          <div className={styles.figuresRight}>
            <FigureRightTop></FigureRightTop>
            <FigureRightBottom></FigureRightBottom>
          </div>
        </div>
      ) : (
        <></>
      )}
    </ContentContainer>
  );
};

export default NewComponentsTitle;
