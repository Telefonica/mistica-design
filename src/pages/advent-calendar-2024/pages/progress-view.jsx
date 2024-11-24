import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Stack,
  Text,
  Text4,
  ButtonPrimary,
  ResponsiveLayout,
  Inline,
  IconTrophyFilled,
  GridLayout,
  Tooltip,
  ProgressBar,
  skinVars,
  IconInformationRegular,
  Grid,
  GridItem,
  useScreenSize,
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
import { IconInvader, IconCard } from "../assets/icons/icons";
import { calendarDays } from "../utils/calendar-config";
import Snow from "../components/snow.tsx";

const ProgressView = () => {
  const [completedDays, setCompletedDays] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [gameScores, setGameScores] = useState({});

  const { isTabletOrSmaller } = useScreenSize();

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

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("gameScores")) || {};
    setGameScores(scores);
  }, []);

  const handleClearData = () => {
    // Clear local storage for completed days and individual achievements
    localStorage.removeItem("completedDays");

    // Clear individual achievements based on the achievementsConfig
    achievementsConfig.forEach(({ id }) => {
      localStorage.removeItem(ACHIEVEMENT_PREFIX + id);
    });

    localStorage.removeItem("gameScores");

    // Clear the combined achievements entry
    localStorage.removeItem("achievements");

    // Clear the component state
    setCompletedDays([]);
    setAchievements({});
    setGameScores({});

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
      <Stack space={isTabletOrSmaller ? 32 : 64}>
        <Stack space={16}>
          <Inline space={8} alignItems="center">
            <div style={{ height: 20 }}>
              <IconTrophyFilled size={20} />
            </div>
            <Text4 medium>Achievements</Text4>
          </Inline>
          <Text
            size={80}
            mobileSize={48}
            lineHeight={80}
            mobileLineHeight={48}
            weight="bold"
          >
            {completedAchievementsCount}{" "}
            <Text
              size={64}
              mobileSize={32}
              lineHeight={64}
              mobileLineHeight={32}
            >
              of
            </Text>{" "}
            {totalAchievements}
          </Text>
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
                    delay={false}
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
    return isTabletOrSmaller ? (
      <Stack space={24}>
        <Text
          size={80}
          mobileSize={48}
          lineHeight={80}
          mobileLineHeight={48}
          weight="bold"
        >
          {completedDays.length}{" "}
          <Text size={64} mobileSize={48} lineHeight={64} mobileLineHeight={48}>
            of
          </Text>{" "}
          {TOTAL_CALENDAR_DAYS}
        </Text>
        <Stack space={4}>
          <Inline space={8} alignItems="center">
            <Text4 medium>
              Total progress{" "}
              {Math.round(
                ((completedDays.length + completedAchievementsCount) /
                  (TOTAL_CALENDAR_DAYS + totalAchievements)) *
                  100
              )}
              %
            </Text4>
            <Tooltip
              delay={false}
              position="right"
              description="Total progress is calculated based on the number of completed days and achievements"
              target={
                <div style={{ height: 20 }}>
                  <IconInformationRegular
                    size={20}
                    color={skinVars.colors.brand}
                  />
                </div>
              }
            />
          </Inline>
        </Stack>
      </Stack>
    ) : (
      <div style={{ width: "100%" }}>
        <Inline space="between" alignItems="baseline" fullWidth>
          <Text
            size={80}
            mobileSize={48}
            lineHeight={80}
            mobileLineHeight={48}
            weight="bold"
          >
            {completedDays.length}{" "}
            <Text
              size={64}
              mobileSize={48}
              lineHeight={64}
              mobileLineHeight={48}
            >
              of
            </Text>{" "}
            {TOTAL_CALENDAR_DAYS}
          </Text>

          <Inline space={8} alignItems="center" fullWidth>
            <Text4 medium>
              Total progress{" "}
              {Math.round(
                ((completedDays.length + completedAchievementsCount) /
                  (TOTAL_CALENDAR_DAYS + totalAchievements)) *
                  100
              )}
              %
            </Text4>
            <Tooltip
              delay={false}
              position="right"
              description="Total progress is calculated based on the number of completed days and achievements"
              target={
                <div style={{ height: 20 }}>
                  <IconInformationRegular
                    size={20}
                    color={skinVars.colors.brand}
                  />
                </div>
              }
            />
          </Inline>
        </Inline>
      </div>
    );
  };

  const totalGamePoints = Object.values(gameScores).reduce(
    (acc, { score }) => acc + score,
    0
  );

  return (
    <>
      <Snow />
      <NavBar />
      <ResponsiveLayout>
        <Box paddingY={24}>
          <Stack space={48}>
            <GridLayout
              verticalSpace={48}
              template="8+4"
              left={
                <Stack space={32}>
                  <Grid columns={isTabletOrSmaller ? undefined : 8}>
                    <GridItem columnSpan={6}>
                      <Stack space={isTabletOrSmaller ? 24 : 16}>
                        <Inline space={8} alignItems="center">
                          <IconCard size={20} />

                          <Text4 medium>Completed Days</Text4>
                        </Inline>
                        <Stack space={isTabletOrSmaller ? 16 : 32}>
                          <TotalProgress />
                          <ProgressBar
                            progressPercent={
                              (completedDays.length / TOTAL_CALENDAR_DAYS) * 100
                            }
                          />
                        </Stack>
                      </Stack>
                    </GridItem>
                  </Grid>
                  <ProgressGrid completedDays={completedDays} />
                </Stack>
              }
              right={
                <div style={{ position: "sticky", height: "auto", top: 80 }}>
                  <Grid columns={4} alignContent>
                    <GridItem
                      columnSpan={isTabletOrSmaller ? "full" : 3}
                      columnStart={isTabletOrSmaller ? undefined : 2}
                    >
                      <Stack space={56}>
                        <AchievementList
                          completedAchievementsCount={
                            completedAchievementsCount
                          }
                          totalAchievements={totalAchievements}
                        />
                        <Stack space={16}>
                          <Inline space={8} alignItems="center">
                            <IconInvader size={20}></IconInvader>
                            <Text4 medium>Total game points</Text4>
                          </Inline>
                          <Text
                            size={80}
                            mobileSize={48}
                            lineHeight={80}
                            mobileLineHeight={48}
                            weight="bold"
                          >
                            {totalGamePoints}
                          </Text>
                        </Stack>
                      </Stack>
                    </GridItem>
                  </Grid>
                </div>
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
