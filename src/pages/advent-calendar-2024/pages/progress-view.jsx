import {
  Box,
  ButtonPrimary,
  Grid,
  GridItem,
  GridLayout,
  IconInformationRegular,
  IconTrophyFilled,
  Inline,
  ProgressBar,
  ResponsiveLayout,
  skinVars,
  Stack,
  Text,
  Text4,
  Tooltip,
  useScreenSize,
} from "@telefonica/mistica";
import { useEffect, useState } from "react";
import { IconCard, IconInvader } from "../assets/icons/icons";
import Achievement from "../components/achievement";
import CornerLayout from "../components/corner-layout.jsx";
import NavBar from "../components/navbar";
import ProgressGrid from "../components/progress-grid";
import Snow from "../components/snow.tsx";
import {
  ACHIEVEMENT_PREFIX,
  achievementsConfig,
  getAchievementFromLocalStorage,
} from "../utils/achievement-config";
import { calendarDays } from "../utils/calendar-config.jsx";

const ProgressView = () => {
  const [completedDays, setCompletedDays] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [gameScores, setGameScores] = useState({});

  const { isTabletOrSmaller } = useScreenSize();

  useEffect(() => {
    // Retrieve and parse completed days
    const storedDays = localStorage.getItem("completedDays");
    const parsedDays = storedDays ? JSON.parse(storedDays) : [];
    setCompletedDays(parsedDays);

    // Retrieve and parse game scores
    const storedScores = localStorage.getItem("gameScores");
    const scores = storedScores ? JSON.parse(storedScores) : {};
    setGameScores(scores);

    // Dynamically build the achievements state based on localStorage values
    const achievementsState = {};
    achievementsConfig.forEach(({ id, isSecret }) => {
      // If an achievement is stored in localStorage and is completed, set it to true
      const isCompleted = getAchievementFromLocalStorage(id); // If the achievement is in localStorage, it's considered completed
      achievementsState[id] = {
        isCompleted, // true if completed, false if not
        isSecret,
      };
    });
    setAchievements(achievementsState);
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
          {calendarDays.length}
        </Text>
        <Stack space={4}>
          <Inline space={8} alignItems="center">
            <Text4 medium>
              Total progress{" "}
              {Math.round(
                ((completedDays.length + completedAchievementsCount) /
                  (calendarDays.length + totalAchievements)) *
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
            {calendarDays.length}
          </Text>

          <Inline space={8} alignItems="center" fullWidth>
            <Text4 medium>
              Total progress{" "}
              {Math.round(
                ((completedDays.length + completedAchievementsCount) /
                  (calendarDays.length + totalAchievements)) *
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
      <CornerLayout />
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
                              (completedDays.length / calendarDays.length) * 100
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
          </Stack>
        </Box>
      </ResponsiveLayout>
    </>
  );
};

export default ProgressView;
