import { 
  ResponsiveLayout, 
  Text5, 
  Box, 
  Stack, 
  Text, 
  ButtonPrimary, 
  Timer, 
} from "@telefonica/mistica";
import NavBar from "../components/navbar";

const ComingSoonPage = () => {

const defaultTargetDate = "2024-12-01";
const endTimestamp = new Date(defaultTargetDate).getTime();

  return (
    <>
      <NavBar /> 

      <ResponsiveLayout>
        <Box paddingY={42}>
          <Stack space={48}>
            <Stack space={0}>
              
              <Text size={60} weight="medium">
                Coming Soon
              </Text>
              <Timer
                  endTimestamp={endTimestamp}
                  minTimeUnit="seconds"
                  maxTimeUnit="days"
                  themeVariant="default"
                  boxed={true}
                />
            </Stack>
          </Stack>
        </Box>
      </ResponsiveLayout>
    </>
  );
};

export default ComingSoonPage;
