import React, { useState, useEffect } from "react";
import "./simon.css";
import { Text, Text3, ButtonPrimary, Stack } from "@telefonica/mistica";

// Sonidos importados
import sound1 from "../../../../img/games/1.mp3";
import sound2 from "../../../../img/games/2.mp3";
import sound3 from "../../../../img/games/3.mp3";
import sound4 from "../../../../img/games/4.mp3";

import Score from "../score";
import { saveGameData } from "../../utils/score-manager"; // Import saveGameData utility
import { DecorationPatty } from "../../assets/decorations/decorations";

const colors = ["purple", "blue", "lightblue", "black"];

const SimonSays = ({ onFinish }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highlight, setHighlight] = useState(null);
  const [message, setMessage] = useState('Press "Start" to begin');
  const [isGameOver, setIsGameOver] = useState(false);
  const [status, setStatus] = useState("playing"); // Track game status: playing or completed

  const gameName = "simonSays"; // Unique identifier for this game

  // Handle game end and persist score
  const handleGameEnd = () => {
    if (onFinish) onFinish(); // Notify the parent component
  };

  // Initialize the game state from localStorage
  useEffect(() => {
    const gameScores = JSON.parse(localStorage.getItem("gameScores")) || {};
    const savedGame = gameScores[gameName];

    if (savedGame?.completed) {
      setScore(savedGame.score);
      setStatus("completed"); // Set status to completed when game is finished
      setMessage("Game Completed!");
    }
  }, []);

  let currentSound = null; // Variable global para almacenar el sonido actual

  function playSound(color) {
    // Si ya hay un sonido reproducido, detenerlo
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0; // Reiniciar el tiempo del sonido
    }

    let sound;
    switch (color) {
      case "purple":
        sound = new Audio(sound1);
        break;
      case "blue":
        sound = new Audio(sound2);
        break;
      case "lightblue":
        sound = new Audio(sound3);
        break;
      case "black":
        sound = new Audio(sound4);
        break;
      default:
        return;
    }

    sound.play();
    currentSound = sound; // Actualizamos la referencia al sonido actual
  }

  useEffect(() => {
    if (
      isPlaying &&
      playerSequence.length === sequence.length &&
      playerSequence.length !== 0
    ) {
      checkPlayerSequence();
    }
  }, [playerSequence]);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setMessage("Follow the sequence!");
    setIsGameOver(false);
    setIsPlaying(true);
    setStatus("playing"); // Ensure the status is 'playing' when starting a new game
    addColorToSequence();
  };

  const addColorToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prevSequence) => [...prevSequence, newColor]);
    playSequence([...sequence, newColor]);
  };

  function playSequence(sequence) {
    let i = 0;
    const interval = setInterval(() => {
      setHighlight(sequence[i]);
      playSound(sequence[i]); // Reproducir sonido
      i += 1;
      setTimeout(() => setHighlight(null), 500); // Reset highlight after sequence
      if (i === sequence.length) {
        clearInterval(interval);
      }
    }, 800);
  }

  const handlePlayerInput = (color) => {
    if (!isPlaying || highlight || isGameOver) return;

    setPlayerSequence((prevSequence) => {
      const newSequence = [...prevSequence, color];
      playSound(color); // Reproducir sonido al hacer clic

      // Añadir animación específica al clic
      setHighlight(color);
      setTimeout(() => setHighlight(null), 500); // Reset highlight after click

      if (
        newSequence[newSequence.length - 1] !== sequence[newSequence.length - 1]
      ) {
        setIsGameOver(true);
        setMessage("Game Over! You clicked the wrong color.");
        setStatus("completed"); // Set status to completed when game over
        setIsPlaying(false);
        saveGameData(gameName, score, isGameOver); // Save the score and completed status
        return newSequence;
      }

      return newSequence;
    });
  };

  const checkPlayerSequence = () => {
    if (playerSequence.join("") === sequence.join("")) {
      setScore(score + 10);
      setPlayerSequence([]);
      setTimeout(() => {
        addColorToSequence();
      }, 1000);
    } else {
      setIsGameOver(true);
      setMessage("Game Over!");
      setStatus("completed"); // Set status to completed when game over
      saveGameData(gameName, score, isGameOver); // Save the score and completed status
    }
  };

  useEffect(() => {
    // If game is over, save game data and update the game progress.
    if (isGameOver) {
      saveGameData(gameName, score, isGameOver); // Save the final score and completed status
    }
  }, [isGameOver]);

  return (
    <>
      {/* Score Display */}
      <div style={{ position: "absolute", left: 48, top: 64 }}>
        <Score score={`${score}`} />
      </div>

      <div className="simon-game">
        {status === "playing" ? (
          <Stack space={16}>
            <div className="simon-board">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`color ${color} ${
                    highlight === color ? "highlight" : ""
                  } ${isGameOver ? "gameover" : ""}`}
                  onClick={() => handlePlayerInput(color)}
                  style={{ pointerEvents: isGameOver ? "none" : "auto" }}
                />
              ))}
            </div>
            {!isPlaying && !isGameOver && status === "playing" && (
              <ButtonPrimary
                onPress={(e) => {
                  e.preventDefault();
                  startGame();
                }}
              >
                Start
              </ButtonPrimary>
            )}
          </Stack>
        ) : (
          <Stack space={24}>
            <Stack space={16}>
              <DecorationPatty text={`${score}`}></DecorationPatty>
              <Text3>Your final score</Text3>
              <Text size={32} weight="medium">
                Congratulations! You completed the game!
              </Text>
            </Stack>
            <ButtonPrimary onPress={handleGameEnd}>Back home</ButtonPrimary>
          </Stack>
        )}
      </div>
    </>
  );
};

export default SimonSays;
