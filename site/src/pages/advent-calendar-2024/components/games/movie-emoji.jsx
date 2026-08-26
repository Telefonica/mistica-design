import React, { useState, useEffect } from "react";
import { saveGameData } from "../../utils/score-manager";
import {
  BoxedRow,
  BoxedRowList,
  ButtonPrimary,
  RadioGroup,
  skinVars,
  Text5,
  Text,
  Stack,
  ButtonSecondary,
} from "@telefonica/mistica";
import { IconCompleted, IconWrong } from "../../assets/icons/icons";
import Score from "../score";
import GameBar from "../game-bar";
import QuizProgress from "../quiz-progress";
import ContentWrapper from "../content-wrapper";
import { UI_LABEL } from "../../utils/constants";

export const set1Movies = [
  {
    emojis: "🏠😱👦🎄",
    answer: "Home Alone",
    options: ["The Santa Clause", "The Incredibles"],
    correctAnswer: "Seems that you didn't forget this one!",
  },
  {
    emojis: "🧙‍♂️⚡️🦉🎓🏰",
    answer: "Harry Potter",
    options: ["The Chronicles of Narnia", "Percy Jackson & The Olympians"],
    correctAnswer: "You're a wizard Harry!",
  },
  {
    emojis: "🟢🎄🐶🎁",
    answer: "The Grinch",
    options: ["Beethoven", "The Santa Clause"],
    correctAnswer: "You're a mean one, Mr. Grinch!",
  },
  {
    emojis: "🧝‍♂️🎄🍝🍬",
    answer: "Elf",
    options: ["The Polar Express", "Jingle All the Way"],
    correctAnswer:
      "The best way to spread Christmas cheer is singing loud for all to hear!",
  },
  {
    emojis: "🚂❄️🎅🎁",
    answer: "The Polar Express",
    options: ["The Snowman", "Miracle on 34th Street"],
    correctAnswer: "Believe!",
  },
];

export const set2Movies = [
  {
    emojis: "❤️🎄🎶🎁",
    answer: "Love Actually",
    options: ["Notting Hill", "Valentine's Day"],
    correctAnswer: "To me, you are perfect.",
  },
  {
    emojis: "👴🕯️🎄👻",
    answer: "A Christmas Carol",
    options: ["Scrooged", "The Muppet Christmas Carol"],
    correctAnswer: "God bless us, everyone!",
  },
  {
    emojis: "❄️👸⛄🧊",
    answer: "Frozen",
    options: ["Brave", "The Chronicles of Narnia"],
    correctAnswer: "Let it go!",
  },
  {
    emojis: "🎃🎄👻🎅",
    answer: "The Nightmare Before Christmas",
    options: ["Coraline", "Beetlejuice"],
    correctAnswer: "What's this?",
  },
  {
    emojis: "🏢🔫🎄🚨",
    answer: "Die Hard",
    options: ["Lethal Weapon", "The Rock"],
    correctAnswer: "Yippee-ki-yay, motherf—!",
  },
];

const EmojiMovies = ({ set, movies, onFinish, onFinalScreen }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameName = `Emoji Movies${set}`;

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

  if (gameOver) {
    onFinalScreen(); // Notify the parent component
    return (
      <ContentWrapper>
        <div style={{ textAlign: "center" }}>
          <Stack space={32}>
            <Score score={`${score}`} isFinal />
            <ButtonPrimary onPress={handleGameEnd}>
              {UI_LABEL.END_GAME_BUTTON}
            </ButtonPrimary>
          </Stack>
        </div>
      </ContentWrapper>
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
    <ContentWrapper>
      <GameBar score={`${score}`} />
      <QuizProgress current={currentQuestionIndex + 1} total={movies.length} />
      <Stack space={32}>
        <div
          style={{
            padding: 80,
            background: skinVars.colors.backgroundAlternative,
            borderRadius: 16,
            position: "relative",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "2rem" }}>{emojis}</p>
        </div>

        {!showResult ? (
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
        ) : (
          <div style={{ textAlign: "center" }}>
            <Stack space={24}>
              <GuessLabel correct={isCorrect} />
              <Text5>{correctAnswer}</Text5>
              <ButtonSecondary onPress={handleNext}>
                {"Next Question"}
              </ButtonSecondary>
            </Stack>
          </div>
        )}
      </Stack>
    </ContentWrapper>
  );
};

export default EmojiMovies;
