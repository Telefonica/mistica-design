import styles from "./cover.module.css";
import YearSvg from "../components/year-svg";
import ColorBand from "../components/color-band";
import {
  Stack,
  Text,
  useScreenSize,
  useWindowSize,
  ThemeVariant,
  Inline,
  Box,
} from "@telefonica/mistica";
import { cover } from "../data/texts";

const Cover = () => {
  const { isMobile } = useScreenSize();
  const { width } = useWindowSize();

  const TextLayout = ({ children }) => {
    return isMobile ? (
      <div style={{ padding: "48px 0", height: "100%" }}>
        <Stack space="between" className={styles.textContainer}>
          {children}
        </Stack>
      </div>
    ) : (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <Stack space={48} className={styles.textContainerDesktop}>
          {children}
        </Stack>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={isMobile ? styles.yearMobile : styles.yearDesktop}>
        <ThemeVariant isInverse>
          <TextLayout>
            <div className={styles.coverText}>
              {isMobile && (
                <Text size={isMobile ? 32 : 64} weight="bold">
                  {cover}
                </Text>
              )}
            </div>

            {!isMobile && (
              <div className={styles.coverText}>
                <Text size={32} weight="bold">
                  {cover}
                </Text>
              </div>
            )}
            <YearSvg></YearSvg>
          </TextLayout>
        </ThemeVariant>
      </div>
      <div
        className={styles.bandContainer}
        style={{
          left: isMobile ? -561 : (1 / width) * -1000000 - 150,
        }}
      >
        <ColorBand
          color="green"
          rotate="60"
          origin="22%"
          index={50}
          top={240}
        ></ColorBand>
        <ColorBand
          color="yellow"
          rotate="60"
          origin="36%"
          top={850}
        ></ColorBand>
        <ColorBand color="red" rotate="-35" origin="25%" top={460}></ColorBand>
        <ColorBand
          color="purple"
          rotate="310"
          origin="42%"
          index={60}
          top={240}
        ></ColorBand>
      </div>
    </div>
  );
};

export default Cover;
