import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Stack,
  Text3,
  Text4,
  Text8,
  Text10,
  ButtonPrimary,
  ResponsiveLayout,
  Inline,
  IconTrophyRegular,
  IconCalendarRegular,
  GridLayout,
  Tooltip,
  ProgressBar,
  IconProcessLoadingRegular,
} from "@telefonica/mistica";
import { base64Decode, base64Encode } from "../utils/url-encoder";
import {
  achievementsConfig,
  ACHIEVEMENT_PREFIX,
} from "../utils/achievement-config";
import Achievement from "../components/achievement";
import ProgressGrid from "../components/progress-grid";
import NavBar from "../components/navbar";
import { TOTAL_CALENDAR_DAYS } from "../utils/constants";

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

  const completedAchievementsCount = achievementsConfig.filter(
    (achievement) => {
      const achievementStatus = achievements[achievement.id] || {
        isCompleted: false,
      };
      return achievementStatus.isCompleted;
    }
  ).length;

  const totalAchievements = achievementsConfig.length;

  const AchievementList = ({
    completedAchievementsCount,
    totalAchievements,
  }) => {
    // Count completed achievements

    return (
      <Stack space={16}>
        <Stack space={4}>
          <Inline space={8}>
            <IconTrophyRegular></IconTrophyRegular>
            <Text4>Achievements</Text4>
          </Inline>
          <Text10>
            {completedAchievementsCount} of {totalAchievements}
          </Text10>
        </Stack>
        <Inline space={8} wrap>
          {achievementsConfig.map(
            ({ id, icon, name, description, isSecret }) => {
              const achievementStatus = achievements[id] || {
                isCompleted: false,
                isSecret,
              };

              const tooltipTitle =
                achievementStatus.isSecret && !achievementStatus.isCompleted
                  ? "Secret achievement"
                  : name;

              const tooltipDescription =
                achievementStatus.isSecret && !achievementStatus.isCompleted
                  ? "Continue searching for this achievement"
                  : description;

              return (
                <Box key={id} style={{ border: "1px solid #ccc" }}>
                  <Tooltip
                    target={
                      <Achievement
                        icon={icon}
                        isCompleted={achievementStatus.isCompleted}
                        isSecret={achievementStatus.isSecret}
                      />
                    }
                    title={tooltipTitle}
                    description={tooltipDescription}
                  />
                </Box>
              );
            }
          )}
        </Inline>
      </Stack>
    );
  };

  const TotalProgress = () => {
    return (
      <Stack space={16}>
        <Stack space={4}>
          <Inline space={8}>
            <IconProcessLoadingRegular></IconProcessLoadingRegular>
            <Text4>Total progress</Text4>
          </Inline>
          <Text10>
            {Math.round(
              ((completedDays.length + completedAchievementsCount) /
                (TOTAL_CALENDAR_DAYS + totalAchievements)) *
                100
            )}
            %
          </Text10>
        </Stack>
        <ProgressBar
          progressPercent={(completedDays.length / TOTAL_CALENDAR_DAYS) * 100}
        />
      </Stack>
    );
  };

  return (
    <>
      <NavBar />
      <ResponsiveLayout>
        <Box padding={24}>
          <Stack space={48}>
            <TotalProgress />
            <GridLayout
              verticalSpace={48}
              template="6+6"
              left={
                <Stack space={16}>
                  <Stack space={4}>
                    <Inline space={8}>
                      <IconCalendarRegular></IconCalendarRegular>
                      <Text4>Completed Days</Text4>
                    </Inline>
                    <Text10>
                      {completedDays.length} of {TOTAL_CALENDAR_DAYS}
                    </Text10>
                  </Stack>

                  <ProgressGrid completedDays={completedDays} />
                </Stack>
              }
              right={
                <AchievementList
                  completedAchievementsCount={completedAchievementsCount}
                  totalAchievements={totalAchievements}
                />
              }
            ></GridLayout>
            <ButtonPrimary onPress={handleClearData}>
              Clear local stored data
            </ButtonPrimary>
          </Stack>
        </Box>
      </ResponsiveLayout>
    </>
  );
};

export default ProgressView;
