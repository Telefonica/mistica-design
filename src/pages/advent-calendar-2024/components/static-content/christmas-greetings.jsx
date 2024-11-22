import { Stack, Text5, Text3, TextLink, skinVars } from "@telefonica/mistica";
import ContentWrapper from "../content-wrapper";

const ChristmasGreetings = () => {
  return (
    <ContentWrapper textAlign={"center"}>
      <Stack space={52}>
        <span style={{ fontSize: "100px" }}>🎄</span>
        <Text5>
          Thanks for joining us these past days.
          <br></br>
          Let’s keep opening surprises together in 2025!
        </Text5>
        <Stack space={16}>
          <Text3 weight="medium">Want to know more about Mística?</Text3>
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
            <TextLink href="https://brandfactory.example.com">
              <Text3 weight="medium" color={skinVars.colors.brand}>
                Brand Factory
              </Text3>
            </TextLink>
            <TextLink href="https://github.com/telefonica/mistica">
              <Text3 weight="medium" color={skinVars.colors.brand}>
                {" "}
                GitHub
              </Text3>
            </TextLink>
            <TextLink href="mailto:contact@telefonica.com">
              <Text3 weight="medium" color={skinVars.colors.brand}>
                {" "}
                Contact us
              </Text3>
            </TextLink>
          </div>
        </Stack>
      </Stack>
    </ContentWrapper>
  );
};

export default ChristmasGreetings;
