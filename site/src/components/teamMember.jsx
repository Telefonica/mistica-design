import {
  Avatar,
  Inline,
  Stack,
  Text3,
  Text2,
  skinVars,
  TextLink,
  IconArrowLineUpRightRegular,
} from "@telefonica/mistica";
import { useState } from "react";

const TeamMember = (props) => {
  const [isShown, setIsShown] = useState(false);
  return (
    <Inline space={16} alignItems="center">
      <div
        style={{ borderRadius: "50%", cursor: "pointer" }}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <Avatar
          size={120}
          src={isShown ? props.src2 : props.src}
          alt="avatar"
        />
      </div>
      <Stack space={4}>
        <Text3>{props.name}</Text3>
        <Text2 color={skinVars.colors.textSecondary}>{props.description}</Text2>
      </Stack>
    </Inline>
  );
};

export default TeamMember;
