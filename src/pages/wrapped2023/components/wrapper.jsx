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
} from "@telefonica/mistica";

const Wrapper = ({ children }) => {
  const { isMobile } = useScreenSize();
  const [currentSection, setCurrentSection] = useState(1);

  const handleInView = useCallback(
    (sectionNumber) => {
      // Check if the new sectionNumber is different from the currentSection
      if (sectionNumber !== currentSection) {
        setCurrentSection(sectionNumber);
        console.log("Section in view: ", sectionNumber);
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
            />
          </ResponsiveLayout>
        </div>
      ) : (
        <>
          <div className={styles.labelRotate}>
            <RotatingSVG
              fill={currentSection === 1 ? "white" : undefined}
            ></RotatingSVG>
          </div>
          <div className={styles.logo}>
            <ThemeVariant
              isInverse={currentSection === 1 ? "white" : undefined}
            >
              <Logo type="imagotype" />
            </ThemeVariant>
          </div>
          <div className={styles.madeBy}>
            <Text2 color={currentSection === 1 ? "white" : undefined}>
              made with{" "}
              <Text2 medium color={currentSection === 1 ? "white" : undefined}>
                <TextLink
                  href="https://github.com/Telefonica/mistica"
                  newTab={true}
                >
                  Mística
                </TextLink>
              </Text2>
            </Text2>
          </div>
          <div className={styles.shareButton}>
            <ThemeVariant
              isInverse={currentSection === 1 ? "white" : undefined}
            >
              <ButtonSecondary onPress="#" StartIcon={IconShareFilled}>
                Share
              </ButtonSecondary>
            </ThemeVariant>
          </div>
        </>
      )}

      <div className={isMobile ? styles.scrollX : styles.scrollY}>
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
