import { useEffect, useState, useRef } from "react";
import {
  Stack,
  Text3,
  Text2,
  skinVars,
  Inline,
  ButtonLink,
  IconButton,
  IconCloseRegular,
} from "@telefonica/mistica";

const Toast = ({
  title,
  description,
  icon: Icon,
  duration = 3000,
  style,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const clearHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startHideTimeout = () => {
    clearHideTimeout();
    timeoutRef.current = setTimeout(() => {
      setVisible(false); // This will trigger unmount if necessary
      onClose?.(); // Pass the ID to remove the toast
    }, duration);
  };

  useEffect(() => {
    if (!isHovered) {
      startHideTimeout(); // Start timeout when not hovered
    } else {
      clearHideTimeout(); // Clear timeout when hovered
    }

    return () => clearHideTimeout(); // Cleanup timeout on unmount
  }, [isHovered, duration]);

  // Always render dismiss button, regardless of toast visibility
  const handleDismiss = () => {
    setVisible(false);
    clearHideTimeout();
    onClose?.(); // Ensure it triggers onClose from parent
  };

  if (!visible) return null; // Hide toast when not visible

  return (
    <div
      style={{
        background: skinVars.colors.background,
        padding: "24px",
        borderRadius: "8px",
        border: `2px solid ${skinVars.colors.border}`,
        zIndex: 1000,
        width: 480,
        position: "relative", // Ensures dismiss button is on top
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        {/* Dismiss button should always be on top */}
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            Icon={IconCloseRegular}
            onPress={handleDismiss} // Handle dismiss in the component itself
          />
        </div>
      </Inline>
    </div>
  );
};

export default Toast;
