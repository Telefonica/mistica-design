import styles from "./cover.module.css";
import YearSvg from "../components/year-svg";
import ColorBand from "../components/color-band";
import { Stack, Text6, useScreenSize, ThemeVariant } from "@telefonica/mistica";
import { cover } from "../data/texts";

const Cover = () => {
  const { isMobile } = useScreenSize();

  return (
    <div className={styles.container}>
      <div className={isMobile ? styles.yearMobile : styles.yearDesktop}>
        <Stack space={16}>
          <YearSvg></YearSvg>
          <ThemeVariant isInverse>
            <Text6>{cover}</Text6>
          </ThemeVariant>
        </Stack>
      </div>
      <ColorBand
        color="#59C2C9"
        rotate="60"
        origin="50%"
        text="#wrapped’23"
        index={50}
      ></ColorBand>
      <ColorBand
        color="#EAC344"
        rotate="60"
        origin="60%"
        text="#wrapped’23"
      ></ColorBand>
      <ColorBand
        color="#E66C64"
        rotate="-35"
        origin="45%"
        text="#wrapped’23"
      ></ColorBand>
      <ColorBand
        color="#C466EF"
        rotate="-60"
        origin="65%"
        text="#wrapped’23"
        index={60}
      ></ColorBand>
    </div>
  );
};

export default Cover;
