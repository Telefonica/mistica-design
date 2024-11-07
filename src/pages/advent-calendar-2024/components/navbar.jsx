import {
  ResponsiveLayout,
  Inline,
  Box,
  TelefonicaLogo,
  skinVars,
  ButtonSecondary,
  Touchable,
} from "@telefonica/mistica";
import RotatingSVG from "./label-rotate";
import { useNavigate } from "react-router-dom";
import { base64Encode } from "../utils/url-encoder";

const NavBar = () => {
  const navigate = useNavigate();

  const handleViewProgress = () => {
    const completedDays =
      JSON.parse(localStorage.getItem("completedDays")) || [];

    // Encode completed days as a Base64 string
    const encodedDays = base64Encode(completedDays.join(","));
    const params = new URLSearchParams({
      completedDays: encodedDays,
    });

    navigate(`/advent-calendar-2024/progress-view?${params.toString()}`);
  };

  return (
    <ResponsiveLayout>
      <Box paddingY={24}>
        <Inline space="between" alignItems="center">
          <Touchable to={"/advent-calendar-2024"}>
            <RotatingSVG />
          </Touchable>
          <Inline space={24} alignItems="center">
            <ButtonSecondary onPress={handleViewProgress}>
              My progress
            </ButtonSecondary>
            <TelefonicaLogo
              type="imagotype"
              color={skinVars.colors.neutralHigh}
              size={32}
            />
          </Inline>
        </Inline>
      </Box>
    </ResponsiveLayout>
  );
};

export default NavBar;
