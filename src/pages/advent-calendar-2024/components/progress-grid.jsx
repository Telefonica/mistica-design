import React from "react";
import {
  applyAlpha,
  Inline,
  skinVars,
  Text4,
  ThemeVariant,
} from "@telefonica/mistica";
import { TOTAL_CALENDAR_DAYS } from "../utils/constants";

const ProgressGrid = ({ completedDays }) => {
  const columns = 8;
  const daysInNovember = Array.from(
    { length: TOTAL_CALENDAR_DAYS },
    (_, i) => i + 1
  );

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
      {daysInNovember.map((day) => (
        <div key={day}>
          <div style={dayStyles(isDayCompleted(day))}>
            <ThemeVariant variant={isDayCompleted(day) ? "inverse" : "default"}>
              <Text4>{day}</Text4>
            </ThemeVariant>
          </div>
        </div>
      ))}
    </Inline>
  );
};

export default ProgressGrid;
