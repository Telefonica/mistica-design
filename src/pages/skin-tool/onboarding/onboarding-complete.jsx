// This file defines the `OnboardingComplete` component, which serves as the final screen in the onboarding flow.
// It displays a celebratory message with confetti animation, marks the flow as completed in localStorage, and transitions to an advanced tools section after a delay.

import React, { useState, useEffect } from "react";
import {
  Align,
  ResponsiveLayout,
  Stack,
  Text4,
  Text6,
  Text8,
} from "@telefonica/mistica";
import { markFlowAsCompleted } from "../utils/storageUtils.js";
import ConfettiEffect from "../utils/ConfettiEffect.jsx";
import AdvancedTools from "../advanced-tools.jsx";
import OnboardingTemplate from "../template/Onboarding.jsx";

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
    }, 10000);

    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    const initialContentTimer = setTimeout(() => {
      setShowInitialContent(false);
      setShowAdvancedTools(true);
    }, 114000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(initialContentTimer);
    };
  }, []);

  return (
    <ResponsiveLayout>
      {showInitialContent && (
        <OnboardingTemplate
          currentStep={4}
          totalSteps={4}
          className={`${fadeOut ? "fade-out" : ""}`}
        >
          <div
            style={{
              display: "flex",
              gap: 24,
              flexDirection: "column",
              height: "calc(100vh - 500px)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text8 textAlign="center">🎉 Your skin is ready!</Text8>
            <Text6>Now it's time to fine-tune it for perfection.</Text6>

            {showConfetti && <ConfettiEffect />}
          </div>
        </OnboardingTemplate>
      )}

      {showAdvancedTools && <AdvancedTools />}
    </ResponsiveLayout>
  );
};

export default OnboardingComplete;
