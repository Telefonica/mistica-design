import {
  useScreenSize,
  ThemeVariant,
  Inline,
  Stack,
  Text,
  skinVars,
  Logo,
  TextLink,
} from "@telefonica/mistica";
import ColorBand from "./components/color-band";
import YearSvg from "./components/year-svg";
import styles from "./finale.module.css";
import { cover } from "./data/texts";
import Section from "./components/section";
import MarginLayout from "./components/margin-layout";
import Wrapper from "./components/wrapper";
import RotatingSVG from "./components/label-rotate";

const WrappedFinale = () => {
  const { isMobile } = useScreenSize();

  const TextLayout = ({ children }) => {
    return isMobile ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "48px 0",
        }}
      >
        {children}
      </div>
    ) : (
      <Inline space="between" className={styles.textContainerDesktop}>
        {children}
      </Inline>
    );
  };

  return (
    <div
      style={{
        backgroundColor: skinVars.colors.backgroundAlternative,
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: isMobile ? "32px 16px" : 32,
          position: "absolute",
          width: "100%",
          zIndex: 9999,
        }}
      >
        <Inline fullWidth space="between" alignItems="center">
          <RotatingSVG fill={skinVars.colors.neutralHigh}></RotatingSVG>

          <ThemeVariant isInverse={false}>
            <Logo size={isMobile ? 32 : 56} type="imagotype" />
          </ThemeVariant>
        </Inline>
      </div>

      <div className={isMobile ? styles.containerMobile : styles.container}>
        <MarginLayout>
          <div className={isMobile ? styles.yearMobile : styles.yearDesktop}>
            <TextLayout>
              <Stack space={24}>
                <div className={styles.coverText}>
                  <Text size={isMobile ? 32 : 64} weight="bold">
                    Has been fun but 2024 will Rock!
                  </Text>
                </div>
                <Text size={isMobile ? 18 : 24} weight="bold">
                  If you want to know more about Mística
                </Text>
                <TextLink href="">Contact us</TextLink>
                <Text size={isMobile ? 18 : 24}>
                  Don't hesitate, we're here to rock it together!
                </Text>
                <Inline space={16}>
                  <TextLink href="">Contact us</TextLink>
                  <TextLink href="">Contact us</TextLink>
                  <TextLink href="">Contact us</TextLink>
                </Inline>
              </Stack>
              <div>
                <YearSvg inverse={false}></YearSvg>
              </div>
            </TextLayout>
          </div>
          <div className={styles.bandContainer}>
            <ColorBand
              color="#59C2C9"
              rotate="60"
              origin="90%"
              text="#wrapped’23"
              index={50}
              top={3400}
            ></ColorBand>
            <ColorBand
              color="#EAC344"
              rotate="60"
              origin="0%"
              text="#wrapped’23"
              top={-2500}
            ></ColorBand>
            <ColorBand
              color="#E66C64"
              rotate="-35"
              origin="360%"
              text="#wrapped’23"
              top={-6000}
            ></ColorBand>
            <ColorBand
              color="#C466EF"
              rotate="310"
              origin="240%"
              top={-5000}
              text="#wrapped’23"
              index={60}
            ></ColorBand>
          </div>
        </MarginLayout>
      </div>
    </div>
  );
};

export default WrappedFinale;
