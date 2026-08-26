export const updateCompletedDays = (days, setCompletedDays) => {
  setCompletedDays(days);
  localStorage.setItem("completedDays", JSON.stringify(days));
};

export const updateAchievements = (newAchievements, setAchievements) => {
  // Get existing achievements from local storage
  const existingAchievements =
    JSON.parse(localStorage.getItem("achievements")) || [];

  // Create a new set of achievements by combining existing ones with new ones
  const updatedAchievements = Array.from(
    new Set([...existingAchievements, ...newAchievements])
  );

  // Update state and local storage
  setAchievements(updatedAchievements);
  localStorage.setItem("achievements", JSON.stringify(updatedAchievements));
};
