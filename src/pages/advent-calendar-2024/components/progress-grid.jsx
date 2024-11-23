import React from "react";
import {
  applyAlpha,
  Inline,
  skinVars,
  Text4,
  ThemeVariant,
} from "@telefonica/mistica";
import { calendarDays } from "../utils/calendar-config";

const ProgressGrid = ({ completedDays }) => {

  // Extract day number from `YYYY-MM-DD` format
  const completedDayNumbers = completedDays.map((date) =>
    new Date(date).getDate()
  );

  const isDayCompleted = (day) => completedDayNumbers.includes(day);

  const dayStyles = (completed) => ({
    background: completed ? skinVars.colors.brand : skinVars.colors.neutralLow,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    outline: `1px solid ${
      completed ? skinVars.colors.inverse : skinVars.colors.neutralMedium
    }`,
    outlineOffset: "-4px",
  });

  return (
    <Inline space={8} wrap>
      {calendarDays.map((day) => (
        <div key={day.dayNumber}>
          <div style={dayStyles(isDayCompleted(day.dayNumber))}>
            <ThemeVariant
              variant={isDayCompleted(day.dayNumber) ? "inverse" : "default"}
            >
              <Text4>{day.dayNumber}</Text4>
            </ThemeVariant>
          </div>
        </div>
      ))}
    </Inline>
  );
};

export default ProgressGrid;
