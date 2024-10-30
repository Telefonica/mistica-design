import {
  ResponsiveLayout,
  ButtonPrimary,
  Text10,
  Text5,
  Box,
  Stack,
  Carousel,
} from "@telefonica/mistica";
import CalendarCard from "../components/calendar-card";
import NavBar from "../components/navbar";
import { useState, useMemo, useEffect } from "react";
import {
  updateAchievements,
  updateCompletedDays,
} from "../utils/state-manager";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAndUnlockAchievements } from "../utils/achievement-config";

const CalendarView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Load completed days from local storage on initial mount
  const [completedDays, setCompletedDays] = useState(() => {
    const savedDays = localStorage.getItem("completedDays");
    return savedDays ? JSON.parse(savedDays) : [];
  });

  const [achievements, setAchievements] = useState([]);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const calendarDays = Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    const date = new Date(Date.UTC(2024, 9, day)); // 11 = December in UTC
    return {
      date: date.toISOString().split("T")[0],
      dayOfWeek: weekdays[date.getUTCDay()],
    };
  });

  const today = new Date().toISOString().split("T")[0];
  const todayIndex = calendarDays.findIndex(({ date }) => date === today);
  const initialActiveDay = todayIndex !== -1 ? todayIndex : 0;

  const isDayCompleted = (date) => completedDays.includes(date);
  const isDayBlocked = (date) => date === today && !isDayCompleted(date);

  const markDayAsCompleted = (date) => {
    if (!completedDays.includes(date)) {
      const newCompletedDays = [...completedDays, date];
      // Update completed days state and local storage
      localStorage.setItem("completedDays", JSON.stringify(newCompletedDays));
      updateCompletedDays(
        newCompletedDays,
        setCompletedDays,
        navigate,
        location
      );

      // Check for achievements
      checkAndUnlockAchievements(
        newCompletedDays,
        achievements,
        setAchievements,
        navigate,
        location
      );
    }
  };

  const clearCompletedDays = () => {
    localStorage.removeItem("completedDays"); // Clear from local storage
    updateCompletedDays([], setCompletedDays, navigate, location); // Clear state
  };

  const contentByDate = {
    "2024-10-28": "Today's challenge: Try a new hobby or activity.",
  };

  const calendarItems = useMemo(() => {
    return calendarDays.map(({ date, dayOfWeek }) => (
      <CalendarCard
        key={date}
        DateString={date}
        DayOfWeek={dayOfWeek}
        content={contentByDate[date]}
        isCompleted={isDayCompleted(date)}
        isBlocked={isDayBlocked(date)}
        onEndDay={() => markDayAsCompleted(date)}
      />
    ));
  }, [completedDays, calendarDays]);

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
              initialActiveItem={initialActiveDay}
              items={calendarItems}
            />
            <ButtonPrimary onPress={clearCompletedDays}>
              Clear Completed Days
            </ButtonPrimary>
          </Stack>
        </Box>
      </ResponsiveLayout>
    </>
  );
};

export default CalendarView;
