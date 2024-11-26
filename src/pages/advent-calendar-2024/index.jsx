import React, { useLayoutEffect, useState } from "react";
import ComingSoonPage from "./pages/coming-soon";
import CalendarView from "./pages/calendar-view";

import { RELEASE_DATE } from "./utils/constants";

const targetDate = new Date(RELEASE_DATE);

const AdventCalendar2024 = () => {
  const [isReleased, setIsReleased] = useState(false);

  useLayoutEffect(() => {
    const now = new Date();
    const timeToRelease = Math.max(0, targetDate.getTime() - now.getTime());

    if (timeToRelease === 0) {
      setIsReleased(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsReleased(true);
    }, timeToRelease);

    return () => clearTimeout(timeout);
  }, []);

  if (!isReleased) {
    return <ComingSoonPage targetDate={targetDate.toLocaleString()} />;
  }

  return <CalendarView />;
};

export default AdventCalendar2024;
