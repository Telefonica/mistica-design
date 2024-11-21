import { ButtonPrimary, Text, Stack, Text3 } from "@telefonica/mistica";
import React, { useState, useEffect } from "react";
import blau from "../../../../img/games/blau.svg";
import movistar from "../../../../img/games/movistar.svg";
import o2 from "../../../../img/games/o2.svg";
import telefonica from "../../../../img/games/telefonica.svg";
import tu from "../../../../img/games/tu.svg";
import vivo from "../../../../img/games/vivo.svg";
import "./memory.css";
import { saveGameData } from "../../utils/score-manager"; // Import your saveGameData function
import Score from "../score";
import { DecorationPatty } from "../../assets/decorations/decorations";

const initialCards = [
  blau,
  blau,
  movistar,
  movistar,
  o2,
  o2,
  telefonica,
  telefonica,
  tu,
  tu,
  vivo,
  vivo,
];

const MemoryGame = ({ onFinish }) => {
  const gameName = "memoryGame"; // Unique identifier for this game
  const timeLimit = 60; // Time in seconds

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [score, setScore] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [gameEnded, setGameEnded] = useState(false); // To control when the game ends
  const [revealedCards, setRevealedCards] = useState([]); // Revealed cards
  const [status, setStatus] = useState("playing"); // Track the current status (playing/completed)

  const handleGameEnd = () => {
    if (onFinish) onFinish(); // Notify the parent component
  };

  // Shuffle function
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Initialize the game
  useEffect(() => {
    const gameScores = JSON.parse(localStorage.getItem("gameScores")) || {};
    const savedGame = gameScores[gameName];

    if (savedGame?.completed) {
      setScore(savedGame.score);
      setGameEnded(true);
      setStatus("completed");
    } else {
      setCards(shuffle([...initialCards]));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerStarted && timeRemaining > 0 && !gameEnded) {
      const timerId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeRemaining === 0 && !gameEnded) {
      setGameEnded(true);
      setStatus("completed");
    }
  }, [timerStarted, timeRemaining, gameEnded]);

  // Save game data when the game ends
  useEffect(() => {
    if (gameEnded) {
      saveGameData(gameName, score, true);
    }
  }, [gameEnded, score]);

  const startTimer = () => {
    setTimerStarted(true);
  };

  const flipCard = (index) => {
    if (gameEnded || revealedCards.includes(index)) return; // Prevent interaction if the game has ended or the card is already revealed

    if (flippedCards.length === 0 && !timerStarted) {
      startTimer(); // Start the timer on the first card flip
    }

    if (flippedCards.length < 2) {
      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setTimeout(() => checkForMatch(newFlippedCards), 500);
      }
    }
  };

  const checkForMatch = (newFlippedCards) => {
    const [firstCardIndex, secondCardIndex] = newFlippedCards;

    if (cards[firstCardIndex] === cards[secondCardIndex]) {
      setMatchedPairs((prev) => prev + 1);
      const scoreToAdd = Math.max(0, timeRemaining);
      setScore((prev) => prev + scoreToAdd); // Add remaining time to the score

      // Add revealed cards to the list
      setRevealedCards((prev) => [...prev, firstCardIndex, secondCardIndex]);
      setFlippedCards([]); // Reset flipped cards
    } else {
      setTimeout(() => {
        setFlippedCards([]); // Reset flipped cards if no match
      }, 500);
    }

    // Check if all pairs are matched
    if (matchedPairs + 1 === cards.length / 2) {
      setGameEnded(true);
      setStatus("completed");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        width: "fit-available",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Score Display */}
      <div style={{ position: "absolute", left: 48, top: 64 }}>
        <Score
          score={`${score}`}
          time={`${timeRemaining}`}
          timeRunning={timerStarted}
        />
      </div>

      {/* Game Status Views */}
      {status === "playing" && (
        <div className="memory-game">
          <div className="right-column">
            <div className="card-grid">
              {cards.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`card ${
                    flippedCards.includes(index) ||
                    revealedCards.includes(index)
                      ? "flipped"
                      : ""
                  } ${gameEnded ? "disabled" : ""}`}
                  onClick={() => flipCard(index)}
                >
                  {flippedCards.includes(index) ||
                  revealedCards.includes(index) ? (
                    <img
                      src={imageUrl}
                      alt="Card"
                      style={{ display: "block" }}
                    />
                  ) : (
                    <div className="card-back"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {status === "completed" && (
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
  );
};

export default MemoryGame;
