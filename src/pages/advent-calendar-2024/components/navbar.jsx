import {
  ResponsiveLayout,
  Inline,
  Box,
  TelefonicaLogo,
  Touchable,
  Text3,
  TextLink,
  skinVars,
  Sheet,
  SheetBody,
  Text5,
  Stack,
  Text,
  Circle,
  Text1,
  useScreenSize,
  MainNavigationBar,
} from "@telefonica/mistica";
import RotatingSVG from "./label-rotate";
import { useNavigate, useLocation } from "react-router-dom";
import { base64Encode } from "../utils/url-encoder";
import { useState } from "react";

const SheetView = ({ isOpen, onClose, handleViewProgress }) => {
  return (
    isOpen && (
      <Sheet onClose={onClose}>
        {({ modalTitleId }) => (
          <SheetBody modalTitleId={modalTitleId}>
            <Box paddingBottom={{ mobile: 16, desktop: 0 }}>
              <Stack space={32}>
                <Stack space={32}>
                  <Text5>How this calendar works</Text5>
                  <Text3>
                    Before you begin, it’s important to follow these simple
                    instructions.
                  </Text3>
                  <Text3>
                    <Stack space={32}>
                      <Inline space={16}>
                        <Circle size={24} background={skinVars.colors.brand}>
                          <Text1 medium color={skinVars.colors.inverse}>
                            1
                          </Text1>
                        </Circle>

                        <p>
                          Each day, you'll have a chance to participate and
                          unlock a new square. Remember,{" "}
                          <strong>it’s only available that day!</strong>
                        </p>
                      </Inline>

                      <Inline space={16}>
                        <Circle size={24} background={skinVars.colors.brand}>
                          <Text1 medium color={skinVars.colors.inverse}>
                            2
                          </Text1>
                        </Circle>
                        <p>
                          In{" "}
                          <TextLink onPress={handleViewProgress}>
                            My Progress
                          </TextLink>{" "}
                          page, you can see the days you've completed, your
                          achievements, and the score you're accumulating. To
                          make sure you don't lose your progress, it's important{" "}
                          <strong>
                            <Text color={skinVars.colors.errorHigh}>
                              not to clear your browsing data.
                            </Text>
                          </strong>
                        </p>
                      </Inline>
                    </Stack>
                  </Text3>
                  <Text3>
                    <strong>That said...</strong> Can you unlock all the tiles?
                    We challenge you to do it!
                  </Text3>
                </Stack>
              </Stack>
            </Box>
          </SheetBody>
        )}
      </Sheet>
    )
  );
};

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { isMobile } = useScreenSize();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewProgress = () => {
    const completedDays =
      JSON.parse(localStorage.getItem("completedDays")) || [];

    // Encode completed days as a Base64 string
    const encodedDays = base64Encode(completedDays.join(","));
    const params = new URLSearchParams({
      completedDays: encodedDays,
    });

    navigate(`/advent-calendar-2024/progress-view?${params.toString()}`);
  };

  // Helper function to determine if the link should be underlined
  const isCurrentPage = (path) => location.pathname === path;

  return isMobile ? (
    <>
      <MainNavigationBar
        right={<TelefonicaLogo type="imagotype" size={32} />}
        withBorder={false}
        logo={<RotatingSVG />}
        sections={[
          {
            title: "Home",
            to: "/advent-calendar-2024",
            decoration: isCurrentPage("/advent-calendar-2024")
              ? "underline"
              : "none",
          },
          {
            title: "My Progress",
            onPress: handleViewProgress,
            decoration: isCurrentPage("/advent-calendar-2024/progress-view")
              ? "underline"
              : "none",
          },
          {
            title: "How it works?",
            onPress: () => setIsSheetOpen(true),
            decoration: isSheetOpen ? "underline" : "none",
          },
        ]}
      />
      <SheetView
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        handleViewProgress={handleViewProgress}
      />
    </>
  ) : (
    <ResponsiveLayout>
      <Box paddingY={24}>
        <Inline space="between" alignItems="center">
          <Touchable to={"/advent-calendar-2024"}>
            <RotatingSVG />
          </Touchable>
          <Inline space={64} alignItems="center">
            <Text3
              medium
              decoration={
                isCurrentPage("/advent-calendar-2024") ? "underline" : "none"
              }
            >
              <TextLink
                style={{ color: skinVars.colors.textPrimary }}
                to={"/advent-calendar-2024"}
              >
                Home
              </TextLink>
            </Text3>
            <Text3
              medium
              decoration={
                isCurrentPage("/advent-calendar-2024/progress-view")
                  ? "underline"
                  : "none"
              }
            >
              <TextLink
                style={{ color: skinVars.colors.textPrimary }}
                onPress={handleViewProgress}
              >
                My progress (10%)
              </TextLink>
            </Text3>
            <Text3 medium>
              <TextLink
                onPress={() => setIsSheetOpen(true)}
                style={{ color: skinVars.colors.textPrimary }}
              >
                How it works?
              </TextLink>
            </Text3>
            <TelefonicaLogo type="imagotype" size={40} />
          </Inline>
        </Inline>
      </Box>
      <SheetView
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        handleViewProgress={handleViewProgress}
      />
    </ResponsiveLayout>
  );
};

export default NavBar;
