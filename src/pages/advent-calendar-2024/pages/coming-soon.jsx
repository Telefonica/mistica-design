import { 
  ResponsiveLayout, 
  Text7, 
  Box, 
  Stack, 
  Text, 
  Align,
  Timer, 
} from "@telefonica/mistica";
import NavBar from "../components/navbar";

const ComingSoonPage = () => {

const defaultTargetDate = "2024-12-01";
const endTimestamp = new Date(defaultTargetDate).getTime();

  return (
    <>
      <ResponsiveLayout
        variant="inverse">
        <NavBar /> 
        <Align x="center" y="center" height="calc(100vh - 138px)">
        <div style={{maxWidth:600}}>
            <Box paddingY={42}>
              <Stack space={48}>
                <Stack space={24} >
                    <Text7 size={60} weight="medium">Mística Advent Calendar</Text7>
                    <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis dolor dolorem sed ipsum vitae itaque, perferendis odit tempore delectus quidem tempora nihil illum est nam eius dolorum hic nulla quia.</Text>
                    <Timer
                        endTimestamp={endTimestamp}
                        minTimeUnit="seconds"
                        maxTimeUnit="days"
                        themeVariant="inverse"
                        boxed={false}
                      />
                </Stack>
              </Stack>
            </Box>
        </div>
        </Align>
        </ResponsiveLayout>
    </>
  );
};

export default ComingSoonPage;
