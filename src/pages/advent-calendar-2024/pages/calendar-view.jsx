import {
  ResponsiveLayout,
  ButtonPrimary,
  Text,
  Text5,
  Box,
  Stack,
  Carousel,
  Inline,
} from "@telefonica/mistica";
import CalendarCard from "../components/calendar-card";
import NavBar from "../components/navbar";
import { useState, useMemo, useEffect } from "react";
import {
  updateAchievements,
  updateCompletedDays,
} from "../utils/state-manager";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkAndUnlockAchievements,
  achievementsConfig,
  ACHIEVEMENT_PREFIX,
} from "../utils/achievement-config";
import { CARD_STATES, TOTAL_CALENDAR_DAYS } from "../utils/constants";
import {
  IllustrationWishesLetter,
  IllustrationWoolClothes,
} from "../assets/illustrations/illustrations";

const CalendarView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Load completed days from local storage on initial mount
  const [completedDays, setCompletedDays] = useState(() => {
    const savedDays = localStorage.getItem("completedDays");
    return savedDays ? JSON.parse(savedDays) : [];
  });

  const [achievements, setAchievements] = useState([]);

  const [allDaysUnlocked, setAllDaysUnlocked] = useState(false);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const calendarDays = Array.from(
    { length: TOTAL_CALENDAR_DAYS },
    (_, index) => {
      const firstDayAvailable = index + 1;
      const date = new Date(Date.UTC(2024, 10, firstDayAvailable)); // 11 = December in UTC
      return {
        date: date.toISOString().split("T")[0],
        dayOfWeek: weekdays[date.getUTCDay()],
      };
    }
  );

  const today = new Date().toISOString().split("T")[0];
  const todayIndex = calendarDays.findIndex(({ date }) => date === today);
  const initialActiveDay = todayIndex !== -1 ? todayIndex : 0;

  const isDayCompleted = (date) => completedDays.includes(date);
  const isDayBlocked = (date) => date !== today || isDayCompleted(date);

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

  const clearLocalStorage = () => {
    localStorage.removeItem("completedDays"); // Clear from local storage
    updateCompletedDays([], setCompletedDays, navigate, location); // Clear state
    achievementsConfig.forEach(({ id }) => {
      localStorage.removeItem(ACHIEVEMENT_PREFIX + id);
    });
  };

  const getDayStatus = (date) => {
    if (isDayCompleted(date)) return CARD_STATES.COMPLETED;
    if (!allDaysUnlocked && isDayBlocked(date)) return CARD_STATES.BLOCKED;
    return CARD_STATES.AVAILABLE;
  };

  const contentByDate = {
    "2024-11-11": {
      illustration: <IllustrationWishesLetter />,
      title: "Movie Night",
      description: "Watch a movie with your family or friends.",
    },
    "2024-11-12": {
      illustration: <IllustrationWoolClothes />,
      title: "Movie Night",
      description: "Watch a movie with your family or friends.",
    },
    "2024-11-18": {
      illustration: <IllustrationWishesLetter />,
      title: "Movie Night",
      description: "Watch a movie with your family or friends.",
    },
    "2024-11-19": {
      illustration: <IllustrationWoolClothes />,
      title: "Movie Night",
      description: "Watch a movie with your family or friends.",
    },
  };

  const calendarItems = useMemo(() => {
    return calendarDays.map(({ date, dayOfWeek }) => (
      <CalendarCard
        key={date}
        DateString={date}
        DayOfWeek={dayOfWeek}
        content={contentByDate[date]?.title}
        status={getDayStatus(date)}
        onEndDay={() => markDayAsCompleted(date)}
        illustration={contentByDate[date]?.illustration}
      />
    ));
  }, [completedDays, calendarDays]);

  return (
    <>
      <NavBar />
      <ResponsiveLayout>
        <Box paddingY={42}>
          <Stack space={48}>
            <Stack space={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4.19043 11.7969L12 2L19.8094 11.7969H15.4314L19.8094 17H13V22H11V17H4.19043L8.56849 11.7969H4.19043Z"
                    fill="black"
                  />
                </svg>
                <Text5>Mística Advent</Text5>
              </div>

              <Text size={80} weight="medium">
                Calendar '24
              </Text>
            </Stack>
            <Carousel
              initialActiveItem={initialActiveDay}
              items={calendarItems}
            />
            <ButtonPrimary onPress={clearLocalStorage}>
              Clear Completed Days
            </ButtonPrimary>
            <ButtonPrimary onPress={() => setAllDaysUnlocked(!allDaysUnlocked)}>
              {allDaysUnlocked ? "Enable blocked days" : "Disable blocked days"}
            </ButtonPrimary>
          </Stack>
        </Box>
      </ResponsiveLayout>
    </>
  );
};

export default CalendarView;
