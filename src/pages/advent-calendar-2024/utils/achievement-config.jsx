import { updateAchievements } from "./state-manager";

// Define your achievements and their conditions
const achievementsConfig = [
  {
    id: "christmasDay",
    check: (newCompletedDays) => newCompletedDays.some(isChristmasDay),
    message: "Achievement Unlocked: You completed a task on Christmas Day!",
  },
  {
    id: "firstGlance",
    check: (newCompletedDays) => newCompletedDays.length > 0, // Unlock when the first day is completed
    message:
      "Achievement Unlocked: First Glance - You have unlocked the first day of the calendar!",
  },
  {
    id: "dynamicDuo",
    check: (newCompletedDays) => hasConsecutiveDays(newCompletedDays),
    message:
      "Achievement Unlocked: Dynamic Duo - You have unlocked two consecutive days!",
  },
  {
    id: "whatAWeek",
    check: (newCompletedDays) =>
      hasConsecutiveDays(newCompletedDays) && newCompletedDays.length >= 7,
    message:
      "Achievement Unlocked: What a Week - You have unlocked 7 consecutive days!",
  },
  {
    id: "restDay",
    check: (newCompletedDays) => newCompletedDays.some(isWeekendDay),
    message:
      "Achievement Unlocked: Rest Day - You have unlocked a weekend day!",
  },
  {
    id: "adventChampion",
    check: (newCompletedDays) => newCompletedDays.length === 24, // Assuming 31 days in the advent calendar
    message:
      "Achievement Unlocked: Advent Champion - You have unlocked all days!",
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
  return day === "25"; // Ensure it's December 25
};

// Check and unlock achievements
export const checkAndUnlockAchievements = (
  newCompletedDays,
  achievements,
  setAchievements,
  navigate,
  location
) => {
  achievementsConfig.forEach(({ id, check, message }) => {
    const isAchievementUnlocked = achievements.includes(id);

    // If the achievement is not yet unlocked and the condition is met
    if (!isAchievementUnlocked && check(newCompletedDays)) {
      alert(message); // Show alert for the unlocked achievement
      updateAchievements(
        [...achievements, id],
        setAchievements,
        navigate,
        location
      ); // Add new achievement to existing ones
    }
  });
};
