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
} from "@telefonica/mistica";
import { IconCompleted, IconWrong } from "../../assets/icons/icons";
import Score from "../score";
import GameBar from "../game-bar";
import MeterSvg from "../../assets/meter";
import NakedCardGuessImg from "../../assets/images/naked-card.png";
import BadgeGuessImg from "../../assets/images/badge.png";
import ChipGuessImg from "../../assets/images/chip.png";
import SwitchGuessImg from "../../assets/images/switch.png";
import TooltipGuessImg from "../../assets/images/tooltip.png";
import ContentWrapper from "../content-wrapper";
import { UI_LABEL } from "../../utils/constants";

export const guessComponentSet1 = [
  {
    id: "nakedCard",
    asset: <img src={NakedCardGuessImg} alt="" />,
    answer: "Naked card",
    options: ["Data card", "Media card"],
    correctAnswer: "This is the Naked card component!",
  },
  {
    id: "meter",
    asset: <MeterSvg />,
    answer: "Meter",
    options: ["Progress Bar", "Loading Spinner"],
    correctAnswer: "This is the Meter component!",
  },
  {
    id: "chip",
    asset: <img src={ChipGuessImg} alt="" />,
    answer: "Chip",
    options: ["Button", "Tag"],
  },
];

export const guessComponentSet2 = [
  {
    id: "toltiop",
    asset: <img src={TooltipGuessImg} alt="" />,
    answer: "Tooltip",
    options: ["Sheet", "Select"],
  },
  {
    id: "badge",
    asset: <img src={BadgeGuessImg} alt="" />,
    answer: "Badge",
    options: ["Radio button", "Logo"],
  },
  {
    id: "switch",
    asset: <img src={SwitchGuessImg} alt="" />,
    answer: "Switch",
    options: ["Stacking group", "Counter"],
  },
];

const GuessTheComponent = ({ questions, onFinish, set }) => {
  const [currentStep, setCurrentStep] = useState("guessing"); // Steps: 'guessing', 'answer', 'gameOver'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const gameName = `guessComponent${set}`;
  const currentQuestion = questions[currentIndex];
  const { asset, answer, correctAnswer, options } = currentQuestion;
  const shuffledOptions = [...options, answer].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem("gameScores")) || {};
    const savedGame = savedGames[gameName];

    if (savedGame?.completed) {
      setScore(savedGame.score);
    }
  }, [gameName]);

  const handleOptionClick = (option) => {
    const correct = option === answer;
    setIsCorrect(correct);
    setScore((prevScore) => prevScore + (correct ? 100 : 0));
    setCurrentStep("answer");
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setCurrentStep("guessing");
    } else {
      saveGameData(gameName, score, true); // Save the total score for the set
      setCurrentStep("gameOver");
    }
  };

  const handleGameEnd = () => {
    if (onFinish) onFinish(); // Notify the parent component
  };

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

  const flexStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  if (currentStep === "gameOver") {
    return (
      <ContentWrapper textAlign="center">
        <div style={{ ...flexStyles, gap: 48 }}>
          <Score score={`${score}`} isFinal />
          <ButtonPrimary onPress={handleGameEnd}>
            {UI_LABEL.END_GAME_BUTTON}
          </ButtonPrimary>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <>
      <GameBar score={`${score}`} />
      <ContentWrapper>
        <Stack space={32}>
          <div
            style={{
              display: "flex",
              padding: "64px 0",
              alignContent: "center",
              justifyContent: "center",
              background: skinVars.colors.backgroundAlternative,
              borderRadius: 16,
              position: "relative",
            }}
          >
            <div
              style={{
                filter: currentStep === "guessing" ? "blur(4px)" : "none",
              }}
            >
              {asset}
            </div>
          </div>

          {currentStep === "guessing" && (
            <div style={{ textAlign: "initial" }}>
              <RadioGroup
                options={shuffledOptions}
                onChange={handleOptionClick}
              >
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
          )}
          {currentStep === "answer" && (
            <div style={{ ...flexStyles, gap: 24 }}>
              <GuessLabel correct={isCorrect} />
              <Text5>{correctAnswer}</Text5>
              <ButtonPrimary onPress={handleNext}>{"Next"}</ButtonPrimary>
            </div>
          )}
        </Stack>
      </ContentWrapper>
    </>
  );
};

export default GuessTheComponent;
