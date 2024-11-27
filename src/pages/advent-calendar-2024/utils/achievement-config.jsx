import {
  IconArrowUpDownFilled,
  IconBellFilled,
  IconCalendarFilled,
  IconEyeFilled,
  IconSnowflakeRegular,
  IconBugFilled,
  IconVideoCameraFilled,
} from "@telefonica/mistica";
import { updateAchievements } from "./state-manager";

const CHRISTMAS_DAY = "25";

// Define your achievements and their conditions
export const achievementsConfig = [
  {
    id: "christmasDay",
    name: "Christmas Day",
    description: "Complete a task on Christmas Day",
    icon: IconBellFilled,
    check: (newCompletedDays) => newCompletedDays.some(isChristmasDay),
    message: "You completed a task on Christmas Day!",
    isSecret: false,
  },
  {
    id: "firstGlance",
    name: "First Glance",
    description: "Unlock the first day of the calendar",
    icon: IconEyeFilled,
    check: (newCompletedDays) => newCompletedDays.length > 0, // Unlock when the first day is completed
    message: "You have unlocked the first day of the calendar!",
    isSecret: false,
  },
  {
    id: "dynamicDuo",
    name: "Dynamic Duo",
    description: "Complete two tasks on consecutive days",
    icon: IconArrowUpDownFilled,
    check: (newCompletedDays) => hasConsecutiveDays(newCompletedDays),
    message: "You have unlocked two consecutive days!",
    isSecret: false,
  },
  {
    id: "whatAWeek",
    name: "What a Week",
    description: "Complete seven tasks on consecutive days",
    icon: IconCalendarFilled,
    check: (newCompletedDays) =>
      hasConsecutiveDays(newCompletedDays) && newCompletedDays.length >= 7,
    message: "You have unlocked 7 consecutive days!",
    isSecret: false,
  },
  {
    id: "adventChampion",
    name: "Advent Champion",
    description: "Unlock all days in the advent calendar",
    icon: IconSnowflakeRegular,
    check: (newCompletedDays) => newCompletedDays.length === 18,
    message: "You have unlocked all days!",
    isSecret: true,
  },
  {
    id: "gameMaster",
    name: "Game Master",
    description: "Complete all game days",
    icon: IconBugFilled,
    check: (newCompletedDays) => {
      const gameDays = [
        "2024-12-02",
        "2024-12-03",
        "2024-12-05",
        "2024-12-10",
        "2024-12-11",
        "2024-12-13",
        "2024-12-17",
        "2024-12-18",
        "2024-12-20",
      ];
      return gameDays.every((day) => newCompletedDays.includes(day));
    },
    message:
      "Achievement Unlocked: Game Master - You have completed all game days!",
    isSecret: false,
  },
  {
    id: "movieMaster",
    name: "Movie Master",
    description: "Get the maximum score in the Emoji Movies game",
    icon: IconVideoCameraFilled,
    check: () => {
      const gameScores = JSON.parse(localStorage.getItem("gameScores")) || {};
      const emojiMovies1Score = gameScores["Emoji Movies1"]?.score || 0;
      const emojiMovies2Score = gameScores["Emoji Movies2"]?.score || 0;
      const totalScore = emojiMovies1Score + emojiMovies2Score;
      return totalScore > 800;
    },

    message:
      "You know your movies! You achieve the maximum score in the Emoji Movies game!",
    isSecret: false,
  },
];

const hasConsecutiveDays = (dates) => {
  // Convert string dates to Date objects for comparison and sort them
  const sortedDates = dates.map((date) => new Date(date)).sort((a, b) => a - b);

  // Check if we have at least two completed days
  if (sortedDates.length < 2) return false;

  // Iterate over the sorted dates and check for consecutive days
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = sortedDates[i];
    const nextDate = sortedDates[i + 1];
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // Check if the next date is exactly one day after the current date
    if (nextDate - currentDate !== oneDayInMs) {
      return false;
    }
  }

  return true; // All dates are consecutive
};

const isChristmasDay = (date) => {
  const [, , day] = date.split("-");
  return day === CHRISTMAS_DAY;
};

export const ACHIEVEMENT_PREFIX = "achievement_"; // Prefix for localStorage keys

// Function to get achievement status from localStorage
export const getAchievementFromLocalStorage = (id) => {
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
  showToast
) => {
  achievementsConfig.forEach(({ id, check, name, message, icon, isSecret }) => {
    const isAchievementUnlocked =
      achievements[id]?.isCompleted || getAchievementFromLocalStorage(id);

    // If the achievement is not yet unlocked and the condition is met
    if (!isAchievementUnlocked) {
      if (check(newCompletedDays)) {
        setAchievements((prev) => {
          const updatedAchievements = {
            ...prev,
            [id]: { isCompleted: true, isSecret }, // Mark achievement as completed
          };
          return updatedAchievements;
        });

        setAchievementToLocalStorage(id, true);
        showToast({ id, icon, name, message });
        updateAchievements(
          Object.keys(achievements)
            .filter((key) => achievements[key].isCompleted)
            .map((key) => key),
          setAchievements
        );
      }
    }
  });
};
