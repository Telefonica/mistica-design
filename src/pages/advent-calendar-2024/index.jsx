import React, { useLayoutEffect, useState } from "react";
import ComingSoonPage from "./pages/coming-soon";
import CalendarView from "./pages/calendar-view";

import { RELEASE_DATE } from "./utils/constants";
import { Helmet } from "react-helmet";

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
    return (
      <>
        <Helmet>
          <title>Advent calendar</title>
          <meta name="description" content="Coming soon..." />
          <meta property="og:title" content="Advent calendar" />
          <meta property="og:description" content="Coming soon..." />
          <meta
            property="og:image"
            content="https://mistica-design-qwb4-lqrrl9njr-alex-buenos-projects.vercel.app/static/media/coming-soon.f61036da17b3da68badb.png"
          />
          <meta property="twitter:title" content="Advent calendar" />
          <meta property="twitter:description" content="Coming soon..." />
          <meta property="twitter:card" content="summary_large_image" />
        </Helmet>
        <ComingSoonPage targetDate={targetDate.toLocaleString()} />
      </>
    );
  }

  return <CalendarView />;
};

export default AdventCalendar2024;
