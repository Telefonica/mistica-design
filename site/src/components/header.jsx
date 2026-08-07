import {
  ButtonSecondary,
  IconButton,
  ResponsiveLayout,
  Touchable,
  skinVars,
  useTheme,
} from "@telefonica/mistica";
import { SchemeContext } from "../App";
import { useContext } from "react";
import logoDark from "../img/logo_dark.svg";
import logoLight from "../img/logo_light.svg";
import {
  Box,
  ButtonPrimary,
  IconMoonFilled,
  IconSunFilled,
  Inline,
  Image,
  useScreenSize,
} from "@telefonica/mistica";

import styles from "./header.module.css";

const AppHeader = () => {
  const { theme, setTheme } = useContext(SchemeContext);
  const { isDarkMode } = useTheme();
  const { isDesktopOrBigger } = useScreenSize();
  const iconSize = isDesktopOrBigger ? 24 : 16;

  return (
    <div className={styles.container}>
      <ResponsiveLayout>
        <Box paddingY={16}>
          <Inline fullWidth space="between" alignItems="center">
            <Touchable to="/">
              <Image
                width={240}
                aspectRatio={0}
                src={isDarkMode ? logoDark : logoLight}
              />
            </Touchable>
            {/*
            <IconButton
              onPress={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <IconMoonFilled size={iconSize} />
              ) : (
                <IconSunFilled size={iconSize} />
              )}
              </IconButton>*/}
          </Inline>
        </Box>
      </ResponsiveLayout>
    </div>
  );
};

export default AppHeader;
