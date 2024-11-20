import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  Inline,
  skinVars,
  Stack,
  Text,
  Text2,
  Text3,
} from "@telefonica/mistica";
import { useState } from "react";
import Score from "../score";
import { IconCompleted, IconWrong } from "../../assets/icons/icons";
import { DecorationPatty } from "../../assets/decorations/decorations";

const HigherOrLower = ({ onFinish }) => {
  const data = [
    { label: "Number of new components this year", value: 9 },
    { label: "Teams using the design system", value: 43 },
    { label: "Instances of the most used component in Figma", value: 490000 },
    { label: "Design tokens pushed this year", value: 1300 },
    { label: "Hours spent fixing design tokens", value: 700 },
  ];

  const [index, setIndex] = useState(0); // Tracks the current question index
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("guessing");
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false); // New state to track game completion

  const current = data[index];
  const next = data[index + 1];

  const handleGuess = (guess) => {
    const isHigher = next?.value > current.value;
    const correct =
      (guess === "higher" && isHigher) || (guess === "lower" && !isHigher);

    if (correct) {
      setScore(score + 100);
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
      setStatus("end");
      return;
    }

    setStatus("feedback");
  };

  const nextRound = () => {
    if (index + 1 < data.length - 1) {
      setIndex(index + 1); // Move to the next question
      setMessage("");
      setStatus("guessing");
      setIsCorrect(null); // Reset correctness for next round
    } else {
      setGameCompleted(true); // Mark game as completed
      setStatus("end");
    }
  };

  const handleGameEnd = () => {
    // Logic for completing the game
    if (onFinish) onFinish(); // Notify to close the modal
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
      <div style={{ position: "absolute", left: 48, top: 64 }}>
        <Score score={`${score}`} />
      </div>

      <div style={{ maxWidth: 600 }}>
        {status === "guessing" && next && (
          <Stack space={48}>
            <Stack space={16}>
              <Text size={28}>Current:</Text>
              <Text size={32} weight="bold">
                <strong>{current.label}</strong> ({current.value})
              </Text>
              {next && (
                <Stack space={16}>
                  <Text size={28}>Will...</Text>
                  <Text size={32} weight="bold">
                    <strong>{next.label}</strong> be higher or lower?
                  </Text>
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
          </Stack>
        )}

        {status === "feedback" && (
          <Stack space={24}>
            <GuessLabel correct={isCorrect} />
            <Text size={32} weight="medium">
              {message}
            </Text>

            <ButtonSecondary onPress={nextRound}>Next Round</ButtonSecondary>
          </Stack>
        )}

        {status === "end" && (
          <Stack space={24}>
            {gameCompleted ? (
              <Stack space={16}>
                <DecorationPatty text={`${score}`}></DecorationPatty>
                <Text3>Your final score</Text3>
                <Text size={32} weight="medium">
                  Congratulations! You completed the game!
                </Text>
              </Stack>
            ) : (
              <Stack space={16}>
                <DecorationPatty text={`${score}`}></DecorationPatty>
                <Text3>Your final score</Text3>
                {isCorrect !== null && <GuessLabel correct={isCorrect} />}
                <Text size={32} weight="medium">
                  {message || "Game Over!"}
                </Text>
              </Stack>
            )}
            <ButtonPrimary onPress={handleGameEnd}>End game</ButtonPrimary>
          </Stack>
        )}
      </div>
    </div>
  );
};

export default HigherOrLower;
