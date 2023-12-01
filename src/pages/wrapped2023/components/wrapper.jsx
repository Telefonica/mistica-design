import React, { useState, useCallback } from "react";
import styles from "./wrapper.module.css";
import RotatingSVG from "./label-rotate";
import {
  Logo,
  useScreenSize,
  ProgressBarStepped,
  ResponsiveLayout,
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
            <Logo type="imagotype" />
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
