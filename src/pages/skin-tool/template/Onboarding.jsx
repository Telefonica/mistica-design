// This file defines a reusable OnboardingTemplate component for the skin creation flow steps.
// It encapsulates the common header structure with customizable step number, title, description, and SVG icon.
// It also includes navigation buttons for consistent navigation between steps.

import React from "react";
import {
  Text2,
  Text6,
  ProgressBarStepped,
  skinVars,
  Stack,
  Align,
  Boxed,
  ResponsiveLayout,
  ButtonPrimary,
  ButtonSecondary,
} from "@telefonica/mistica";
import "./Onboarding.css";
import { useNavigate } from "react-router-dom";

/**
 * OnboardingTemplate - A reusable component for step headers in the skin creation flow
 * @param {Object} props - Component props
 * @param {number} props.currentStep - Current step number (1-based)
 * @param {number} props.totalSteps - Total number of steps
 * @param {string} props.title - Title of the step
 * @param {string} props.description - Description of the step
 * @param {React.ReactNode} props.icon - SVG icon or component to display
 * @param {React.ReactNode} props.children - Optional additional content
 * @param {string} props.prevRoute - Route for the back button
 * @param {string} props.nextRoute - Route for the next button
 * @param {string} props.prevLabel - Label for the back button
 * @param {string} props.nextLabel - Label for the next button
 * @param {Function} props.onReset - Optional function for reset button
 * @param {string} props.resetLabel - Label for the reset button
 */
const OnboardingTemplate = ({
  currentStep,
  totalSteps = 4,
  title,
  description,
  icon,
  children,
  prevRoute,
  nextRoute,
  prevLabel = "Back",
  nextLabel = "Next step",
  onReset,
  resetLabel = "Restaurar valores",
}) => {
  const navigate = useNavigate();
  return (
    <ResponsiveLayout>
      <Stack space={48}>
        <div className="header">
          <p>loguito</p>
          <div className="progress-bar">
            <ProgressBarStepped steps={totalSteps} currentStep={currentStep} />
          </div>
          <Text2 color={skinVars.colors.textSecondary}>
            Step {currentStep} of {totalSteps}
          </Text2>
        </div>

        <div className="title-section">
          <Stack space={40}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "center",
              }}
            >
              {icon}
              <Text6>{title}</Text6>
              <Text2 color={skinVars.colors.textSecondary}>{description}</Text2>
            </div>

            <Align x="center" width={872}>
              <ResponsiveLayout>
                <div className="transition">{children}</div>
              </ResponsiveLayout>
            </Align>
          </Stack>
          {/* Navigation buttons */}
          {(prevRoute || nextRoute || onReset) && (
            <div className="buttons">
              {prevRoute && (
                <ButtonSecondary onPress={() => navigate(prevRoute)}>
                  {prevLabel}
                </ButtonSecondary>
              )}
              {onReset && (
                <ButtonSecondary onPress={onReset}>
                  {resetLabel}
                </ButtonSecondary>
              )}
              {nextRoute && (
                <ButtonPrimary onPress={() => navigate(nextRoute)}>
                  {nextLabel}
                </ButtonPrimary>
              )}
            </div>
          )}
        </div>
      </Stack>
    </ResponsiveLayout>
  );
};

export default OnboardingTemplate;
