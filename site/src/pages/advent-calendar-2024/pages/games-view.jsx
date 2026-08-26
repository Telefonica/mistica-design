import React, { useState, useEffect } from "react";
import MemoryGame from "../components/games/memory";
import WordleGame from "../components/games/wordle";
import CandyCrush from "../components/games/candy";
import { Box } from "@telefonica/mistica";
import SimonSays from "../components/games/simon";

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
        {selectedGame === "Candy" && <CandyCrush />}
        {selectedGame === "Simon" && <SimonSays />}
      </Box>
    </Box>
  );
};

export default GamesView;
