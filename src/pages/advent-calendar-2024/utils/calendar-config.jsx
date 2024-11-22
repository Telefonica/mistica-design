import { TOTAL_CALENDAR_DAYS } from "./constants";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const calendarDays = Array.from(
  { length: TOTAL_CALENDAR_DAYS },
  (_, index) => {
    const firstDayAvailable = index + 2;
    const date = new Date(Date.UTC(2024, 11, firstDayAvailable)); // 11 = December in UTC
    const dayOfWeek = weekdays[date.getUTCDay()];

    // Exclude weekends
    return dayOfWeek !== "Saturday" && dayOfWeek !== "Sunday"
      ? {
          date: date.toISOString().split("T")[0],
          dayOfWeek,
          dayNumber: date.getUTCDate(), // Extract day number from the date
        }
      : null;
  }
).filter(Boolean);
