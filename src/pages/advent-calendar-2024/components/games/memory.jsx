import {
  ButtonPrimary,
  Text,
  Stack,
  Text3,
  IconBugFilled,
  IconChildFilled,
  IconCocktailFilled,
  IconBusFilled,
  IconDiamondFilled,
  IconFlowerFilled,
  IconFileErrorFilled,
  IconCloverFilled,
  skinVars,
} from "@telefonica/mistica";
import React, { useState, useEffect } from "react";

import "./memory.css";
import { saveGameData } from "../../utils/score-manager"; // Import your saveGameData function
import Score from "../score";
import { DecorationPatty } from "../../assets/decorations/decorations";

const initialCards = [
  IconBugFilled,
  IconBugFilled,
  IconChildFilled,
  IconChildFilled,
  IconCloverFilled,
  IconCloverFilled,
  IconCocktailFilled,
  IconCocktailFilled,
  IconDiamondFilled,
  IconDiamondFilled,
  IconFileErrorFilled,
  IconFileErrorFilled,
  IconFlowerFilled,
  IconFlowerFilled,
  IconBusFilled,
  IconBusFilled,
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
      {status !== "completed" && (
        <div style={{ position: "absolute", left: 48, top: 64 }}>
          <Score
            score={`${score}`}
            time={`${timeRemaining}`}
            timeRunning={timerStarted}
          />
        </div>
      )}

      {/* Game Status Views */}
      {status === "playing" && (
        <div className="memory-game">
          <div className="right-column">
            <div className="card-grid">
              {cards.map((icon, index) => (
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
                    <div
                      className="card-icon"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      {React.createElement(icon, {
                        size: 40,
                        color: skinVars.colors.brand,
                      })}
                    </div>
                  ) : (
                    <div className="card-back">
                      <svg
                        width="32"
                        height="22"
                        viewBox="0 0 32 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31.6734 14.0102L27.7634 3.50017C26.7334 0.74017 23.6234 -0.67983 20.8034 0.32017C19.2534 0.87017 18.0434 2.09017 17.5134 3.62017L15.2734 9.69017C15.2734 9.69017 18.1534 9.00017 19.3234 11.8802L21.4634 17.6402C21.9534 18.9602 22.9634 20.0402 24.2734 20.6402C25.5834 21.2402 27.0734 21.3002 28.4234 20.8202C31.2434 19.8202 32.6934 16.7702 31.6734 14.0102Z"
                          fill="#D1D5E4"
                        />
                        <path
                          d="M21.3933 19.4106C21.1333 19.0406 20.9233 18.6606 20.7533 18.2506L18.5033 12.8106C18.1133 11.9606 17.4633 11.5206 16.5333 11.4606C16.0433 11.4406 15.5433 11.4506 15.0533 11.4806L13.8533 14.3906C13.3333 15.6406 13.4033 17.0306 14.0433 18.2306C14.6833 19.4406 15.8433 20.3706 17.2633 20.8306C18.9433 21.3706 20.8033 21.1806 22.3033 20.3306C22.2533 20.2906 21.9533 20.0606 21.3833 19.4006L21.3933 19.4106Z"
                          fill="#D1D5E4"
                        />
                        <path
                          d="M11.0041 0.660219C8.23406 -0.339781 5.17406 1.08022 4.16406 3.82022L0.324061 14.2802C-0.685939 17.0202 0.744062 20.0602 3.51406 21.0602C6.28406 22.0602 9.34406 20.6402 10.3541 17.9002L14.1941 7.44022C15.2041 4.70022 13.7741 1.66022 11.0041 0.660219Z"
                          fill="#D1D5E4"
                        />
                      </svg>
                    </div>
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
            <Score score={`${score}`} isFinal />
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
