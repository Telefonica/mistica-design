// This file defines the `OnboardingComplete` component, which serves as the final screen in the onboarding flow.
// It displays a celebratory message with confetti animation, marks the flow as completed in localStorage, and transitions to an advanced tools section after a delay.

import React, { useState, useEffect } from "react";
import { ResponsiveLayout } from "@telefonica/mistica";
import { markFlowAsCompleted } from "../utils/storageUtils.js";
import ConfettiEffect from "../utils/ConfettiEffect.jsx";
import AdvancedTools from "../advanced-tools.jsx";
import StepHeader from "../template/Onboarding.jsx";

const OnboardingComplete = () => {
  // State to control the visibility of the confetti animation
  const [showConfetti, setShowConfetti] = useState(true);

  //State to control the visibility of the advanced tools section
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  // State to control the visibility of the initial celebratory content
  const [showInitialContent, setShowInitialContent] = useState(true);

  // State to trigger a fade-out animation for the initial content
  const [fadeOut, setFadeOut] = useState(false);

  // Effect hook to handle timers for animations and transitions
  useEffect(() => {
    markFlowAsCompleted();

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    const initialContentTimer = setTimeout(() => {
      setShowInitialContent(false);
      setShowAdvancedTools(true);
    }, 4000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(initialContentTimer);
    };
  }, []);

  return (
    <ResponsiveLayout>
      {showInitialContent && (
        <StepHeader
          currentStep={4}
          totalSteps={4}
          title="🎉 Your skin is ready!"
          description="Now it's time to fine-tune it for perfection."
          className={`${fadeOut ? "fade-out" : ""}`}
        />
      )}

      {showInitialContent && (
        <div
          className={`animated-message ${fadeOut ? "fade-out" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: "calc(100vh - 60px)",
            textAlign: "center",
            gap: "16px",
          }}
        >
          {showConfetti && <ConfettiEffect />}
        </div>
      )}

      {showAdvancedTools && <AdvancedTools />}
    </ResponsiveLayout>
  );
};

export default OnboardingComplete;
