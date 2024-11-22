import {
  Inline,
  Stack,
  Text10,
  skinVars,
  Tag,
  Text5,
  Text,
  IconLockEyeClosedFilled,
  Circle,
  IconChevronRightRegular,
} from "@telefonica/mistica";
import { useRef } from "react";
import styles from "./calendar-card.module.css";
import { CARD_STATES } from "../utils/constants";
import { IconCompleted, IconLockOpen } from "../assets/icons/icons";
import ModalView from "./modal-view";

const CalendarCard = ({
  DateString,
  DayOfWeek,
  eventName,
  eventDescription,
  content,
  status,
  forceAvailable,
  onEndDay,
  illustration,
  repeatable,
}) => {
  const dialogRef = useRef(null);
  const day = new Date(DateString).getDate();
  const today = new Date().toISOString().split("T")[0];
  const isRepeatable = repeatable;

  const handleClick = () => {
    if (status === CARD_STATES.AVAILABLE || isRepeatable) {
      dialogRef.current.showModal();
    }
  };

  const handleEndDay = () => {
    dialogRef.current.close();
    onEndDay(); // Notify the parent to update the state
  };

  const handleCloseModal = () => {
    dialogRef.current.close(); // Close the modal
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
        border: `2px solid ${skinVars.colors.borderLow}`,
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

  const IllustrationWrapper = ({ illustration, status }) => {
    return (
      <div
        style={{
          filter:
            status === CARD_STATES.BLOCKED
              ? "grayscale(100%) contrast(0%)"
              : "none",
          opacity: status === CARD_STATES.BLOCKED ? 0.1 : 1,
          display: "inline-flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {illustration}
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
              color={skinVars.colors.textSecondary}
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
      >
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

          {illustration && (
            <IllustrationWrapper illustration={illustration} status={status} />
          )}

          <Inline space="between" alignItems="center">
            <Text
              size={64}
              weight="medium"
              color={
                status === CARD_STATES.AVAILABLE
                  ? skinVars.colors.textPrimary
                  : skinVars.colors.textSecondary
              }
            >
              {day}
            </Text>

            {status === CARD_STATES.AVAILABLE ||
              (isRepeatable && (
                <Circle size={48} background={skinVars.colors.brand}>
                  <IconChevronRightRegular
                    size={24}
                    color={skinVars.colors.inverse}
                  ></IconChevronRightRegular>
                </Circle>
              ))}
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
