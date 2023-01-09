import "@telefonica/mistica/css/reset.css";
import {
  Stack,
  Box,
  ResponsiveLayout,
  MediaCard,
  Circle,
  IconShopRegular,
  ButtonLink,
  Text7,
  Text4,
  skinVars,
  Header,
  Image,
  HeaderLayout,
} from "@telefonica/mistica";
import React from "react";
import "@telefonica/mistica/css/mistica.css";

const App = (isDesktopOrBigger) => (
  <Box>
    <HeaderLayout
      header={<Header />}
      extra={
        <Stack space={16}>
          <Text7>Mística Index</Text7>
          <Text4>A list of little internal projects for Mística Design</Text4>
        </Stack>
      }
    />

    <ResponsiveLayout>
      <Box paddingY={isDesktopOrBigger ? 40 : 800}>
        <Stack space={40}>
          {/* <Title2>Mística Index</Title2> */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(30%, 1fr))",
              gap: isDesktopOrBigger ? 24 : 16,
            }}
          >
            <MediaCard
              media={
                <Image
                  aspectRatio="16:9"
                  src="https://images.unsplash.com/photo-1597742200172-7f581bbacbab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
                />
              }
              icon={
                <Circle backgroundColor={skinVars.colors.brandLow} size={40}>
                  <IconShopRegular color={skinVars.colors.brand} />
                </Circle>
              }
              title="Mística Wrapper '22'"
              description="Description"
              buttonLink={
                <ButtonLink href="https://tinyurl.com/2fyfjdnw" newTab={true}>
                  Visit
                </ButtonLink>
              }
            />
            <MediaCard
              media={
                <Image
                  aspectRatio="16:9"
                  src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                />
              }
              icon={
                <Circle backgroundColor={skinVars.colors.brandLow} size={40}>
                  <IconShopRegular color={skinVars.colors.brand} />
                </Circle>
              }
              title="Tokens Table"
              description="Description"
              buttonLink={
                <ButtonLink href="tokens/index.html">Visit</ButtonLink>
              }
            />
            <MediaCard
              media={
                <Image
                  aspectRatio="16:9"
                  src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=80"
                />
              }
              icon={
                <Circle backgroundColor={skinVars.colors.brandLow} size={40}>
                  <IconShopRegular color={skinVars.colors.brand} />
                </Circle>
              }
              title="Repo Dashboard"
              description="Description"
              buttonLink={
                <ButtonLink href="dashboard/index.html">Visit</ButtonLink>
              }
            />
          </div>
        </Stack>
      </Box>
    </ResponsiveLayout>
  </Box>
);

export default App;
