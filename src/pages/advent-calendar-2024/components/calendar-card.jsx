import {
  Inline,
  Stack,
  Text10,
  skinVars,
  Tag,
  Text8,
  Text,
  IconLockEyeClosedFilled,
  Circle,
  IconChevronRightRegular,
} from "@telefonica/mistica";
import { useRef } from "react";
import styles from "./calendar-card.module.css";
import { CARD_STATES } from "../utils/constants";
import { IconCompleted, IconLockOpen } from "../assets/icons/icons";

const CalendarCard = ({
  DateString,
  DayOfWeek,
  content,
  status,
  onEndDay,
  illustration,
}) => {
  const dialogRef = useRef(null);
  const day = new Date(DateString).getDate();

  const handleClick = () => {
    if (status === CARD_STATES.AVAILABLE) {
      dialogRef.current.showModal();
    }
  };

  const handleEndDay = () => {
    dialogRef.current.close();
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
          top: 32,
          right: 32,
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
          cursor: status !== CARD_STATES.AVAILABLE ? "not-allowed" : "pointer",

          padding: 24,
          position: "relative",
          ...cardStatusStyles,
        }}
        aria-haspopup="dialog"
        className={styles.container}
      >
        <Stack space="between">
          <Stack space={8}>
            <Text8
              color={
                status === CARD_STATES.AVAILABLE
                  ? skinVars.colors.textPrimary
                  : skinVars.colors.textSecondary
              }
            >
              {DayOfWeek}
            </Text8>

            <StatusIndicator />
          </Stack>

          {illustration && (
            <IllustrationWrapper illustration={illustration} status={status} />
          )}

          <Inline space="between" alignItems="center">
            <Text
              size={80}
              weight="medium"
              color={
                status === CARD_STATES.AVAILABLE
                  ? skinVars.colors.textPrimary
                  : skinVars.colors.textSecondary
              }
            >
              {day}
            </Text>

            {status === CARD_STATES.AVAILABLE && (
              <Circle size={48} background={skinVars.colors.brand}>
                <IconChevronRightRegular
                  size={24}
                  color={skinVars.colors.inverse}
                ></IconChevronRightRegular>
              </Circle>
            )}
          </Inline>
        </Stack>
      </div>
      <dialog ref={dialogRef}>
        <form method="dialog">
          <p>Do you want to end the day for {day}?</p>
          <>{content}</>
          <button onClick={handleEndDay}>End Day</button>
          <button type="button" onClick={() => dialogRef.current.close()}>
            Cancel
          </button>
        </form>
      </dialog>
    </>
  );
};

export default CalendarCard;
