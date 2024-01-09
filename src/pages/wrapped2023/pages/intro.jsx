import ColorStar from "../components/color-star";
import styles from "./intro.module.css";
import { Stack, Text, useScreenSize } from "@telefonica/mistica";
import { Intro as IntroText } from "../data/texts";
import SectionTitle from "../components/section-title";
import ContentContainer from "../components/content-container";

const Intro = () => {
  const { isMobile } = useScreenSize();
  return (
    <ContentContainer justify={isMobile ? "space-around" : "space-evenly"}>
      <SectionTitle isSmall align="center" svg={<ColorStar />} />

      <Text textAlign="center" size={isMobile ? 18 : 32}>
        {IntroText}
      </Text>
    </ContentContainer>
  );
};

export default Intro;
