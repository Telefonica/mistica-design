import {
  ResponsiveLayout,
  ButtonPrimary,
  Text,
  Box,
  Stack,
  Carousel,
  Text4,
  GridLayout,
  TextLink,
  skinVars,
  Inline,
  useScreenSize,
} from "@telefonica/mistica";
import CalendarCard from "../components/calendar-card";
import NavBar from "../components/navbar";
import { useState, useMemo } from "react";
import { updateCompletedDays } from "../utils/state-manager";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkAndUnlockAchievements,
  achievementsConfig,
  ACHIEVEMENT_PREFIX,
} from "../utils/achievement-config";
import { CARD_STATES } from "../utils/constants";
import ToastWrapper from "../components/toast-wrapper";
import contentByDate from "../utils/content-config";
import DecorationSnake from "../assets/decorations/decoration-snake.jsx";
import { calendarDays } from "../utils/calendar-config.jsx";
import DecorationPatty from "../assets/decorations/decoration-patty.jsx";
import Snow from "../components/snow.tsx";

const CalendarView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useScreenSize();

  // Load completed days from local storage on initial mount
  const [completedDays, setCompletedDays] = useState(() => {
    const savedDays = localStorage.getItem("completedDays");
    return savedDays ? JSON.parse(savedDays) : [];
  });
  const [toasts, setToasts] = useState([]); // Array to manage multiple toasts

  const handleShowToast = ({ id, icon, message, name }) => {
    const newToast = {
      id,
      icon,
      name,
      message,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const [achievements, setAchievements] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [isAllDaysAvailable, setIsAllDaysAvailable] = useState(false);

  const unlockAllDays = () => {
    if (isAllDaysAvailable) {
      // Lock all days
      setAvailableDays([]); // Clear the available days
    } else {
      // Unlock all days
      const allDates = calendarDays.map((day) => day.date);
      setAvailableDays(allDates); // Set all days as available
    }
    // Toggle the availability state
    setIsAllDaysAvailable((prevState) => !prevState);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayIndex = calendarDays.findIndex(({ date }) => date === today);
  const initialActiveDay = todayIndex !== -1 ? todayIndex : 0;

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
        location,
        handleShowToast
      );
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("completedDays"); // Clear from local storage
    updateCompletedDays([], setCompletedDays, navigate, location); // Clear state
    achievementsConfig.forEach(({ id }) => {
      localStorage.removeItem(ACHIEVEMENT_PREFIX + id);
    });

    localStorage.removeItem("gameScores");
    localStorage.removeItem("quizData");
  };

  const getDayStatus = (date) => {
    if (completedDays.includes(date)) {
      return CARD_STATES.COMPLETED;
    } else if (isAllDaysAvailable || availableDays.includes(date)) {
      return CARD_STATES.AVAILABLE; // Available if all days are unlocked or the day is in availableDays
    } else if (date !== today) {
      return CARD_STATES.BLOCKED; // Block past dates
    } else {
      return CARD_STATES.AVAILABLE; // Default to available if today
    }
  };

  const calendarItems = useMemo(() => {
    return calendarDays.map(({ date, dayOfWeek }) => (
      <CalendarCard
        key={date}
        DateString={date}
        DayOfWeek={dayOfWeek}
        eventName={contentByDate[date]?.title}
        eventDescription={contentByDate[date]?.description}
        content={contentByDate[date]?.content}
        status={getDayStatus(date)} // Ensure status is updated based on availability
        onEndDay={() => markDayAsCompleted(date)}
        illustration={contentByDate[date]?.illustration}
        repeatable={contentByDate[date]?.repeatable}
      />
    ));
  }, [completedDays, availableDays, calendarDays]);

  return (
    <>
      <Snow />
      <NavBar />
      <ResponsiveLayout>
        <Box paddingY={42}>
          <Stack space={48}>
            <GridLayout
              verticalSpace={24}
              template="8+4"
              left={
                <Stack space={0}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
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

                    <Text4 medium>Mística Advent</Text4>
                  </div>
                  <Inline space={16} alignItems="center">
                    <Text
                      size={96}
                      mobileSize={56}
                      lineHeight={96}
                      mobileLineHeight={56}
                      weight="medium"
                      letterSpacing={-3.5}
                    >
                      Calendar
                    </Text>
                    <DecorationPatty
                      text="24"
                      size={isMobile ? "96" : 128}
                      stroke={isMobile ? "0.90" : "0.75"}
                      color={skinVars.colors.error}
                      textColor={skinVars.colors.textPrimary}
                      textSize={16}
                    ></DecorationPatty>
                  </Inline>
                  <DecorationSnake width={isMobile ? "100%" : 371.84} />
                </Stack>
              }
              right={
                <Stack space={16}>
                  <Text4 weight="medium">Welcome!</Text4>
                  <Text4>
                    This year, at Mística, we want to give you a little surprise
                    every day this month in the run up to Christmas.{" "}
                    <TextLink aria-label="Know more about our calendar">
                      More
                    </TextLink>
                  </Text4>
                </Stack>
              }
            ></GridLayout>

            <Carousel
              initialActiveItem={initialActiveDay}
              items={calendarItems}
            />
            <ButtonPrimary onPress={clearLocalStorage}>
              Clear Completed Days
            </ButtonPrimary>
            <ButtonPrimary onPress={unlockAllDays}>
              {isAllDaysAvailable ? "Lock all days" : "Unlock all days"}
            </ButtonPrimary>
          </Stack>
        </Box>
      </ResponsiveLayout>

      <ToastWrapper toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default CalendarView;
