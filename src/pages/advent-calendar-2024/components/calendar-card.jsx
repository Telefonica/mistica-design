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

const CalendarCard = ({ DateString, DayOfWeek }) => {
  const dialogRef = useRef(null);
  // Check if the card's date is in the future
  const today = new Date().toISOString().split("T")[0];

  const getCompletedDays = () => {
    const storedDays = localStorage.getItem("completedDays");
    return storedDays ? JSON.parse(storedDays) : [];
  };

  const saveCompletedDay = (date) => {
    const completedDays = getCompletedDays();
    if (!completedDays.includes(date)) {
      completedDays.push(date);
      localStorage.setItem("completedDays", JSON.stringify(completedDays));
    }
  };

  // Extract day from DateString (assuming DateString is in "YYYY-MM-DD" format)
  const day = new Date(DateString).getDate();

  // Initialize state based on localStorage
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Effect to initialize state from localStorage on component mount
  useEffect(() => {
    const completedDays = getCompletedDays();
    const isDayCompleted = completedDays.includes(DateString);
    setIsCompleted(isDayCompleted);
    // If it's today and not completed, the card is not blocked
    setIsBlocked(DateString !== today || isDayCompleted);
  }, [DateString, today]);

  const handleClick = () => {
    if (!isBlocked) {
      dialogRef.current.showModal(); // Show the native dialog
    }
  };

  const handleEndDay = () => {
    dialogRef.current.close(); // Close the dialog
    setIsCompleted(true);
    setIsBlocked(true);
    saveCompletedDay(DateString);
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
