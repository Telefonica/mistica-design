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
import DecorationSnake from "../assets/decorations/decoration-snake";

const ComingSoonPage = () => {

const defaultTargetDate = "2024-12-01";
const endTimestamp = new Date(defaultTargetDate).getTime();

  return (
    <>
      <ResponsiveLayout
        >
        <NavBar /> 
        <Align x="center" y="center" height="calc(100vh - 138px)"> 
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',    
            textAlign: 'center',   
          }}
        >
          <Stack space={24}>
            <Text size={70} lineHeight={100}weight="medium">Mística Advent Calendar</Text>
            <div style={{
              maxWidth: 600,
              display: 'flex',
              justifyContent: 'center',   
              textAlign: 'center', 
              margin: 'auto'}} >
              <Text >Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa praesentium, eaque repellendus consectetur exercitationem sint? Obcaecati, explicabo dolor quidem minus autem sequi ratione dolorum, ea doloremque </Text>
            </div>
            <div style={{display: 'flex',
              justifyContent: 'center',
              textAlign: 'center', margin: 'auto'}}
            ><DecorationSnake></DecorationSnake></div>
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
