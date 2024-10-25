import { ResponsiveLayout, Inline, TextLink, Box } from "@telefonica/mistica";
import RotatingSVG from "./label-rotate";

const NavBar = () => {
  return (
    <ResponsiveLayout>
      <Box paddingY={24}>
        <Inline space="between" alignItems="center">
          <RotatingSVG />
          <TextLink>See my progress</TextLink>
        </Inline>
      </Box>
    </ResponsiveLayout>
  );
};

export default NavBar;
