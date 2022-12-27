import '@telefonica/mistica/css/reset.css';
import {
  Slideshow,
  ThemeVariant,
  Stack,
  Inline,
  Text,
  Image,
  BoxedRow,
  IconShopRegular,
} from '@telefonica/mistica';
import React from 'react';


const bodyStyles = (isDesktopOrBigger) => ({
  height: "100%",
  padding: isDesktopOrBigger ? "0" : "96px 16px",
  display: "flex",
  alignItems: isDesktopOrBigger ? "center" : "start",
  maxWidth: "calc(1024px - 32px)",
  margin: isDesktopOrBigger ? "auto" : "0",
});
  
const subGrid = (isDesktopOrBigger) =>  ({
  height: isDesktopOrBigger ? "100%" : "auto",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const box = (isDesktopOrBigger) => ({
  background:
  "linear-gradient(45deg, rgba(255,255,255,0.10) 0%,  rgba(255,255,255,0.05) 100%)",
    borderRadius: isDesktopOrBigger ? 40 : 24,
  border: "1px solid  rgba(255,255,255,0.10) ",
  overflow: "hidden",
  boxSizing: "border-box",
  height: isDesktopOrBigger ? "100%" : "auto",
});

const Grid = (props) => (
  <div
    style={{
      display: "grid",
      gridGap: "24px",
      gridTemplateColumns: props.templateColumns ?? "1fr",
      gridTemplateRows: props.templateRows ?? undefined,
      alignContent: "center",
    }}
  >
    {props.children}
  </div>
);

const BoxContent = (props, isDesktopOrBigger) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: isDesktopOrBigger ? props.height ?? "100%" : "auto",
      padding: isDesktopOrBigger ? "48px" : "16px",
      justifyContent: props.align,
    }}
  >
    {props.children}
  </div>
);

const FigmaLogo = (props, isDesktopOrBigger) => (
  <svg
    style={{ width: isDesktopOrBigger ? "40" : "24" }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 35 50"
    fill="none"
  >
    <path
      d="M10.1568 1C5.34814 1 1.42773 4.89874 1.42773 9.68085C1.42773 13.0514 3.43021 15.9033 6.26363 17.3404C3.43021 18.7775 1.42773 21.6295 1.42773 25C1.42773 28.3705 3.43021 31.2225 6.26363 32.6596C3.43021 34.0967 1.42773 36.9486 1.42773 40.3191C1.42773 45.1013 5.34814 49 10.1568 49C14.9655 49 18.8859 45.1013 18.8859 40.3191V32.6596V29.2447C20.2634 31.8443 22.9239 33.6809 26.0745 33.6809C30.5997 33.6809 34.2901 30.0108 34.2901 25.5106C34.2901 21.8118 31.7496 18.7995 28.3491 17.7992C31.7778 16.6273 34.2901 13.4802 34.2901 9.68085C34.2901 4.89874 30.3697 1 25.5611 1H17.8589H10.1568ZM10.1568 3.04255H16.832V16.3191H10.1568C6.45823 16.3191 3.48164 13.359 3.48164 9.68085C3.48164 6.0027 6.45823 3.04255 10.1568 3.04255ZM18.8859 3.04255H25.5611C29.2596 3.04255 32.2362 6.0027 32.2362 9.68085C32.2362 13.359 29.2596 16.3191 25.5611 16.3191H18.8859V3.04255ZM10.1568 18.3617H16.832V31.6383H10.1568C6.45823 31.6383 3.48164 28.6781 3.48164 25C3.48164 21.3219 6.45823 18.3617 10.1568 18.3617ZM18.8859 18.3617H22.3198C20.8462 19.1339 19.6624 20.3112 18.8859 21.7766V18.3617ZM26.0745 19.383C29.4897 19.383 32.2362 22.1143 32.2362 25.5106C32.2362 28.9069 29.4897 31.6383 26.0745 31.6383C22.6594 31.6383 19.9128 28.9069 19.9128 25.5106C19.9128 22.1143 22.6594 19.383 26.0745 19.383ZM10.1568 33.6809H16.832V40.3191C16.832 43.9973 13.8554 46.9574 10.1568 46.9574C6.45823 46.9574 3.48164 43.9973 3.48164 40.3191C3.48164 36.641 6.45823 33.6809 10.1568 33.6809Z"
      fill="white"
      stroke="white"
    />
  </svg>
);

const SpaceBetweener = (props, isDesktopOrBigger) => (
  <div
    style={{
      display: "flex",
      flexDirection: props.direction,
      alignItems: props.align,
      justifyContent: "space-between",
      height: isDesktopOrBigger ? props.height ?? "100%" : "auto",
      gap: props.gutter ?? "48px",
      width: "100%",
    }}
  >
    {props.children}
  </div>
);

const Tag = (props, colors, isDesktopOrBigger) => {
  <div
      style={{
        padding: "0.5em 1em",
        display: "inline-flex",
        background: colors.backgroundContainer,
        borderRadius: 9999,
        width: "100%",
        fontWeight: "700",
        fontSize: isDesktopOrBigger ? "32px" : "18px",
        lineHeight: "1em",
        gap: props.emoji === undefined ? "0" : "8px",
      }}
    >
      <span
        style={{
          width: "100%",
          background:
            props.color === "gradient"
              ? "linear-gradient(to right, #136FFF 0%, #9CB2FF 50%, #E35CD3 100%)"
              : props.color,
          webkitBackgroundClip: "text",
          webkitTextFillColor: "transparent",
        }}
      >
        {props.text}
      </span>
      <span>{props.emoji}</span>
  </div>
};
    
const GraphBar = (props, colors, isDesktopOrBigger, applyAlpha) => (
  <div
    style={{
      width: props.width,
      background: applyAlpha(colors.inverse, 0.6),
      marginLeft: isDesktopOrBigger ? "-48px" : "-16px",
      height: isDesktopOrBigger ? 80 : 64,
      display: "flex",
      gap: "8px",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "0 9999px 9999px 0",
      padding: isDesktopOrBigger ? "0 48px" : "0 16px",
      fontSize: isDesktopOrBigger ? "24px" : "16px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          marginRight: isDesktopOrBigger ? 16 : 8,
          display: "inline-flex",
          alingItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {props.emoji}
      </span>
      <span style={{ color: props.color ?? "#0066FF", fontWeight: "700" }}>
        {props.text}
      </span>
    </div>
    <span style={{ color: props.color ?? "#0066FF", fontWeight: "700" }}>
      {props.value}
    </span>
  </div>
);

  
const App = (isDesktopOrBigger) => (
  <ThemeVariant isInverse={true}>
    <div style={{ height: "-webkit-fill-available" }}>
      <Slideshow onPageChange={() => window.magic()}
        withBullets
        items={[
          <div style={bodyStyles}>
        <Grid templateColumns={isDesktopOrBigger ? "5fr 7fr" : "1fr"}>
          <div style={box}>
            <BoxContent>
              <SpaceBetweener direction="column">
                <Stack space={24}>
                  <FigmaLogo></FigmaLogo>
                  <Text
                    size={48}
                    mobileSize={18}
                    weight="bold"
                    lineHeight={48}
                  >
                    Componente de diseño más usado en Figma
                  </Text>
                  <Tag color="gradient" text="#1 Row" emoji="🏆"></Tag>
                </Stack>
                <Image
                  noBorderRadius={false}
                  aspectRatio={isDesktopOrBigger ? "1:1" : "16:9"}
                  src="https://i.giphy.com/media/26u4exk4zsAqPcq08/giphy.webp"
                />
              </SpaceBetweener>
            </BoxContent>
          </div>

          <div style={subGrid}>
            <div style={box}>
              <BoxContent>
                <SpaceBetweener direction="column">
                  <Stack space={24}>
                    <Text transform="uppercase" size={18} mobileSize={14}>
                      Usado
                    </Text>
                    <Inline space={16} alignItems="baseline">
                      <Text
                        id="figmaTimes"
                        size={80}
                        mobileSize={40}
                        weight="bold"
                      >
                        365.764
                      </Text>
                      <Text size={32} mobileSize={20} weight="bold">
                        veces
                      </Text>
                    </Inline>
                  </Stack>
                  <div
                    style={{
                      boxShadow: "0px 12px 44px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <BoxedRow
                      asset={<IconShopRegular />}
                      headline="Headline"
                      title="Title"
                      subtitle="Subtitle"
                      description="Description"
                      onPress={() => {}}
                    />
                  </div>
                </SpaceBetweener>
              </BoxContent>
            </div>
            <div style={box}>
              <BoxContent>
                <SpaceBetweener direction="column">
                  <Text transform="uppercase" size={18} mobileSize={14}>
                    Los que se quedaron a la cola del premio...
                  </Text>
                  <Stack space={16}>
                    <GraphBar
                      emoji="😎"
                      text="#2 BoxedRow"
                      value="139.371"
                      width="110%"
                    ></GraphBar>
                    <GraphBar
                      emoji="✌️"
                      text="#3 Title"
                      value="122.903"
                      width="100%"
                    ></GraphBar>
                    <GraphBar
                      emoji="👸🏽"
                      text="#4 iOS NavBar"
                      value="100.211"
                      width="90%"
                    ></GraphBar>
                  </Stack>
                </SpaceBetweener>
              </BoxContent>
            </div>
          </div>
        </Grid>
      </div>
        ]}
      />
    </div>
  </ThemeVariant>
);

export default App;
