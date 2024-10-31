// src/pages/games-view.jsx
import React from "react";
import { Box } from "@telefonica/mistica";
import MemoryGame from "../components/games/memory";

const GamesView = () => {
  return (
    <Box padding={24}>
    <a href="/advent-calendar-2024">Back to Calendar</a>
      <MemoryGame></MemoryGame>
    </Box>
  );
};

export default GamesView;
