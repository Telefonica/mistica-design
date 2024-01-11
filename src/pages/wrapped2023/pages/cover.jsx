import styles from "./cover.module.css";
import YearSvg from "../components/year-svg";
import ColorBand from "../components/color-band";
import {
  Stack,
  Text,
  useScreenSize,
  ThemeVariant,
  Inline,
  Box,
} from "@telefonica/mistica";
import { cover } from "../data/texts";

const Cover = () => {
  const { isMobile } = useScreenSize();

  const TextLayout = ({ children }) => {
    return isMobile ? (
      <div style={{ padding: "48px 0", height: "100%" }}>
        <Stack space="between" className={styles.textContainer}>
          {children}
        </Stack>
      </div>
    ) : (
      <Inline space="between" className={styles.textContainerDesktop}>
        {children}
      </Inline>
    );
  };

  return (
    <div className={styles.container}>
      <div className={isMobile ? styles.yearMobile : styles.yearDesktop}>
        <ThemeVariant isInverse>
          <TextLayout>
            <div className={styles.coverText}>
              <Text size={isMobile ? 32 : 64} weight="bold">
                {cover}
              </Text>
            </div>
            <YearSvg></YearSvg>
          </TextLayout>
        </ThemeVariant>
      </div>
      <div
        className={styles.bandContainer}
        style={{ left: isMobile ? -1900 : -800 }}
      >
        <ColorBand
          color="#59C2C9"
          rotate="60"
          origin="50%"
          text="#wrapped’23"
          index={50}
          top={240}
        ></ColorBand>
        <ColorBand
          color="#EAC344"
          rotate="60"
          origin="60%"
          text="#wrapped’23"
          top={400}
        ></ColorBand>
        <ColorBand
          color="#E66C64"
          rotate="-35"
          origin="45%"
          text="#wrapped’23"
          top={720}
        ></ColorBand>
        <ColorBand
          color="#C466EF"
          rotate="310"
          origin="80%"
          text="#wrapped’23"
          index={60}
          top={240}
        ></ColorBand>
      </div>
    </div>
  );
};

export default Cover;
