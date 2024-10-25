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
import { Buffer } from 'buffer';

// Function to encode data in Base64
const base64Encode = (data) => {
  return Buffer.from(data).toString("base64");
};

// Function to decode Base64 data
const base64Decode = (data) => {
  return Buffer.from(data, "base64").toString("utf-8");
};

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
