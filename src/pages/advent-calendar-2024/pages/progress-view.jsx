import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Stack,
  Text4,
  Text8,
  ButtonPrimary,
  ResponsiveLayout,
} from "@telefonica/mistica";
import { base64Decode, base64Encode } from "../utils/url-encoder";

const ProgressView = () => {
  const [completedDays, setCompletedDays] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to parse completed days from the URL query string
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

  // Function to update the URL with completed days
  const updateUrlWithCompletedDays = (days) => {
    const params = new URLSearchParams(location.search);
    params.set("completedDays", base64Encode(days.join(","))); // Encode here
    navigate({ search: params.toString() }, { replace: true });
  };

  const updateUrlWithAchievements = (achievements) => {
    const params = new URLSearchParams(location.search);
    params.set("achievements", base64Encode(achievements.join(","))); // Encode here
    navigate({ search: params.toString() }, { replace: true });
  };

  // Fetch and synchronize local storage and URL parameters on component mount
  useEffect(() => {
    const daysFromUrl = getCompletedDaysFromUrl();
    const achievementsFromUrl = getAchievementsFromUrl();

    // If completed days are not in the URL, fallback to local storage
    if (daysFromUrl.length > 0) {
      setCompletedDays(daysFromUrl);
    } else {
      const storedDays = localStorage.getItem("completedDays");
      if (storedDays) {
        const parsedDays = JSON.parse(storedDays);
        setCompletedDays(parsedDays);
        updateUrlWithCompletedDays(parsedDays); // Sync localStorage with the URL
      }
    }

    // If achievements are not in the URL, fallback to local storage
    if (achievementsFromUrl.length > 0) {
      setAchievements(achievementsFromUrl);
    } else {
      const storedAchievements = localStorage.getItem("achievements");
      if (storedAchievements) {
        const parsedAchievements = JSON.parse(storedAchievements);
        setAchievements(parsedAchievements);
        updateUrlWithAchievements(parsedAchievements); // Sync localStorage with the URL
      }
    }
    // Only execute this effect on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {achievements.length === 0 ? (
            <Text8>No achievements yet</Text8>
          ) : (
            <Stack space={8}>
              {achievements.map((achievement) => (
                <Box
                  key={achievement}
                  padding={8}
                  style={{ border: "1px solid #ccc" }}
                >
                  <Text8>{achievement}</Text8>
                </Box>
              ))}
            </Stack>
          )}
          <ButtonPrimary
            onPress={() => {
              setCompletedDays([]);
              setAchievements([]);
              localStorage.removeItem("completedDays");
              localStorage.removeItem("achievements");
              updateUrlWithCompletedDays([]); // Clear the URL query parameter
              updateUrlWithAchievements([]); // Clear the URL query parameter
            }}
          >
            Clear local stored data
          </ButtonPrimary>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default ProgressView;
