import { Stack, Text5, Text3, TextLink, skinVars } from "@telefonica/mistica";
import ContentWrapper from "../content-wrapper";
import contentByDate from "../../utils/content-config";

const ChristmasGreetings = () => {
  const FinalIllustration = contentByDate["2024-12-25"].Illustration;
  return (
    <ContentWrapper textAlign={"center"}>
      <Stack space={52}>
        <FinalIllustration />
        <Text5>
          Thanks for joining us these past days.
          <br></br>
          Let’s keep opening surprises together in 2025!
        </Text5>
        <Stack space={16}>
          <Text3 weight="medium">Want to know more about Mística?</Text3>
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
            <TextLink href="https://brandfactory.telefonica.com/d/iSp7b1DkYygv">
              <Text3 weight="medium" color={skinVars.colors.brand}>
                Brand Factory
              </Text3>
            </TextLink>
            <TextLink href="https://github.com/Telefonica/mistica-design">
              <Text3 weight="medium" color={skinVars.colors.brand}>
                {" "}
                GitHub
              </Text3>
            </TextLink>
            <TextLink href="https://teams.microsoft.com/l/team/19%3Ad2e3607a32ec411b8bf492f43cd0fe0c%40thread.tacv2/conversations?groupId=e265fe99-929f-45d1-8154-699649674a40&tenantId=9744600e-3e04-492e-baa1-25ec245c6f10">
              <Text3 weight="medium" color={skinVars.colors.brand}>
                {" "}
                Contact us
              </Text3>
            </TextLink>
          </div>
          <Text3 weight="medium">One more thing...</Text3>
          <TextLink to="/advent-calendar-2024/claim-your-gift">
            <Text3 weight="medium" color={skinVars.colors.brand}>
              Claim your gift
            </Text3>
          </TextLink>
        </Stack>
      </Stack>
    </ContentWrapper>
  );
};

export default ChristmasGreetings;
