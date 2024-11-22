import {
  Align,
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  Inline,
  skinVars,
  Stack,
  Text,
  Text2,
  Text5,
} from "@telefonica/mistica";
import { useState, useEffect } from "react";
import Score from "../score";
import { IconCompleted, IconWrong } from "../../assets/icons/icons";
import { saveGameData } from "../../utils/score-manager";
import ContentWrapper from "../content-wrapper";
import { UI_LABEL } from "../../utils/constants";

const HigherOrLower = ({ onFinish }) => {
  const data = [
    { label: "Number of new components this year", value: 9 },
    { label: "Teams using the design system", value: 43 },
    { label: "Instances of the most used component in Figma", value: 490000 },
    { label: "Design tokens pushed this year", value: 1300 },
    { label: "Hours spent fixing design tokens", value: 700 },
  ];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("guessing");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem("gameScores")) || {};
    const savedGame = savedGames["higherOrLower"];

    if (savedGame?.completed) {
      setScore(savedGame.score);
      setStatus("final");
    }
  }, []);

  const current = data[index];
  const next = data[index + 1];

  const handleGuess = (guess) => {
    const isHigher = next?.value > current.value;
    const correct =
      (guess === "higher" && isHigher) || (guess === "lower" && !isHigher);

    if (correct) {
      setScore(score + 100); // Increment score for correct guess
      setMessage(
        `${next.label} (${next.value}) is ${
          isHigher ? "higher" : "lower"
        } than ${current.label} (${current.value}).`
      );
      setIsCorrect(true);
    } else {
      setMessage(
        `${next.label} (${next.value}) was ${
          isHigher ? "higher" : "lower"
        } than ${current.label} (${current.value}).`
      );
      setIsCorrect(false);
    }

    setStatus("feedback");
  };

  const nextRound = () => {
    if (index + 1 < data.length - 1) {
      setIndex(index + 1); // Move to the next question
      setMessage("");
      setStatus("guessing");
      setIsCorrect(null);
    } else {
      setStatus("final");
      saveGameData("Higher or lower", score, true);
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

  return (
    <ContentWrapper>
      {status === "guessing" && next && (
        <>
          <div style={{ ...flexStyles, textAlign: "center", gap: 48 }}>
            <Stack space={16}>
              <Text size={28} weight="bold">
                Current:
              </Text>
              <Text5>
                {current.label} ({current.value})
              </Text5>
              {next && (
                <Stack space={16}>
                  <Text size={28} weight="bold">
                    Will...
                  </Text>
                  <Text5>{next.label} be higher or lower?</Text5>
                </Stack>
              )}
            </Stack>
            <Inline space={16} alignItems="center">
              <ButtonPrimary onPress={() => handleGuess("higher")}>
                Higher
              </ButtonPrimary>
              <Text2>or</Text2>
              <ButtonDanger onPress={() => handleGuess("lower")}>
                Lower
              </ButtonDanger>
            </Inline>
          </div>
        </>
      )}

      {status === "feedback" && (
        <div style={{ ...flexStyles, textAlign: "center", gap: 48 }}>
          <GuessLabel correct={isCorrect} />
          <Text5>{message}</Text5>

          <ButtonSecondary onPress={nextRound}>Next Round</ButtonSecondary>
        </div>
      )}

      {status === "final" && (
        <div style={{ textAlign: "center" }}>
          <Stack space={16}>
            <Score score={score} isFinal />
            <ButtonPrimary onPress={handleGameEnd}>
              {UI_LABEL.END_GAME_BUTTON}
            </ButtonPrimary>
          </Stack>
        </div>
      )}
    </ContentWrapper>
  );
};

export default HigherOrLower;
