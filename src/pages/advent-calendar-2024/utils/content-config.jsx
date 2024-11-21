import GamesView from "../pages/games-view";
import QuizView from "../pages/quiz-view";
import quizQuestions from "../components/quiz-questions";

import { Text3, Text1, skinVars } from "@telefonica/mistica";

import {
  IllustrationWoolClothes,
  IllustrationWishesLetter,
} from "../assets/illustrations/illustrations";
import HigherOrLower from "../components/games/higher-or-lower";
import MemoryGame from "../components/games/memory";
import SimonSays from "../components/games/simon";
import WordleGame from "../components/games/wordle";

const contentByDate = {
  "2024-11-20": {

    repeatable: true,

    illustration: <IllustrationWishesLetter />,
    content: ({ closeModal }) => <HigherOrLower onFinish={closeModal} />,
    title: "Higher or Lower",
    description:
      "Answer the question by guessing whether the number is higher or lower than the given data.",
  },
  "2024-11-21": {

    illustration: <IllustrationWoolClothes />,
    content: ({ closeModal }) => <MemoryGame onFinish={closeModal} />,
    title: "Memory cards",
    description: <Text3 color={skinVars.colors.brand}>
      Chaos has struck in Mística—a series of icons have been shuffled out of place!
      It's your mission to match them and restore harmony in less than 60s.
      <br /> <br />
      Flip the cards, find the pairs, and show off your memory skills to bring everything back in order! 
 </Text3>
  },
  "2024-11-22": {
  content: ({ closeModal }) => <SimonSays onFinish={closeModal} />,
  title: "Simon says",
  description: (
    <>
      <Text3 color={skinVars.colors.brand}>
        Press Start to begin! Follow a sequence of flashing colors, and repeat it back by pressing the buttons in the same order.
        <br /> Each round, the sequence grows, testing how far you can go before you lose track. <br /><br />
      </Text3>
      <Text1 color={skinVars.colors.brand}>
        Want to hear the colors? Press the sound toggle to listen to the fun sounds and make the game even more exciting!
      </Text1>
    </>
  )
},

  "2024-11-23": {
    content: ({ closeModal }) => <WordleGame onFinish={closeModal} />,
    title: "Wordle",
    description: (
      <>

        <Text3 color={skinVars.colors.brand}>
          Type your attempts,

          hit 'Enter,' and let the letters reveal their secrets. <br />
          Can you uncover the missing word and bring balance back to Mística?{" "}
          <br />
          <br />
        </Text3>

        <Text1 color={skinVars.colors.brand}>
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#d9d9d9",
        border: `2px solid white`,
        borderRadius: "4px",
      }}
    ></div>
    Gray means the letter is not in the word.
  </div>
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: skinVars.colors.warning,
        border: `2px solid white`,
        borderRadius: "4px",
      }}
    ></div>
    Yellow indicates the letter is in the word but in the wrong position.
  </div>
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: skinVars.colors.success,
        border: `2px solid white`,
        borderRadius: "4px",
      }}
    ></div>
    Green shows that the letter is correct and in the right spot.
  </div>
  <br />
  Use these clues wisely to solve the mystery!
</Text1>

      </>
    ),
  },
};

export default contentByDate;
