import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Stack,
  Text3,
  Text4,
  Text8,
  ButtonPrimary,
  ResponsiveLayout,
} from "@telefonica/mistica";
import { base64Decode, base64Encode } from "../utils/url-encoder";
import {
  achievementsConfig,
  ACHIEVEMENT_PREFIX,
} from "../utils/achievement-config";

const ProgressView = () => {
  const [completedDays, setCompletedDays] = useState([]);
  const [achievements, setAchievements] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const getCompletedDaysFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const days = params.get("completedDays");
    return days ? base64Decode(days).split(",") : [];
  };

  const getAchievementsFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const achievements = params.get("achievements");
    return achievements ? base64Decode(achievements).split(",") : [];
  };

  const updateUrlWithCompletedDays = (days) => {
    const params = new URLSearchParams(location.search);
    params.set("completedDays", base64Encode(days.join(",")));
    navigate({ search: params.toString() }, { replace: true });
  };

  const updateUrlWithAchievements = (achievements) => {
    const params = new URLSearchParams(location.search);
    params.set("achievements", base64Encode(achievements.join(",")));
    navigate({ search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    const daysFromUrl = getCompletedDaysFromUrl();
    const achievementsFromUrl = getAchievementsFromUrl();

    if (daysFromUrl.length > 0) {
      setCompletedDays(daysFromUrl);
    } else {
      const storedDays = localStorage.getItem("completedDays");
      if (storedDays) {
        const parsedDays = JSON.parse(storedDays);
        setCompletedDays(parsedDays);
        updateUrlWithCompletedDays(parsedDays);
      }
    }

    if (achievementsFromUrl.length > 0) {
      const achievementsState = achievementsFromUrl.reduce((acc, id) => {
        acc[id] = { isCompleted: true, isSecret: false };
        return acc;
      }, {});
      setAchievements(achievementsState);
    } else {
      const storedAchievements = localStorage.getItem("achievements");
      if (storedAchievements) {
        const parsedAchievements = JSON.parse(storedAchievements);
        const achievementsState = parsedAchievements.reduce((acc, id) => {
          acc[id] = { isCompleted: true, isSecret: false };
          return acc;
        }, {});
        setAchievements(achievementsState);
        updateUrlWithAchievements(parsedAchievements);
      }
    }
  }, [location.search]);

  const checkAchievements = (completedDays) => {
    const newAchievements = {};

    achievementsConfig.forEach(({ id, check, isSecret }) => {
      const isCompleted = check(completedDays);
      newAchievements[id] = { isCompleted, isSecret };
    });

    return newAchievements;
  };

  useEffect(() => {
    if (completedDays.length > 0) {
      const newAchievements = checkAchievements(completedDays);
      setAchievements(newAchievements);

      const completedAchievementIds = Object.keys(newAchievements).filter(
        (id) => newAchievements[id].isCompleted
      );
      updateUrlWithAchievements(completedAchievementIds);
    }
  }, [completedDays]);

  const handleClearData = () => {
    // Clear local storage for completed days and individual achievements
    localStorage.removeItem("completedDays");

    // Clear individual achievements based on the achievementsConfig
    achievementsConfig.forEach(({ id }) => {
      localStorage.removeItem(ACHIEVEMENT_PREFIX + id);
    });

    // Clear the combined achievements entry
    localStorage.removeItem("achievements");

    // Clear the component state
    setCompletedDays([]);
    setAchievements({});

    // Clear the URL query parameters
    const params = new URLSearchParams(location.search);
    params.delete("completedDays");
    params.delete("achievements");

    // Update the URL to reflect cleared data
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <ResponsiveLayout>
      <Box padding={24}>
        <Stack space={16}>
          <Text4>Completed Days</Text4>
          {completedDays.length === 0 ? (
            <Text8>No days completed yet</Text8>
          ) : (
            <Stack space={8}>
              {completedDays.map((day) => (
                <Box key={day} padding={8} style={{ border: "1px solid #ccc" }}>
                  <Text8>{day}</Text8>
                </Box>
              ))}
            </Stack>
          )}
          <Text4>Achievements</Text4>
          {achievementsConfig.map((achievement) => {
            const achievementStatus = achievements[achievement.id] || {
              isCompleted: false,
              isSecret: achievement.isSecret,
            };
            return (
              <Box
                key={achievement.id}
                padding={8}
                style={{ border: "1px solid #ccc" }}
              >
                <Text3>
                  {achievementStatus.isSecret
                    ? "Secret Achievement"
                    : `${achievement.name}: ${achievement.description} ${
                        achievementStatus.isCompleted ? "(Completed)" : ""
                      }`}
                </Text3>
              </Box>
            );
          })}
          <ButtonPrimary onPress={handleClearData}>
            Clear local stored data
          </ButtonPrimary>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default ProgressView;
