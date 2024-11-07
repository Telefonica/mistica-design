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
  IconLockOpenFilled,
  IconLockClosedFilled,
} from "@telefonica/mistica";
import { useState, useRef, useEffect } from "react";
import styles from "./calendar-card.module.css";
import { CARD_STATES } from "../utils/constants";

const CalendarCard = ({ DateString, DayOfWeek, content, status, onEndDay }) => {
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

  let backgroundStyles;

  switch (status) {
    case CARD_STATES.COMPLETED: {
      backgroundStyles = { background: skinVars.colors.successLow };
      break;
    }
    case CARD_STATES.BLOCKED: {
      backgroundStyles = {
        background: skinVars.colors.backgroundContainerAlternative,
      };
      break;
    }
    default: {
      backgroundStyles = { background: skinVars.colors.backgroundContainer };
    }
  }

  const LockedText = () => {
    return (
      <div style={{ position: "absolute", top: 32, right: 32 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          {status === CARD_STATES.AVAILABLE ? (
            <IconLockOpenFilled size={40} />
          ) : (
            <IconLockClosedFilled size={40} />
          )}

          <p
            style={{
              transformOrigin: "top left",
              marginTop: 16,
              textAlign: "right",
              fontSize: 20,
              marginRight: 4,
              writingMode: "vertical-lr",
            }}
          >
            {status === CARD_STATES.AVAILABLE
              ? "Available!"
              : "Locked until the day"}
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
          border: `2px solid ${
            status !== CARD_STATES.AVAILABLE
              ? skinVars.colors.divider
              : skinVars.colors.neutralHigh
          }`,
          padding: 24,
          position: "relative",
          ...backgroundStyles,
        }}
        aria-haspopup="dialog"
        className={styles.container}
      >
        <Stack space="between">
          <Stack space={8}>
            <Text8>{DayOfWeek}</Text8>

            <LockedText />
          </Stack>
          <Inline space="between" alignItems="center">
            <Text size={80} weight="medium">
              {day}
            </Text>
            {status === CARD_STATES.AVAILABLE && (
              <Circle
                size={56}
                background={skinVars.colors.neutralLow}
                border={skinVars.colors.neutralHigh}
              >
                <IconChevronRightRegular
                  size={32}
                  color={skinVars.colors.neutralHigh}
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
