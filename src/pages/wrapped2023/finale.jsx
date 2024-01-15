import {
  useScreenSize,
  ThemeVariant,
  Inline,
  Stack,
  Text,
  skinVars,
  Logo,
  TextLink,
  useWindowSize,
  Text2,
  IconShareFilled,
  ButtonSecondary,
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
  const { width } = useWindowSize();

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
      <div className={styles.textContainerDesktop}>{children}</div>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  alignSelf: "center",
                }}
              >
                <div className={styles.coverText}>
                  <Text
                    size={isMobile ? 32 : 110}
                    lineHeight={isMobile ? 40 : 120}
                    weight="bold"
                  >
                    Has been fun but 2024 will rock!
                  </Text>
                </div>
                <Text size={isMobile ? 18 : 24} weight="bold">
                  If you want to know more about Mística
                </Text>
                <TextLink href="https://teams.microsoft.com/l/team/19%3Ad2e3607a32ec411b8bf492f43cd0fe0c%40thread.tacv2/conversations?groupId=e265fe99-929f-45d1-8154-699649674a40&tenantId=9744600e-3e04-492e-baa1-25ec245c6f10">
                  Contact us
                </TextLink>
                <Text size={isMobile ? 18 : 24}>
                  Don't hesitate, we're here to rock it together!
                </Text>
                <div style={{ display: "flex", gap: 16 }}>
                  <TextLink href="https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/get-started/what-is-mistica">
                    Brand Factory
                  </TextLink>
                  <TextLink href="https://github.com/Telefonica/mistica-design">
                    GitHub
                  </TextLink>
                </div>
                <div style={{ marginTop: 48 }}>
                  <ButtonSecondary to={"/wrapped-2023"}>
                    Restart Wrapped
                  </ButtonSecondary>
                </div>
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <YearSvg inverse={false} withStars></YearSvg>
              </div>
            </TextLayout>
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
              origin="90%"
              text="#wrapped’23"
              index={50}
              top={4411}
              left={-394}
            ></ColorBand>
            <ColorBand
              color="yellow"
              rotate="60"
              origin="0%"
              text="#wrapped’23"
              top={-3617}
            ></ColorBand>
            <ColorBand
              color="purple"
              rotate="-35"
              origin="0%"
              text="#wrapped’23"
              top={isMobile ? 950 : 348}
              left={isMobile ? 0 : 2248}
            ></ColorBand>
            <ColorBand
              color="red"
              rotate="334"
              origin="0%"
              top={isMobile ? 1696 : 2254}
              text="#wrapped’23"
              index={60}
              left={isMobile ? 0 : -2996}
            ></ColorBand>
          </div>
        </MarginLayout>

        <div className={styles.madeBy}>
          <Text2>
            made with{" "}
            <Text2 medium>
              <TextLink
                href="https://github.com/Telefonica/mistica"
                newTab={true}
              >
                Mística
              </TextLink>
            </Text2>
          </Text2>
        </div>
        <div className={styles.shareButton}>
          <ButtonSecondary
            onPress={() => {
              navigator.clipboard.writeText(
                "https://mistica-design.vercel.app/wrapped-2023"
              );
            }}
            StartIcon={IconShareFilled}
          >
            Share
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default WrappedFinale;
