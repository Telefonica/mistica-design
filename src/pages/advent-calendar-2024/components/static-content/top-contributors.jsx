import {
  Align,
  Avatar,
  Stack,
  Text4,
  BoxedRowList,
  BoxedRow,
  useScreenSize,
} from "@telefonica/mistica";
import ContentWrapper from "../content-wrapper";

const TopContributors = () => {
  const { isMobile } = useScreenSize();

  return (
    <ContentWrapper>
      <Stack space={32}>
        <Stack space={16}>
          <BoxedRowList>
            <BoxedRow
              asset={
                <Avatar
                  size={40}
                  src={require("../../assets/images/avatar-jose.png")}
                />
              }
              title="Jose Luis González"
              right={<span style={{ fontSize: "40px" }}>🥇</span>}
            />
            <BoxedRow
              asset={
                <Avatar
                  size={40}
                  src={require("../../assets/images/avatar-montse.png")}
                />
              }
              title="Montserrat Morales"
              right={<span style={{ fontSize: "40px" }}>🥈</span>}
            />
            <BoxedRow
              asset={
                <Avatar
                  size={40}
                  src={require("../../assets/images/avatar-lucas.png")}
                />
              }
              title="Lucas Alburquerque"
              right={<span style={{ fontSize: "40px" }}>🥉</span>}
            />
          </BoxedRowList>
        </Stack>
        <div
          style={{
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Text4>
            Your help makes Mística better and improves the quality of all our
            products.
          </Text4>
        </div>
      </Stack>
    </ContentWrapper>
  );
};

export default TopContributors;
