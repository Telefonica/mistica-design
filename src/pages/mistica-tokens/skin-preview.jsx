import React, { useContext } from "react";
import {
  ResponsiveLayout,
  ButtonPrimary,
  ThemeContextProvider,
  ToggleIconButton,
  IconMoonFilled,
  IconSunFilled,
} from "@telefonica/mistica";
import { generateCustomSkin } from "../../helpers/generateCustomSkin";
import { SchemeContext } from "../../App";

const SkinPreview = ({ skin }) => {
  const generatedSkin = generateCustomSkin("Custom", skin, skin.global.palette);

  const { theme, setTheme } = useContext(SchemeContext);

  const mockupSkin = {
    name: "Custom",
    colors: {
      background: "#f5f5f5",
    },
    darkModeColors: {
      background: "#333",
    },
    borderRadii: {
      button: "24px",
    },
  };

  return (
    <ThemeContextProvider
      theme={{
        skin: mockupSkin,
        i18n: { locale: "es-ES", phoneNumberFormattingRegionCode: "ES" },
        colorScheme: theme,
      }}
    >
      <ResponsiveLayout>
        <ToggleIconButton
          checkedProps={{ Icon: IconSunFilled, label: "Light mode" }}
          uncheckedProps={{ Icon: IconMoonFilled, label: "Dark mode" }}
          onChange={() =>
            theme === "light" ? setTheme("dark") : setTheme("light")
          }
        />
        <ButtonPrimary onPress={() => {}}>Test</ButtonPrimary>
      </ResponsiveLayout>
    </ThemeContextProvider>
  );
};

export default SkinPreview;
