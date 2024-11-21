import {
  skinVars,
  Text,
  Text3,
  Text6,
  ButtonPrimary,
  Stack,
} from "@telefonica/mistica";
import "./wordle.css";
import React, { useState, useEffect } from "react";
import Score from "../score";
import { saveGameData } from "../../utils/score-manager";
import { IconCompleted, IconWrong } from "../../assets/icons/icons";

const words = ["tokens"];
const chosenWord = words[0].toLowerCase();

const WordleGame = ({ onFinish }) => {
  const [currentAttempt, setCurrentAttempt] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");

  const maxAttempts = 10;
  const gameName = "wordle";

  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem("gameScores"))?.[
      gameName
    ];
    if (savedGame?.completed) {
      setScore(savedGame.score);
      setGameStatus("completed");
      setMessage("Game Completed!");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      const lowerKey = key.toLowerCase();

      if (lowerKey === "enter" && gameStatus === "playing") checkWord();
      if (lowerKey === "backspace")
        setCurrentAttempt((prev) => prev.slice(0, -1));
      if (
        /^[a-z]$/.test(lowerKey) &&
        currentAttempt.length < chosenWord.length
      ) {
        setCurrentAttempt((prev) => [...prev, lowerKey]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentAttempt, gameStatus]);

  const handleGameEnd = () => {
    if (onFinish) onFinish();
    saveGameData(
      gameName,
      score,
      gameStatus === "completed" || gameStatus === "failed"
    );
  };

  const checkWord = () => {
    const input = currentAttempt.join("").toLowerCase();

    if (input.length !== chosenWord.length) {
      setMessage(`The word must be ${chosenWord.length} letters.`);
      return;
    }

    setAttempts((prev) => [...prev, input]);
    setCurrentAttempt([]);

    if (input === chosenWord) {
      setScore(calculateScore(attempts.length + 1));
      setMessage(`Amazing! The word was ${chosenWord.toUpperCase()}.`);
      setGameStatus("completed");
    } else if (attempts.length + 1 === maxAttempts) {
      setMessage(
        `Too many attempts. The word was ${chosenWord.toUpperCase()}.`
      );
      setGameStatus("failed");
    }
  };

  const calculateScore = (attemptCount) =>
    Math.max(0, 100 - (attemptCount - 1) * 10);

  const getLetterStyles = (status) => ({
    background:
      {
        correct: skinVars.colors.success,
        partial: skinVars.colors.warning,
        wrong: skinVars.colors.backgroundAlternative,
      }[status] || skinVars.colors.background,
    border: `2px solid ${
      {
        correct: skinVars.colors.success,
        partial: skinVars.colors.warning,
        wrong: skinVars.colors.border,
      }[status] || skinVars.colors.border
    }`,
  });

  const getLetterStatus = (letter, index, input) => {
    const letterCount = [...chosenWord].reduce(
      (count, char) => ({ ...count, [char]: (count[char] || 0) + 1 }),
      {}
    );

    const statuses = Array(input.length).fill("wrong");

    input.split("").forEach((char, i) => {
      if (char === chosenWord[i]) {
        statuses[i] = "correct";
        letterCount[char] -= 1;
      }
    });

    input.split("").forEach((char, i) => {
      if (statuses[i] === "wrong" && letterCount[char] > 0) {
        statuses[i] = "partial";
        letterCount[char] -= 1;
      }
    });

    return statuses[index];
  };

  const GuessLabel = ({ correct }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {correct ? <IconCompleted size={40} /> : <IconWrong size={40} />}
      <Text
        size={24}
        color={correct ? skinVars.colors.brand : skinVars.colors.error}
      >
        {correct ? "Correct!" : "Game over"}
      </Text>
    </div>
  );

  const renderRow = (word, isCurrent = false) => (
    <div className="letter-boxes">
      {Array.from({ length: chosenWord.length }, (_, i) => (
        <div
          key={i}
          className="letter-box"
          style={
            isCurrent
              ? getLetterStyles("default")
              : getLetterStyles(getLetterStatus(word[i], i, word))
          }
        >
          <Text6>{(word[i] || "").toUpperCase()}</Text6>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div style={{ position: "absolute", left: 48, top: 64 }}>
        <Score score={`${score}`} movements={`${attempts.length}`} />
      </div>

      <div className="wordle-game">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {attempts.map((attempt, i) => renderRow(attempt))}
            {gameStatus === "playing"
              ? renderRow(currentAttempt.join(""), true)
              : gameStatus === "failed"
              ? renderRow(chosenWord) // Show the correct answer only if the game is failed
              : null}
          </div>
          {gameStatus !== "playing" && gameStatus === "completed" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <GuessLabel correct={gameStatus === "completed"} />
              <Text3>{message}</Text3>
              <ButtonPrimary onPress={handleGameEnd}>Back home</ButtonPrimary>
            </div>
          )}
          {gameStatus === "failed" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <GuessLabel correct={gameStatus === "completed"} />
              <Text3>{message}</Text3>
              <ButtonPrimary onPress={handleGameEnd}>Back home</ButtonPrimary>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WordleGame;
