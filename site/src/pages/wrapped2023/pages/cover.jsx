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

  const stars = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="64"
      viewBox="0 0 56 64"
      fill="none"
    >
      <path
        d="M17.193 29.5289L21.8366 42.1093L34.386 46.7644L21.8366 51.4196L17.193 63.9999L12.5493 51.4196L0 46.7644L12.5493 42.1093L17.193 29.5289Z"
        fill="white"
      />
      <path
        d="M49.1221 0L50.9795 5.03214L55.9993 6.8942L50.9795 8.75626L49.1221 13.7884L47.2646 8.75626L42.2449 6.8942L47.2646 5.03214L49.1221 0Z"
        fill="white"
      />
    </svg>
  );

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
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {stars}
                </div>
                <div className={styles.coverText}>
                  <Text size={32} weight="bold">
                    {cover}
                  </Text>
                </div>
              </div>
            )}
            <YearSvg withStars={isMobile ? true : false}></YearSvg>
          </TextLayout>
        </ThemeVariant>
      </div>
      <div
        style={{
          overflow: "clip",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
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
          <ColorBand
            color="red"
            rotate="-35"
            origin="25%"
            top={460}
          ></ColorBand>
          <ColorBand
            color="purple"
            rotate="310"
            origin="42%"
            index={60}
            top={240}
          ></ColorBand>
        </div>
      </div>
    </div>
  );
};

export default Cover;
