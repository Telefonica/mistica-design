// src/pages/games-view.jsx
import React, { useState, useEffect } from "react";
import MemoryGame from "../components/games/memory";
import WordleGame from "../components/games/wordle";
import { Box, ButtonPrimary } from "@telefonica/mistica";

const GamesView = ({ game }) => {
  const [selectedGame, setSelectedGame] = useState(game || null);

  useEffect(() => {
    if (game) {
      setSelectedGame(game);
    }
  }, [game]);

  return (
    <Box padding={24}>
      <Box marginTop={4}>
        {selectedGame === "Memory" && <MemoryGame />}
        {selectedGame === "Wordle" && <WordleGame />}
      </Box>
    </Box>
  );
};

export default GamesView;


