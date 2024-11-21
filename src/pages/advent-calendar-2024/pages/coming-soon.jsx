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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',    
            textAlign: 'center',   
            maxWidth: 600,
          }}
        >
          <Stack space={24}>
            <Text7 size={60} weight="medium">Mística Advent Calendar</Text7>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa praesentium, eaque repellendus consectetur exercitationem sint? Obcaecati, explicabo dolor quidem minus autem sequi ratione dolorum, ea doloremque </Text>
            <Timer
              endTimestamp={endTimestamp}
              minTimeUnit="seconds"
              maxTimeUnit="days"
              themeVariant="inverse"
              boxed={false}
            />
          </Stack>
        </div>
        </Align>
        </ResponsiveLayout>
    </>
  );
};

export default ComingSoonPage;
