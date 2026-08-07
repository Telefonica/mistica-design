import React, { useState, useCallback } from "react";
import styles from "./wrapper.module.css";
import RotatingSVG from "./label-rotate";
import {
  Logo,
  useScreenSize,
  ProgressBarStepped,
  ResponsiveLayout,
  ThemeVariant,
  Text2,
  ButtonSecondary,
  IconShareFilled,
  TextLink,
  skinVars,
  Inline,
  Stack,
} from "@telefonica/mistica";

const Wrapper = ({ children }) => {
  const { isMobile } = useScreenSize();
  const [currentSection, setCurrentSection] = useState(1);

  const handleInView = useCallback(
    (sectionNumber) => {
      // Check if the new sectionNumber is different from the currentSection
      if (sectionNumber !== currentSection) {
        setCurrentSection(sectionNumber);
      }
    },
    [currentSection]
  );

  const totalSections = React.Children.count(children);

  return (
    <div
      className={styles.container}
      style={{ background: skinVars.colors.background }}
    >
      {isMobile ? (
        <div className={styles.progress}>
          <ResponsiveLayout>
            <Stack space={16}>
              <ProgressBarStepped
                steps={totalSections}
                currentStep={currentSection}
                color={skinVars.colors.brand}
              />
              <Inline fullWidth space="between" alignItems="center">
                <RotatingSVG
                  fill={
                    currentSection === 1
                      ? skinVars.colors.inverse
                      : skinVars.colors.neutralHigh
                  }
                ></RotatingSVG>

                <ThemeVariant isInverse={currentSection === 1 ? true : false}>
                  <Logo size={isMobile ? 32 : 56} type="imagotype" />
                </ThemeVariant>
              </Inline>
            </Stack>
          </ResponsiveLayout>
        </div>
      ) : (
        <>
          <div className={styles.labelRotate}>
            <RotatingSVG
              fill={
                currentSection === 1
                  ? skinVars.colors.inverse
                  : skinVars.colors.neutralHigh
              }
            ></RotatingSVG>
          </div>
          <div className={styles.logo}>
            <ThemeVariant isInverse={currentSection === 1 ? true : false}>
              <Logo size={isMobile ? 48 : 56} type="imagotype" />
            </ThemeVariant>
          </div>
          <div className={styles.madeBy}>
            <ThemeVariant isInverse={currentSection === 1 ? true : false}>
              <Text2
                color={
                  currentSection === 1
                    ? skinVars.colors.textPrimaryInverse
                    : undefined
                }
              >
                made with{" "}
                <Text2 medium>
                  <TextLink
                    href="https://github.com/Telefonica/mistica"
                    newTab={true}
                  >
                    Mística
                  </TextLink>
                </Text2>
              </Text2>
            </ThemeVariant>
          </div>
          <div className={styles.shareButton}>
            <ThemeVariant isInverse={currentSection === 1 ? true : false}>
              <ButtonSecondary
                onPress={() => {
                  navigator.clipboard.writeText(
                    "https://mistica-design.vercel.app/wrapped-2023"
                  );
                }}
                StartIcon={IconShareFilled}
              >
                Share
              </ButtonSecondary>
            </ThemeVariant>
          </div>
        </>
      )}

      <div className={`${isMobile ? styles.scrollX : styles.scrollY} wrapper`}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            sectionNumber: index + 1,
            onInView: handleInView,
          })
        )}
      </div>
    </div>
  );
};

export default Wrapper;
