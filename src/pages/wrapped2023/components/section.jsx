import { useScreenSize } from "@telefonica/mistica";
import styles from "./section.module.css";
import React, { useEffect, useRef } from "react";
import MarginLayout from "./margin-layout";

const Section = ({
  sectionNumber,
  onInView,
  color,
  children,
  forwardedRef,
  sticky,
}) => {
  const sectionRef = useRef();
  const { isMobile } = useScreenSize();

  useEffect(() => {
    let animationFrameId;

    const handleVisibility = () => {
      const rect = sectionRef.current.getBoundingClientRect();
      const center = (rect.left + rect.right) / 2;

      if (isMobile) {
        // Check if the center of the section is at least 1 pixel visible in the viewport
        if (center >= 0 && center <= window.innerWidth) {
          onInView(sectionNumber);
        }
      } else {
        // Check if the center of the section is at least 1 pixel visible in the viewport
        if (rect.top <= 0 && rect.bottom >= 1) {
          onInView(sectionNumber);
        }
      }

      animationFrameId = requestAnimationFrame(handleVisibility);
    };

    handleVisibility(); // Call once to start the loop

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onInView, sectionNumber]);

  // Forward the ref to the div element
  React.useImperativeHandle(forwardedRef, () => ({
    getBoundingClientRect: () => sectionRef.current.getBoundingClientRect(),
  }));

  return (
    <div
      ref={sectionRef}
      className={`${
        isMobile ? styles.containerMobile : styles.containerDesktop
      } ${sticky ? "sticky" : ""}`}
      data-color={color}
      style={{ backgroundColor: color }}
    >
      <MarginLayout>{children}</MarginLayout>
    </div>
  );
};

export default Section;
