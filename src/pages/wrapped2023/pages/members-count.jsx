import styles from "./members-count.module.css";
import { Circle } from "../components/teams-svg";
import planets from "../assets/planets.png";
import {
  Stack,
  Text,
  useScreenSize,
  ThemeVariant,
  Text3,
} from "@telefonica/mistica";
import { members } from "../data/texts";
import { teamsMembers } from "../data/teamsData";
import SectionTitle from "../components/section-title";
import { Ovni } from "../components/ovni-svg";
import ContentContainer from "../components/content-container";

const Members = () => {
  const { isMobile } = useScreenSize();

  return (
    <ContentContainer>
      <img
        className={isMobile ? styles.bgImageMobile : styles.bgImageDesktop}
        src={planets}
        alt="planets"
      />
      <Circle></Circle>
      <ThemeVariant isInverse>
        <SectionTitle
          isSmall
          align="center"
          title="+36%"
          subtitle="from last year"
        ></SectionTitle>
      </ThemeVariant>
      <div
        className={
          isMobile ? styles.bottomTextMobile : styles.bottomTextDesktop
        }
      >
        <Stack space={16}>
          <Ovni></Ovni>
          <Text3>welcome to the team!</Text3>
        </Stack>
      </div>
    </ContentContainer>
  );
};

export default Members;
