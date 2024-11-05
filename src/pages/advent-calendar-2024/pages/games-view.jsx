import React, { useState } from "react";
import MemoryGame from "../components/games/memory";
import WordleGame from "../components/games/wordle";
import { Box, ButtonPrimary } from "@telefonica/mistica";

const GamesView = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <Box padding={24}>
      <a href="/advent-calendar-2024">Back to Calendar</a>
      
      <Box display="flex" justifyContent="center" marginTop={2} gap={2}>
        <ButtonPrimary onPress={() => setSelectedGame("memory")}>
          Memory Game
        </ButtonPrimary>
        <ButtonPrimary onPress={() => setSelectedGame("wordle")}>
          Wordle Game
        </ButtonPrimary>
      </Box>

      <Box marginTop={4}>
        {selectedGame === "memory" && <MemoryGame />}
        {selectedGame === "wordle" && <WordleGame />}
      </Box>
    </Box>
  );
};

export default GamesView;

