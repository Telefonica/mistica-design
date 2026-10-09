import { Stack, Text3, skinVars } from "@telefonica/mistica";
import ContentWrapper from "../content-wrapper";
import adventCalendarImg from "../../assets/images/advent-calendar.png";

const AdventCalendarHistory = () => {
  return (
    <ContentWrapper>
      <Stack space={48}>
        <Stack space={16}>
          <Text3 color={skinVars.colors.textPrimary}>
            The Advent calendar was born in Germany in the 19th century as a way
            to make the wait for Christmas more enjoyable. Initially, families
            marked the days with 24 chalk lines on doors or walls, erasing one
            each day. Later, in 1902, the first printed calendar was created,
            featuring illustrations to discover.
          </Text3>

          <Text3 color={skinVars.colors.textPrimary}>
            The candy-filled calendar arrived in 1958, thanks to Georg Lang, a
            German innovator. As a child, his mother gave him 24 cookies placed
            on a board, allowing him to eat one each day. Inspired by this, he
            designed a calendar with compartments hiding chocolates.
          </Text3>

          <Text3 color={skinVars.colors.textPrimary}>
            Since that very first calendar, this tradition has evolved
            enormously, filling December with little surprises and joy.
          </Text3>

          <Text3 color={skinVars.colors.textPrimary}>
            Mística advent calendar is our tribute to this tradition.
          </Text3>
        </Stack>
        <img
          src={adventCalendarImg}
          alt="Advent Calendar"
          style={{
            width: "100%",
            borderRadius: 24,
          }}
        />
      </Stack>
    </ContentWrapper>
  );
};

export default AdventCalendarHistory;
