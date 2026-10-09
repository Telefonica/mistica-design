import ColorStar from "../components/color-star";
import styles from "./intro.module.css";
import { Stack, Text, useScreenSize } from "@telefonica/mistica";
import { Intro as IntroText } from "../data/texts";
import SectionTitle from "../components/section-title";
import ContentContainer from "../components/content-container";

const Intro = () => {
  const { isMobile } = useScreenSize();
  return (
    <ContentContainer>
      <SectionTitle isSmall align="center" svg={<ColorStar />} />
      <div
        style={{ maxWidth: isMobile ? "24ch" : "inherit", textAlign: "center" }}
      >
        <Text textAlign="center" size={isMobile ? 18 : 32}>
          {IntroText}
        </Text>
      </div>
    </ContentContainer>
  );
};

export default Intro;
