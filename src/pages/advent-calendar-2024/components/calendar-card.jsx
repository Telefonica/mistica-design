import {
  Box,
  Boxed,
  Inline,
  IconLockClosedFilled,
  Stack,
  Text8,
  useDialog,
  Select,
} from "@telefonica/mistica";
import { useState, useRef } from "react";

const CalendarCard = ({ DateString, DayOfWeek }) => {
  const dialogRef = useRef(null);
  // Check if the card's date is in the future
  const today = new Date().toISOString().split("T")[0];
  const isInitiallyBlocked = DateString > today; // Card is blocked if its date is greater than today

  // State to manage if the card is blocked
  const [isBlocked, setIsBlocked] = useState(isInitiallyBlocked);

  // Extract day from DateString (assuming DateString is in "YYYY-MM-DD" format)
  const day = new Date(DateString).getDate();

  const handleClick = () => {
    if (!isBlocked) {
      dialogRef.current.showModal(); // Show the native dialog
    }
  };

  const handleEndDay = () => {
    dialogRef.current.close(); // Close the dialog
    // Logic to lock the card (you may need to lift this state up if necessary)
    console.log(`Day ${day} locked`);
    setIsBlocked(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        aria-haspopup="dialog"
      >
        <Boxed>
          <Box padding={24}>
            <Stack space={8}>
              <span>{DayOfWeek}</span>
              <Text8>{day}</Text8>
              {isBlocked && (
                <Inline space={4}>
                  <IconLockClosedFilled />
                  <p className="blocked-text">Blocked</p>
                </Inline>
              )}
            </Stack>
          </Box>
        </Boxed>
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
