import {
  Box,
  Circle,
  Divider,
  Inline,
  MainNavigationBar,
  NegativeBox,
  ResponsiveLayout,
  Row,
  RowList,
  Sheet,
  SheetBody,
  Stack,
  TelefonicaLogo,
  Text,
  Text1,
  Text3,
  Text5,
  TextLink,
  Tooltip,
  skinVars,
  useScreenSize,
} from "@telefonica/mistica";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RotatingSVG from "./label-rotate";
import { CLAIM_GIFT_DATE } from "../utils/constants";

const SheetView = ({ isOpen, onClose }) => {
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
                          <TextLink to={`/advent-calendar-2024/progress-view`}>
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
                      <Inline space={16}>
                        <Circle size={24} background={skinVars.colors.brand}>
                          <Text1 medium color={skinVars.colors.inverse}>
                            3
                          </Text1>
                        </Circle>
                        <p>
                          Always <strong>access it from the same device</strong>{" "}
                          to avoid losing your score.
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

const targetDate = new Date(CLAIM_GIFT_DATE);

const NavBar = () => {
  const location = useLocation(); // Get the current location
  const { isMobile, isTabletOrSmaller } = useScreenSize();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  const [isGiftEnabled, setIsGiftEnabled] = useState(false);

  useLayoutEffect(() => {
    const now = new Date();
    const timeToReleaseGift = Math.max(
      0,
      Math.min(2147483647, targetDate.getTime() - now.getTime())
    );

    const timeout = setTimeout(() => {
      setIsGiftEnabled(true);
    }, timeToReleaseGift);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const updateLogoVisibility = () => {
      setShowLogo(window.innerWidth < 1560);
    };

    // Set initial state and listen for resize events
    updateLogoVisibility();
    window.addEventListener("resize", updateLogoVisibility);

    return () => {
      window.removeEventListener("resize", updateLogoVisibility);
    };
  }, []);

  // Helper function to determine if the link should be underlined
  const isCurrentPage = (path) => location.pathname === path;

  return isMobile ? (
    <>
      <MainNavigationBar
        right={<TelefonicaLogo type="imagotype" size={32} />}
        withBorder={false}
        logo={<RotatingSVG />}
        burgerMenuExtra={
          <div style={{ marginTop: -16 }}>
            <Divider />
            <NegativeBox>
              <RowList>
                <Row
                  title="Claim your gift"
                  {...(isGiftEnabled
                    ? {
                        to: "/advent-calendar-2024/claim-your-gift",
                      }
                    : { onPress: () => {} })}
                  disabled={!isGiftEnabled}
                />
              </RowList>
            </NegativeBox>
          </div>
        }
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
            to: "/advent-calendar-2024/progress-view",
            decoration: isCurrentPage("/advent-calendar-2024/progress-view")
              ? "underline"
              : "none",
          },
          {
            title: "How it works?",
            onPress: () => setIsSheetOpen(true),
            decoration: isSheetOpen ? "underline" : "none",
          },
          {
            title: "Discover Mística",
            href: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/get-started/what-is-mistica",
            newTab: true,
          },
        ]}
      />
      <SheetView isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  ) : (
    <ResponsiveLayout>
      <Box paddingY={40}>
        <Inline space="between" alignItems="center">
          <div></div>

          <Inline space={isTabletOrSmaller ? 24 : 64} alignItems="center">
            {!isGiftEnabled ? (
              <Tooltip
                delay={false}
                target={
                  <Text3
                    medium
                    decoration={
                      isCurrentPage("/advent-calendar-2024/claim-your-gift")
                        ? "underline"
                        : "none"
                    }
                  >
                    <TextLink
                      style={{ color: skinVars.colors.textPrimary }}
                      onPress={() => {}}
                      disabled
                    >
                      Claim your gift
                    </TextLink>
                  </Text3>
                }
                description="You will be able to claim the gift on December 25."
              />
            ) : (
              <Text3
                medium
                decoration={
                  isCurrentPage("/advent-calendar-2024/claim-your-gift")
                    ? "underline"
                    : "none"
                }
              >
                <TextLink
                  style={{ color: skinVars.colors.textPrimary }}
                  to={"/advent-calendar-2024/claim-your-gift"}
                  disabled={!isGiftEnabled}
                >
                  Claim your gift
                </TextLink>
              </Text3>
            )}

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
                to={"/advent-calendar-2024/progress-view"}
              >
                My progress
              </TextLink>
            </Text3>
            <Text3 medium>
              <TextLink
                onPress={() => setIsSheetOpen(true)}
                style={{ color: skinVars.colors.textPrimary }}
              >
                How to play
              </TextLink>
            </Text3>

            <Text3 medium>
              <TextLink
                href="https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/get-started/what-is-mistica"
                newTab
              >
                Discover Mística
              </TextLink>
            </Text3>

            {showLogo && <TelefonicaLogo type="imagotype" size={40} />}
          </Inline>
        </Inline>
      </Box>
      <SheetView isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </ResponsiveLayout>
  );
};

export default NavBar;
