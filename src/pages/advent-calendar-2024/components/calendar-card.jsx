import {
  Circle,
  IconArrowLineRightRegular,
  IconLockEyeClosedFilled,
  Inline,
  skinVars,
  Stack,
  Text,
  Text5,
} from "@telefonica/mistica";
import { useRef, useState } from "react";
import { IconCompleted, IconLockOpen } from "../assets/icons/icons";
import { CARD_STATES } from "../utils/constants";
import styles from "./calendar-card.module.css";
import ModalView from "./modal-view";

const CalendarCard = ({
  DateString,
  DayOfWeek,
  eventName,
  eventDescription,
  content,
  status,
  onEndDay,
  illustration,
  illustrationDimmed,
  repeatable,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dialogRef = useRef(null);
  const day = new Date(DateString).getDate();
  const today = new Date().toISOString().split("T")[0];
  const isRepeatable = repeatable; //TODO: add !today;

  const handleClick = () => {
    if (status === CARD_STATES.AVAILABLE || isRepeatable) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
    }
  };

  const handleEndDay = () => {
    dialogRef.current.close();
    document.body.style.overflow = "auto";

    onEndDay(); // Notify the parent to update the state
  };

  const handleCloseModal = () => {
    dialogRef.current.close(); // Close the modal
    document.body.style.overflow = "auto";

    onEndDay(); // Notify the parent to update the state
  };

  let cardStatusStyles;

  switch (status) {
    case CARD_STATES.COMPLETED: {
      cardStatusStyles = {
        background: skinVars.colors.backgroundContainerAlternative,
        border: `2px solid ${skinVars.colors.backgroundContainerAlternative}`,
      };
      break;
    }
    case CARD_STATES.BLOCKED: {
      cardStatusStyles = {
        background: skinVars.colors.backgroundContainer,
        border: `2px solid ${skinVars.colors.border}`,
      };
      break;
    }
    default: {
      cardStatusStyles = {
        background: skinVars.colors.backgroundContainer,
        border: `2px solid ${skinVars.colors.neutralHigh}`,
      };
    }
  }

  const IllustrationWrapper = ({
    illustration,
    illustrationDimmed,
    status,
  }) => {
    return (
      <div
        style={{
          display: "inline-flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {status === CARD_STATES.BLOCKED ? illustrationDimmed : illustration}
      </div>
    );
  };

  const StatusIndicator = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {status === CARD_STATES.AVAILABLE ? (
            <IconLockOpen size={40} />
          ) : status === CARD_STATES.BLOCKED ? (
            <IconLockEyeClosedFilled
              size={40}
              color={skinVars.colors.neutralMedium}
            />
          ) : (
            <IconCompleted size={40} />
          )}

          <p
            style={{
              transformOrigin: "top left",
              marginTop: 16,
              fontSize: 16,
              writingMode: "vertical-lr",
              fontWeight: "bold",
              color:
                status === CARD_STATES.AVAILABLE
                  ? skinVars.colors.textPrimary
                  : skinVars.colors.textSecondary,
            }}
          >
            {status === CARD_STATES.AVAILABLE
              ? "Available"
              : status === CARD_STATES.BLOCKED
              ? "Locked"
              : "Completed"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          cursor:
            status !== CARD_STATES.AVAILABLE && !isRepeatable
              ? "not-allowed"
              : "pointer",

          padding: 24,
          position: "relative",
          ...cardStatusStyles,
        }}
        aria-haspopup="dialog"
        className={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <div
          style={{
            background:
              status === CARD_STATES.AVAILABLE
                ? isHovered
                  ? skinVars.colors.backgroundContainerHover
                  : "transparent"
                : status === CARD_STATES.COMPLETED && isRepeatable
                ? isHovered
                  ? skinVars.colors.backgroundContainerHover
                  : "transparent"
                : "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transition: "background 0.3s ease",
            pointerEvents: "none", // Ensure hover effects don't block clicks
          }}
        ></div>
        <Stack space="between">
          <Stack space={8}>
            <Text5
              color={
                status === CARD_STATES.AVAILABLE
                  ? skinVars.colors.textPrimary
                  : skinVars.colors.textSecondary
              }
            >
              {DayOfWeek}
            </Text5>

            <StatusIndicator />
          </Stack>

          {(illustration || illustrationDimmed) && (
            <IllustrationWrapper
              illustration={illustration}
              illustrationDimmed={illustrationDimmed}
              status={status}
            />
          )}

          <Inline space="between" alignItems="center">
            <Text
              size={64}
              weight="bold"
              color={
                status === CARD_STATES.AVAILABLE
                  ? skinVars.colors.textPrimary
                  : skinVars.colors.textSecondary
              }
            >
              {day}
            </Text>

            {(status === CARD_STATES.AVAILABLE || isRepeatable) && (
              <Circle size={48} background={skinVars.colors.brand}>
                <IconArrowLineRightRegular
                  size={24}
                  color={skinVars.colors.inverse}
                />
              </Circle>
            )}
          </Inline>
        </Stack>
      </div>
      <ModalView
        ref={dialogRef}
        day={day}
        dayOfWeek={DayOfWeek}
        title={eventName}
        description={eventDescription}
        content={
          typeof content === "function"
            ? content({ closeModal: handleCloseModal })
            : content
        }
        onClose={handleEndDay}
        onCancel={isRepeatable ? handleEndDay : null}
      />
    </>
  );
};

export default CalendarCard;
