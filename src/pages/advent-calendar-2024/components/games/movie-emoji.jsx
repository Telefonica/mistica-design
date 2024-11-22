import React, { useState, useEffect } from "react";
import { saveGameData } from "../../utils/score-manager";
import {
  BoxedRow,
  BoxedRowList,
  ButtonPrimary,
  RadioGroup,
  Boxed,
  skinVars,
  Text5,
  Text,
  Align,
  useScreenSize,
} from "@telefonica/mistica";
import { IconCompleted, IconWrong } from "../../assets/icons/icons";
import Score from "../score";
import GameBar from "../game-bar";
import QuizProgress from "../quiz-progress";

const movies = [
  {
    emojis: "🏠😱👦🎄",
    answer: "Home Alone",
    options: ["Elf", "Love Actually"],
    correctAnswer: "Seems that you didn't forget this one!",
  },
  {
    emojis: "🧙‍♂️⚡️🦉🎓🏰",
    answer: "Harry Potter",
    options: ["Frozen", "The Polar Express"],
    correctAnswer: "You're a wizard Harry!",
  },
  {
    emojis: "🟢🎄🐶🎁",
    answer: "The Grinch",
    options: ["A Christmas Carol", "Elf"],
    correctAnswer: "You're a mean one, Mr. Grinch!",
  },
  {
    emojis: "❄️👸⛄🧊",
    answer: "Frozen",
    options: ["The Grinch", "Harry Potter"],
    correctAnswer: "Let it go!",
  },
];

const EmojiMovies = ({ onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { isMobile } = useScreenSize();

  const gameName = "Emoji Movies";

  const { emojis, answer, correctAnswer, options } =
    movies[currentQuestionIndex];
  const shuffledOptions = [...options, answer].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem("gameScores")) || {};
    const savedGame = savedGames[gameName];

    if (savedGame?.completed) {
      setScore(savedGame.score);
    }
  }, []);

  const handleOptionClick = (option) => {
    const correct = option === answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) setScore((prevScore) => prevScore + 100); // Add 100 points for a correct answer
  };

  const handleNext = () => {
    if (currentQuestionIndex === movies.length - 1) {
      setGameOver(true); // End the game when all questions are answered
      saveGameData(gameName, score, true);
    } else {
      setShowResult(false);
      setIsCorrect(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleGameEnd = () => {
    if (onFinish) onFinish(score); // Notify the parent component of the final score
  };

  const flexStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  if (gameOver) {
    return (
      <Align y="center" x="center" height={isMobile ? "auto" : "100vh"}>
        <div style={{ ...flexStyles, gap: 48 }}>
          <Score score={`${score}`} isFinal />
          <ButtonPrimary onPress={handleGameEnd}>Finish</ButtonPrimary>
        </div>
      </Align>
    );
  }

  const GuessLabel = ({ correct }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {correct ? <IconCompleted size={40} /> : <IconWrong size={40} />}
      <Text
        size={24}
        color={correct ? skinVars.colors.brand : skinVars.colors.error}
      >
        {correct ? "Correct!" : "Wrong!"}
      </Text>
    </div>
  );

  return (
    <Align
      y="center"
      x="center"
      height={isMobile ? "auto" : "calc(100vh - (56px * 2))"}
    >
      <GameBar score={`${score}`} />
      <QuizProgress current={currentQuestionIndex + 1} total={movies.length} />

      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 48,
          position: "relative",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <div
          style={{
            padding: 80,
            background: skinVars.colors.backgroundAlternative,

            borderRadius: 16,
            position: "relative",
          }}
        >
          <p style={{ fontSize: "2rem" }}>{emojis}</p>
        </div>
        {!showResult ? (
          <div style={{ width: "100%", maxWidth: 600 }}>
            <RadioGroup options={shuffledOptions} onChange={handleOptionClick}>
              <BoxedRowList>
                {shuffledOptions.map((option, index) => (
                  <BoxedRow
                    title={option}
                    key={index}
                    radioValue={option}
                  ></BoxedRow>
                ))}
              </BoxedRowList>
            </RadioGroup>
          </div>
        ) : (
          <div style={{ ...flexStyles, gap: 24 }}>
            <GuessLabel correct={isCorrect} />
            <Text5>{correctAnswer}</Text5>
            <ButtonPrimary onPress={handleNext}>
              {"Next Question"}
            </ButtonPrimary>
          </div>
        )}
      </div>
    </Align>
  );
};

export default EmojiMovies;
