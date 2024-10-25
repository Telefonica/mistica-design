import {
  ResponsiveLayout,
  Inline,
  Box,
  TelefonicaLogo,
  skinVars,
  ButtonSecondary,
} from "@telefonica/mistica";
import RotatingSVG from "./label-rotate";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleViewProgress = () => {
    const completedDays =
      JSON.parse(localStorage.getItem("completedDays")) || [];
    const params = new URLSearchParams({
      completedDays: completedDays.join(","),
    });

    navigate(`/advent-calendar-2024/progress-view?${params.toString()}`);
  };

  return (
    <ResponsiveLayout>
      <Box paddingY={24}>
        <Inline space="between" alignItems="center">
          <RotatingSVG />
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
