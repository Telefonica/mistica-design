import { useState, useEffect, useRef } from "react";
import {
  Stack,
  Text3,
  Text2,
  skinVars,
  Inline,
  ButtonLink,
  IconButton,
  IconCloseRegular,
  useScreenSize,
} from "@telefonica/mistica";
import styles from "./toast.module.css";

const Toast = ({
  title,
  description,
  icon: Icon,
  duration = 3000,
  delay = 0,
  onClose,
  style,
}) => {
  const [visible, setVisible] = useState(true); // Initial visibility is true
  const [fadeOut, setFadeOut] = useState(false); // Controls fade-out animation
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const { isMobile } = useScreenSize();

  const clearHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startHideTimeout = () => {
    clearHideTimeout();
    timeoutRef.current = setTimeout(() => {
      setFadeOut(true); // Trigger fade-out before setting visible to false
      onClose?.(); // Trigger onClose callback to remove toast
    }, duration);
  };

  // Handle visibility change when hovered or not
  useEffect(() => {
    const handleTimeout = () => {
      if (!isHovered) {
        setTimeout(startHideTimeout, delay); // Delay before auto-dismissing
      } else {
        clearHideTimeout(); // Clear timeout when hovered
      }
    };

    handleTimeout();

    return () => clearHideTimeout(); // Cleanup timeout on unmount
  }, [isHovered, delay, duration]);

  useEffect(() => {
    if (fadeOut) {
      // Wait for the exit animation to complete before removing the toast
      timeoutRef.current = setTimeout(() => {
        setVisible(false); // Remove from the DOM after animation
      }, 500); // Match the duration of your fade-out transition
    }

    return () => clearTimeout(timeoutRef.current); // Cleanup the fade-out timeout
  }, [fadeOut]);

  if (!visible) return null; // If not visible, do not render the toast

  return (
    <div
      className={`${styles.toast} ${fadeOut ? styles.exit : ""}`} // Add the exit class when fadeOut is true
      style={{
        background: skinVars.colors.background,
        padding: "24px",
        borderRadius: "8px",
        border: `2px solid ${skinVars.colors.border}`,
        zIndex: 1000,
        width: isMobile ? "calc(100vw - 32px)" : "480px",
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)} // Trigger hover state
      onMouseLeave={() => setIsHovered(false)} // Reset hover state
    >
      <Inline space={16}>
        <div
          style={{
            background:
              "linear-gradient(120deg, rgba(255,249,208,1) 0%, rgba(255,178,178,1) 24%, rgba(59,95,253,1) 66%, rgba(255,99,114,1) 100%)",
            padding: "16px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            outline: `1px solid ${skinVars.colors.inverse}`,
            outlineOffset: "-4px",
            position: "relative",
          }}
        >
          <Icon color={skinVars.colors.inverse} />
        </div>
        <Stack space={8}>
          <Text2 weight="bold">Achievement unlocked</Text2>
          <Text3 weight="bold">{title}</Text3>
          <Text3>{description}</Text3>
          <ButtonLink bleedLeft to={"/advent-calendar-2024/progress-view"}>
            View progress
          </ButtonLink>
        </Stack>
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            Icon={IconCloseRegular}
            onPress={() => {
              setFadeOut(true); // Trigger fade-out animation on close
              clearHideTimeout(); // Clear the timeout when manually closed
              onClose?.(); // Trigger onClose callback to remove toast
            }}
          />
        </div>
      </Inline>
    </div>
  );
};

export default Toast;
