import ColorStar from "../components/color-star";
import styles from "./intro.module.css";
import { Stack, Text5 } from "@telefonica/mistica";
import { Intro as IntroText } from "../data/texts";
import SectionTitle from "../components/section-title";
import ContentContainer from "../components/content-container";

const Intro = () => {
  return (
    <ContentContainer>
      <SectionTitle
        isSmall
        align="center"
        svg={<ColorStar />}
        subtitle={IntroText}
      />
    </ContentContainer>
  );
};

export default Intro;
