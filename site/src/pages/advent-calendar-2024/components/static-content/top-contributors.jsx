import {
  Avatar,
  Stack,
  Text4,
  BoxedRowList,
  BoxedRow,
} from "@telefonica/mistica";
import ContentWrapper from "../content-wrapper";
import avatarJoseImg from "../../assets/images/avatar-jose.png";
import avatarMontseImg from "../../assets/images/avatar-montse.png";
import avatarLucasImg from "../../assets/images/avatar-lucas.png";

const TopContributors = () => {
  return (
    <ContentWrapper>
      <Stack space={32}>
        <Stack space={16}>
          <BoxedRowList>
            <BoxedRow
              asset={
                <Avatar
                  size={40}
                  src={avatarJoseImg}
                />
              }
              title="Jose Luis González"
              right={<span style={{ fontSize: "40px" }}>🥇</span>}
            />
            <BoxedRow
              asset={
                <Avatar
                  size={40}
                  src={avatarMontseImg}
                />
              }
              title="Montserrat Morales"
              right={<span style={{ fontSize: "40px" }}>🥈</span>}
            />
            <BoxedRow
              asset={
                <Avatar
                  size={40}
                  src={avatarLucasImg}
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
