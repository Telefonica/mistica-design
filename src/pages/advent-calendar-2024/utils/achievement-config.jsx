import { IconBugFilled, IconTree2Filled } from "@telefonica/mistica";
import { updateAchievements } from "./state-manager";
import { CHRISTMAS_DAY, TOTAL_CALENDAR_DAYS } from "./constants";

// Define your achievements and their conditions
export const achievementsConfig = [
  {
    id: "christmasDay",
    name: "Christmas Day",
    description: "Complete a task on Christmas Day",
    icon: IconTree2Filled,
    check: (newCompletedDays) => newCompletedDays.some(isChristmasDay),
    message: "Achievement Unlocked: You completed a task on Christmas Day!",
    isSecret: false,
  },
  {
    id: "firstGlance",
    name: "First Glance",
    description: "Unlock the first day of the calendar",
    icon: IconBugFilled,
    check: (newCompletedDays) => newCompletedDays.length > 0, // Unlock when the first day is completed
    message:
      "Achievement Unlocked: First Glance - You have unlocked the first day of the calendar!",
    isSecret: false,
  },
  {
    id: "dynamicDuo",
    name: "Dynamic Duo",
    description: "Complete two tasks on consecutive days",
    icon: IconBugFilled,
    check: (newCompletedDays) => hasConsecutiveDays(newCompletedDays),
    message:
      "Achievement Unlocked: Dynamic Duo - You have unlocked two consecutive days!",
    isSecret: false,
  },
  {
    id: "whatAWeek",
    name: "What a Week",
    description: "Complete seven tasks on consecutive days",
    icon: IconBugFilled,
    check: (newCompletedDays) =>
      hasConsecutiveDays(newCompletedDays) && newCompletedDays.length >= 7,
    message:
      "Achievement Unlocked: What a Week - You have unlocked 7 consecutive days!",
    isSecret: false,
  },
  {
    id: "restDay",
    name: "Rest Day",
    description: "Unlock a weekend day",
    icon: IconBugFilled,
    check: (newCompletedDays) => newCompletedDays.some(isWeekendDay),
    message:
      "Achievement Unlocked: Rest Day - You have unlocked a weekend day!",
    isSecret: false,
  },
  {
    id: "adventChampion",
    name: "Advent Champion",
    description: "Unlock all days in the advent calendar",
    icon: IconBugFilled,
    check: (newCompletedDays) =>
      newCompletedDays.length === TOTAL_CALENDAR_DAYS,
    message:
      "Achievement Unlocked: Advent Champion - You have unlocked all days!",
    isSecret: true,
  },
  {
    id: "gameMaster",
    name: "Game Master",
    description: "Complete all game days",
    icon: IconBugFilled,
    check: (newCompletedDays) => {
        const gameDays = ["2023-12-01", "2023-12-08", "2023-12-15", "2023-12-22"]; //CAMBIAR ESTO A LOS DÍAS DE JUEGOSSS
        return gameDays.every((day) => newCompletedDays.includes(day));
    },
    message: "Achievement Unlocked: Game Master - You have completed all game days!",
    isSecret: false,
  },
  {
    id: "highScorer",
    name: "High Scorer",
    description: "Accumulate a score of 800 points or more",
    icon: IconBugFilled,
    check: () => {
        const allpoints = JSON.parse(localStorage.getItem("totalScore")) || 0;
        return allpoints >= 800;
    },
    message: "Achievement Unlocked: Score Master - You've scored 800 points or more!",
    isSecret: false,
  },
];

// Existing functions
const hasConsecutiveDays = (dates) => {
  // Convert string dates to Date objects for comparison and sort them
  const sortedDates = dates.map((date) => new Date(date)).sort((a, b) => a - b);

  // Check if we have at least two completed days
  if (sortedDates.length < 2) return false;

  const lastIndex = sortedDates.length - 1;
  const firstDate = sortedDates[lastIndex - 1];
  const secondDate = sortedDates[lastIndex];
  const oneDayInMs = 24 * 60 * 60 * 1000;

  // Check if the second date is exactly one day after the first
  return secondDate - firstDate === oneDayInMs;
};

// Function to check if a day is a weekend
const isWeekendDay = (date) => {
  const day = new Date(date).getUTCDay(); // 0 for Sunday, 6 for Saturday
  return day === 0 || day === 6; // Return true if it's a weekend
};

const isChristmasDay = (date) => {
  const [_, month, day] = date.split("-");
  return day === CHRISTMAS_DAY;
};

export const ACHIEVEMENT_PREFIX = "achievement_"; // Prefix for localStorage keys

// Function to get achievement status from localStorage
const getAchievementFromLocalStorage = (id) => {
  return JSON.parse(localStorage.getItem(ACHIEVEMENT_PREFIX + id)) || false;
};

// Function to save achievement status to localStorage
const setAchievementToLocalStorage = (id, isCompleted) => {
  localStorage.setItem(ACHIEVEMENT_PREFIX + id, JSON.stringify(isCompleted));
};

// Check and unlock achievements
export const checkAndUnlockAchievements = (
  newCompletedDays,
  achievements,
  setAchievements,
  navigate,
  location
) => {
  achievementsConfig.forEach(({ id, check, message, isSecret }) => {
    const isAchievementUnlocked =
      achievements[id]?.isCompleted || getAchievementFromLocalStorage(id);

    console.log(
      `Checking achievement: ${id}, Unlocked: ${isAchievementUnlocked}`
    );

    // If the achievement is not yet unlocked and the condition is met
    if (!isAchievementUnlocked) {
      if (check(newCompletedDays)) {
        console.log(`Unlocking achievement: ${id}`); // Debugging
        alert(message); // Immediate test for alert functionality

        setAchievements((prev) => {
          const updatedAchievements = {
            ...prev,
            [id]: { isCompleted: true, isSecret }, // Mark achievement as completed
          };
          console.log("Updated Achievements:", updatedAchievements); // Check state update
          return updatedAchievements;
        });

        setAchievementToLocalStorage(id, true);
        updateAchievements(
          Object.keys(achievements)
            .filter((key) => achievements[key].isCompleted)
            .map((key) => key),
          setAchievements,
          navigate,
          location
        );
      }
    }
  });
};
