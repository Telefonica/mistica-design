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
  Text,
  ButtonSecondary,
  IconShareFilled,
  TextLink,
  skinVars,
} from "@telefonica/mistica";
import {
  FigureLeftBottom,
  FigureLeftTop,
  FigureRightBottom,
  FigureRightTop,
} from "../components/svg-figures";

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
    <div className={styles.container}>
      {isMobile ? (
        <div className={styles.progress}>
          <ResponsiveLayout>
            <ProgressBarStepped
              steps={totalSections}
              currentStep={currentSection}
              color={skinVars.colors.warning}
            />
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
              <Logo type="imagotype" />
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
              <ButtonSecondary onPress="#" StartIcon={IconShareFilled}>
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
