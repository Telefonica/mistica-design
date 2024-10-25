import React, { useEffect, useState } from "react";
import ComingSoonPage from "./pages/coming-soon";
import CalendarView from "./pages/calendar-view";

const AdventCalendar2024 = () => {
  const targetDate = new Date("2024-10-25T00:00:01");

  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    const checkReleaseDate = () => {
      const now = new Date();
      setIsReleased(now >= targetDate);
    };

    checkReleaseDate();

    const interval = setInterval(checkReleaseDate, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isReleased) {
    return <ComingSoonPage targetDate={targetDate.toLocaleString()} />;
  }

  return <CalendarView />;
};

export default AdventCalendar2024;
