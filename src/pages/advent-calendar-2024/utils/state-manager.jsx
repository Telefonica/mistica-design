// utils/stateManager.js
import { base64Encode } from "./url-encoder";

export const updateCompletedDays = (
  days,
  setCompletedDays,
  navigate,
  location
) => {
  setCompletedDays(days);
  localStorage.setItem("completedDays", JSON.stringify(days));
  const params = new URLSearchParams(location.search);
  params.set("completedDays", base64Encode(days.join(",")));
  navigate({ search: params.toString() }, { replace: true });
};

export const updateAchievements = (
  newAchievements,
  setAchievements,
  navigate,
  location
) => {
  // Get existing achievements from local storage
  const existingAchievements =
    JSON.parse(localStorage.getItem("achievements")) || [];

  console.log(
    "Existing Achievements from local storage:",
    existingAchievements
  );

  // Create a new set of achievements by combining existing ones with new ones
  const updatedAchievements = Array.from(
    new Set([...existingAchievements, ...newAchievements])
  );

  console.log("Updated Achievements to save:", updatedAchievements);

  // Update state and local storage
  setAchievements(updatedAchievements);
  localStorage.setItem("achievements", JSON.stringify(updatedAchievements));

  // Update the URL parameters
  const params = new URLSearchParams(location.search);
  params.set("achievements", base64Encode(updatedAchievements.join(",")));
  navigate({ search: params.toString() }, { replace: true });
};
