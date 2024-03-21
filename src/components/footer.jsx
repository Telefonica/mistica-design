import {
  Box,
  ResponsiveLayout,
  skinVars,
  Stack,
  Text,
  Image,
  useTheme,
  Inline,
  TextLink,
  Divider,
  useScreenSize,
} from "@telefonica/mistica";
import logoDark from "../img/logo_dark.svg";
import logoLight from "../img/logo_light.svg";
import SubGrid from "./subGrid";

const Footer = () => {
  const { isDesktopOrBigger } = useScreenSize();
  const { isDarkMode } = useTheme();
  return (
    <ResponsiveLayout backgroundColor={skinVars.colors.backgroundAlternative}>
      <Box paddingY={64}>
        <Stack space={4}>
          <Box paddingY={24}>
            <SubGrid columns={isDesktopOrBigger ? 4 : 1}>
              <div
                style={{
                  gridColumnStart: "1",
                  gridColumnEnd: isDesktopOrBigger ? "3" : "1",
                }}
              >
                <Stack space={24}>
                  <Image
                    src={isDarkMode ? logoDark : logoLight}
                    width={200}
                    aspectRatio={0}
                  ></Image>
                  <Text>The design team behind Telefónica's design system</Text>
                </Stack>
              </div>
              <Stack space={8}>
                <Text weight="bold">Resources</Text>
                <TextLink>Design documentation</TextLink>
                <TextLink>Github repository</TextLink>
                <TextLink>Github icons repository</TextLink>
              </Stack>
              <Stack space={8}>
                <Text weight="bold">Communications</Text>
                <TextLink>Subscribe to our newsletter</TextLink>
              </Stack>
            </SubGrid>
          </Box>
          <Divider></Divider>
          <Box paddingY={8}>
            <Inline space={"between"}>
              <Text color={skinVars.colors.textSecondary}>
                © 2024 Telefonica
              </Text>
              <Text color={skinVars.colors.textSecondary}>
                Made with ❤️ by Design core
              </Text>
            </Inline>
          </Box>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default Footer;
