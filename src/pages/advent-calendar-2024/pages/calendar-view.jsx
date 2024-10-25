import {
  ResponsiveLayout,
  Text10,
  Text5,
  Box,
  Stack,
  Carousel,
} from "@telefonica/mistica";
import CalendarCard from "../components/calendar-card";
import NavBar from "../components/navbar";

const CalendarView = () => {
  // Array of weekday names for easier reference
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Generate an array with days 1 to 24 of December 2024, including the day of the week
  const decemberDays = Array.from({ length: 24 }, (_, index) => {
    const day = index + 1;
    // Create the date in UTC to avoid time zone issues
    const date = new Date(Date.UTC(2024, 9, day)); // 11 = December in UTC

    return {
      date: date.toISOString().split("T")[0], // Format date as "YYYY-MM-DD"
      dayOfWeek: weekdays[date.getUTCDay()], // Get the name of the day of the week using UTC
    };
  });

  return (
    <>
      <NavBar />
      <ResponsiveLayout>
        <Box paddingY={42}>
          <Stack space={48}>
            <Stack space={16}>
              <Text5>Mística Advent</Text5>
              <Text10>Calendar '24</Text10>
            </Stack>
            <Carousel
              items={decemberDays.map(({ date, dayOfWeek }) => (
                <CalendarCard
                  key={date}
                  DateString={date}
                  DayOfWeek={dayOfWeek}
                />
              ))}
            ></Carousel>
          </Stack>
        </Box>
      </ResponsiveLayout>
    </>
  );
};

export default CalendarView;
