import {
  skinVars,
  Text,
  Text3,
  Text6,
  ButtonPrimary,
  Stack,
  useScreenSize,
  Align,
} from "@telefonica/mistica";
import "./wordle.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Score from "../score";
import { saveGameData } from "../../utils/score-manager";
import { IconCompleted, IconWrong } from "../../assets/icons/icons";

const words = ["tokens"];
const chosenWord = words[0].toLowerCase();

const WordleGame = ({ onFinish, onFinalScreen }) => {
  const [currentAttempt, setCurrentAttempt] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const gameContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isMobile = useScreenSize();

  const maxAttempts = 10;
  const gameName = "wordle";

  useEffect(() => {
    if (gameContainerRef.current) {
      setTimeout(() => {
        gameContainerRef.current.scrollTop =
          gameContainerRef.current.scrollHeight;
      }, 0);
    }
  }, [attempts, currentAttempt]);

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

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    if (gameStatus === "playing") {
      const letters = value.split("").filter((char) => /^[a-z]$/.test(char));
      setCurrentAttempt(letters.slice(0, chosenWord.length));
    }
  };

  const checkWord = useCallback(() => {
    const input = currentAttempt.join("").toLowerCase();

    if (input.length !== chosenWord.length) {
      setMessage(`The word must be ${chosenWord.length} letters.`);
      return;
    }

    setAttempts((prev) => [...prev, input]);
    setCurrentAttempt([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (input === chosenWord) {
      setScore(calculateScore(attempts.length + 1));
      setMessage(`Amazing! The word was ${chosenWord.toUpperCase()}.`);
      onFinalScreen();
      setGameStatus("completed");
    } else if (attempts.length + 1 === maxAttempts) {
      setMessage(
        `Too many attempts. The word was ${chosenWord.toUpperCase()}.`
      );
      setGameStatus("failed");
    }
  }, [attempts, currentAttempt]);

  const handleKeyDown = (event) => {
    const { key } = event;

    if (key === "Enter" && gameStatus === "playing") {
      event.preventDefault();
      checkWord();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (!isMobile) {
        const { key } = event;
        const lowerKey = key.toLowerCase();

        event.preventDefault();
        event.stopPropagation();

        if (lowerKey === "enter" && gameStatus === "playing") checkWord();
        if (lowerKey === "backspace")
          setCurrentAttempt((prev) => prev.slice(0, -1));
        if (
          /^[a-z]$/.test(lowerKey) &&
          currentAttempt.length < chosenWord.length
        ) {
          setCurrentAttempt((prev) => [...prev, lowerKey]);
        }
      }
    };

    if (!isMobile) {
      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => document.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [currentAttempt, gameStatus, isMobile, checkWord]);

  const focusInput = () => {
    if (isMobile && inputRef.current && gameStatus === "playing") {
      inputRef.current.focus();
    }
  };

  const handleGameEnd = () => {
    if (onFinish) onFinish();
    saveGameData(
      gameName,
      score,
      gameStatus === "completed" || gameStatus === "failed"
    );
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
    <div className="letter-boxes" onClick={focusInput}>
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
          <Text6
            style={{
              fontSize: isMobile ? "16px" : "24px",
              fontWeight: "bold",
            }}
          >
            {(word[i] || "").toUpperCase()}
          </Text6>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "125px",
          backgroundColor: "#FFFFFF",
          zIndex: 0,
        }}
      />
      <div style={{ position: "absolute", left: 48, top: 64, zIndex: 1 }}>
        <Score score={`${score}`} movements={`${attempts.length}`} />
      </div>
      <Align
        y="center"
        x="center"
        height={isMobile ? "auto" : "calc(100vh - (56px * 2))"}
      >
        <div
          ref={gameContainerRef}
          className="wordle-game"
          style={{
            overflowY: "auto",
          }}
        >
          {isMobile && (
            <input
              ref={inputRef}
              type="text"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="mobile-input"
              inputMode="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          )}
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
              : gameStatus === "failed"}
          </div>
          {gameStatus !== "playing" && gameStatus === "completed" && (
            <Stack space={24}>
              <Stack space={16}>
                <Score score={score} isFinal={true} />
                <Text size={32} weight="medium">
                  Congratulations! You completed the game!
                </Text>
              </Stack>
              <ButtonPrimary onPress={handleGameEnd}>Back home</ButtonPrimary>
            </Stack>
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
      </Align>
    </>
  );
};

export default WordleGame;
