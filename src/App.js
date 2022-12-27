import '@telefonica/mistica/css/reset.css';
import {
  Stack,
  Box,
  ResponsiveLayout,
  DataCard,
  Circle,
  IconShopRegular,
  ButtonLink,
  Title2,
  skinVars,
  useScreenSize,
  useTheme,
  
} from '@telefonica/mistica';
import React from 'react';


  
const App = (isDesktopOrBigger) => (

  <Box paddingY={isDesktopOrBigger ? 40 : 800}>
  <ResponsiveLayout>
      <Stack space={40}>
        <Title2>Mística Index</Title2>
        <Stack space={16}>
      <DataCard
        icon={
          <Circle backgroundColor={skinVars.colors.brandLow} size={40}>
            <IconShopRegular color={skinVars.colors.brand} />
          </Circle>
        }
        title="Mística Wrapper '22'"
        description="Description"
        buttonLink={<ButtonLink onPress={() => {}}>Visit</ButtonLink>}
          />
          <DataCard
        icon={
          <Circle backgroundColor={skinVars.colors.brandLow} size={40}>
            <IconShopRegular color={skinVars.colors.brand} />
          </Circle>
        }
        title="Tokens Table"
        description="Description"
        buttonLink={<ButtonLink href="../dashboard/index.html">Visit</ButtonLink>}
          />
          </Stack>
    </Stack>
  </ResponsiveLayout>
</Box>
  
);


export default App;
