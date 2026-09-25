import {
  Box,
  Carousel,
  Circle,
  GridLayout,
  Inline,
  ResponsiveLayout,
  Sheet,
  SheetBody,
  Stack,
  Text,
  Text1,
  Text3,
  Text4,
  Text5,
  TextLink,
  skinVars,
  useScreenSize,
} from "@telefonica/mistica";
import { useState } from "react";
import DecorationPatty from "../assets/decorations/decoration-patty.jsx";
import DecorationSnake from "../assets/decorations/decoration-snake.jsx";
import CalendarCard from "../components/calendar-card";
import CornerLayout from "../components/corner-layout.jsx";
import NavBar from "../components/navbar";
import Snow from "../components/snow.tsx";
import ToastWrapper from "../components/toast-wrapper";
import { checkAndUnlockAchievements } from "../utils/achievement-config";
import { calendarDays } from "../utils/calendar-config.jsx";
import { CARD_STATES, CHRISTMAS_DAY } from "../utils/constants";
import contentByDate from "../utils/content-config";
import { updateCompletedDays } from "../utils/state-manager";

const CalendarView = () => {
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

  const today = new Date().toISOString().split("T")[0];
  const todayIndex = calendarDays.findIndex(({ date }) => date === today);
  const initialActiveDay = todayIndex !== -1 ? todayIndex : 0;

  const markDayAsCompleted = (date) => {
    if (!completedDays.includes(date)) {
      const newCompletedDays = [...completedDays, date];
      // Update completed days state and local storage
      localStorage.setItem("completedDays", JSON.stringify(newCompletedDays));
      updateCompletedDays(newCompletedDays, setCompletedDays);

      // Check for achievements
      checkAndUnlockAchievements(
        newCompletedDays,
        achievements,
        setAchievements,
        handleShowToast
      );
    }
  };
  const getDayStatus = () => {
    return CARD_STATES.AVAILABLE; // All days are unlocked and available
  };

  const calendarItems = calendarDays.map(({ date, dayOfWeek }) => (
    <CalendarCard
      key={date}
      DateString={date}
      DayOfWeek={dayOfWeek}
      eventName={contentByDate[date]?.title}
      eventDescription={contentByDate[date]?.description}
      content={contentByDate[date]?.content}
      status={getDayStatus(date)} // Ensure status is updated based on availability
      onEndDay={() => markDayAsCompleted(date)}
      Illustration={contentByDate[date]?.Illustration}
      repeatable={contentByDate[date]?.repeatable}
    />
  ));
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const SheetView = ({ isOpen, onClose }) => {
    return (
      isOpen && (
        <Sheet onClose={onClose}>
          {({ modalTitleId }) => (
            <SheetBody modalTitleId={modalTitleId}>
              <Box paddingBottom={{ mobile: 16, desktop: 0 }}>
                <Stack space={32}>
                  <Stack space={32}>
                    <Text5>How this calendar works</Text5>
                    <Text3>
                      Before you begin, it’s important to follow these simple
                      instructions.
                    </Text3>
                    <Text3>
                      <Stack space={32}>
                        <Inline space={16}>
                          <Circle size={24} background={skinVars.colors.brand}>
                            <Text1 medium color={skinVars.colors.inverse}>
                              1
                            </Text1>
                          </Circle>

                          <p>
                            Each day, you'll have a chance to participate and
                            unlock a new square. Remember,{" "}
                            <strong>it’s only available that day!</strong>
                          </p>
                        </Inline>

                        <Inline space={16}>
                          <Circle size={24} background={skinVars.colors.brand}>
                            <Text1 medium color={skinVars.colors.inverse}>
                              2
                            </Text1>
                          </Circle>
                          <p>
                            In{" "}
                            <TextLink
                              to={`/advent-calendar-2024/progress-view`}
                            >
                              My Progress
                            </TextLink>{" "}
                            page, you can see the days you've completed, your
                            achievements, and the score you're accumulating. To
                            make sure you don't lose your progress, it's
                            important{" "}
                            <strong>
                              <Text color={skinVars.colors.errorHigh}>
                                not to clear your browsing data.
                              </Text>
                            </strong>
                          </p>
                        </Inline>
                        <Inline space={16}>
                          <Circle size={24} background={skinVars.colors.brand}>
                            <Text1 medium color={skinVars.colors.inverse}>
                              3
                            </Text1>
                          </Circle>
                          <p>
                            Always{" "}
                            <strong>access it from the same device</strong> to
                            avoid losing your score.
                          </p>
                        </Inline>
                      </Stack>
                    </Text3>
                    <Text3>
                      <strong>That said...</strong> Can you unlock all the
                      tiles? We challenge you to do it!
                    </Text3>
                  </Stack>
                </Stack>
              </Box>
            </SheetBody>
          )}
        </Sheet>
      )
    );
  };

  return (
    <>
      <Snow />
      <div style={{ position: "relative", zIndex: 1 }}>
        <CornerLayout />
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
                        mobileLineHeight={64}
                        weight="bold"
                        letterSpacing={isMobile ? -1.5 : -3.5}
                      >
                        Calendar
                      </Text>
                      <DecorationPatty
                        text="24"
                        size={isMobile ? 64 : 128}
                        stroke={isMobile ? 1.5 : 0.75}
                        color={skinVars.colors.error}
                        textColor={skinVars.colors.textPrimary}
                        textSize={16}
                        easterEgg={true}
                      />
                    </Inline>
                    <DecorationSnake
                      width={isMobile ? `calc(min(341px, 100%))` : 371.84}
                    />
                  </Stack>
                }
                right={
                  <Stack space={16}>
                    <Text4 weight="medium">Welcome!</Text4>
                    <Text4>
                      This year, at Mística, we want to give you a little
                      surprise every day this month in the run up to Christmas.
                      Stay tuned for the 25th!{" "}
                      <TextLink
                        onPress={() => setIsSheetOpen(true)}
                        aria-label="Know more about our calendar"
                      >
                        More
                      </TextLink>
                    </Text4>
                  </Stack>
                }
              />

              <Carousel
                initialActiveItem={initialActiveDay}
                items={calendarItems}
              />
            </Stack>
          </Box>
          <SheetView
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
          />
          <ToastWrapper toasts={toasts} removeToast={removeToast} />
        </ResponsiveLayout>
      </div>
    </>
  );
};

export default CalendarView;
