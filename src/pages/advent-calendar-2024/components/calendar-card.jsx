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

const CalendarCard = ({
  DateString,
  DayOfWeek,
  content,
  isCompleted,
  isBlocked,
  onEndDay,
}) => {
  const dialogRef = useRef(null);
  const day = new Date(DateString).getDate();

  const handleClick = () => {
    if (!isBlocked) {
      dialogRef.current.showModal();
    }
  };

  const handleEndDay = () => {
    dialogRef.current.close();
    onEndDay(); // Notify the parent to update the state
  };

  const blockedStyles = isBlocked
    ? isCompleted
      ? { background: skinVars.colors.successLow }
      : { background: skinVars.colors.backgroundContainerAlternative }
    : { background: skinVars.colors.backgroundContainer };

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          cursor: isBlocked ? "not-allowed" : "pointer",
          border: `2px solid black`,
          ...blockedStyles,
        }}
        aria-haspopup="dialog"
        className={styles.container}
      >
        <Stack space={8}>
          {!isBlocked && <Tag type="warning">Available</Tag>}
          <span>{DayOfWeek}</span>
          <Text8>{day}</Text8>
          {isBlocked && (
            <Inline space={4}>
              <IconLockClosedFilled />
              <p className="blocked-text">Blocked</p>
            </Inline>
          )}
          {isCompleted && <p>Completed</p>}
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
