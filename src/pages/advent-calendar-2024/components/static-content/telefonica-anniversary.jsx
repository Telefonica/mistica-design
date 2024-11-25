import {
    Stack,
    useScreenSize,
    DisplayMediaCard,
    ButtonPrimary,
    IconLightningRegular,
    IconPlayFilled,
  } from "@telefonica/mistica";
  import ContentWrapper from "../content-wrapper";
  
  const TelefonicaAnniversary = () => {
    const { isMobile } = useScreenSize();
  
    return (
      <ContentWrapper>
        <Stack space={32}>
        <DisplayMediaCard
            title="One hundred years connecting people's lives"
            backgroundImage={require("../../assets/images/telefonica-anniversary.png")}
            aspectRatio= "16:9"
            button={
                <ButtonPrimary small href="https://www.youtube.com/watch?v=U_kbixNB3tU&t=2s">
                Watch the video
                </ButtonPrimary>
            }
            actions={[
                {
                Icon: IconPlayFilled,
                onPress: () => {},
                label: "Lightning",
                href: "https://www.youtube.com/watch?v=U_kbixNB3tU&t=2s",
                },
            ]}
        />

        </Stack>
      </ContentWrapper>
    );
  };
  
  export default TelefonicaAnniversary;
  