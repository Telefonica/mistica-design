import {
  Inline,
  IconLockClosedFilled,
  Stack,
  Text8,
  skinVars,
  Tag,
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

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          cursor: status !== CARD_STATES.AVAILABLE ? "not-allowed" : "pointer",
          border: `2px solid black`,
          ...backgroundStyles,
        }}
        aria-haspopup="dialog"
        className={styles.container}
      >
        <Stack space={8}>
          {status === CARD_STATES.AVAILABLE && (
            <Tag type="warning">Available</Tag>
          )}
          <span>{DayOfWeek}</span>
          <Text8>{day}</Text8>
          {status === CARD_STATES.BLOCKED && (
            <Inline space={4}>
              <IconLockClosedFilled />
              <p className="blocked-text">Blocked</p>
            </Inline>
          )}
          {status === CARD_STATES.COMPLETED && <p>Completed</p>}
          {status === CARD_STATES.BLOCKED ? "TRUE" : "FALSE"}
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
