import GamesView from "../pages/games-view";
import QuizView from "../pages/quiz-view";
import quizQuestions from "../components/quiz-questions";
import { Text3 } from "@telefonica/mistica";
import {
  IllustrationWoolClothes,
  IllustrationWishesLetter,
} from "../assets/illustrations/illustrations";
import HigherOrLower from "../components/games/higher-or-lower";
import MemoryGame from "../components/games/memory";
import SimonSays from "../components/games/simon";
import WordleGame from "../components/games/wordle";

const contentByDate = {
  "2024-11-01": "Welcome to the Advent Calendar!",
    
    "2024-11-02": {
      illustration: <IllustrationWishesLetter />,
      content: <GamesView game="Memory" />,
      title: "Memory Cards",
      description: "Play Memory Cards!",
    },

    "2024-11-03": {
      illustration: <IllustrationWishesLetter />,
      content: <GamesView game="Wordle" />,
      title: "Wordle",
      description: "Play Wordle!",
    },

    "2024-11-04": {
    illustration: <IllustrationWishesLetter />,
    content: <GamesView game="Candy" />,
    title: "Candy Crush",
    description: "Play Candy Crush!",
  },

    "2024-11-06": {
    illustration: <IllustrationWoolClothes />,
    content: <QuizView 
    questionTitle={quizQuestions[0].questionTitle}
    options={quizQuestions[0].options}
    correctAnswer={quizQuestions[0].correctAnswer}/>,
    title: "Quiz",
    description: "Test your knowledge of Mística!",
    },

  "2024-11-07": {
    illustration: <IllustrationWishesLetter />,
    content: <QuizView 
    questionTitle={quizQuestions[1].questionTitle}
    options={quizQuestions[1].options}
    correctAnswer={quizQuestions[1].correctAnswer}/>,
    title: "Quiz",
    description: "Test your knowledge of Mística!",
  },

  "2024-11-11": {
    illustration: <IllustrationWishesLetter />,
    content: <QuizView 
    questionTitle={quizQuestions[3].questionTitle}
    options={quizQuestions[3].options}
    correctAnswer={quizQuestions[3].correctAnswer}></QuizView>,
    title: "Movie Night",
    description: "Watch a movie with your family or friends.",
  },
  "2024-11-12": {
    illustration: <IllustrationWoolClothes />,
    content: <QuizView 
    questionTitle={quizQuestions[2].questionTitle}
    options={quizQuestions[2].options}
    correctAnswer={quizQuestions[2].correctAnswer}/>,
    title: "Movie Night",
    description: "Watch a movie with your family or friends.",
  },
  "2024-11-18": {
    illustration: <IllustrationWishesLetter />,
    title: "Movie Night",
    description: "Watch a movie with your family or friends.",
  },
  "2024-11-19": {
    illustration: <IllustrationWoolClothes />,
    content: <GamesView game="Simon" />,
    title: "Movie Night",
    description: "Watch a movie with your family or friends.",
  },
 
  "2024-11-20": {
    forceAvailable: true,
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
    description: "Play games and have fun!",
  },
  "2024-11-22": {
    content: ({ closeModal }) => <SimonSays onFinish={closeModal} />,
    title: "Simon says",
    description:
      "Press Start to begin! Follow a sequence of flashing colors, and repeat it back by pressing the buttons in the same order. <br /> Each round, the sequence grows, testing how far you can go before you lose track.",
  },
  "2024-11-23": {
    content: ({ closeModal }) => <WordleGame onFinish={closeModal} />,
    title: "Wordle",
    description: (
      <>
        <Text3>
          A crucial word has disappeared from Mística, and it's up to you to
          find it! <br />
          Each guess brings you closer to restoring order. Type your attempts,
          hit 'Enter,' and let the letters reveal their secrets. <br />
          Can you uncover the missing word and bring balance back to Mística?{" "}
          <br />
          <br />
        </Text3>
        <p>
          In the game, colors guide your guesses:
          <br />- <span style={{ color: "gray" }}>Gray</span> means the letter
          is not in the word.
          <br />- <span style={{ color: "#FFD700" }}>Yellow</span> indicates the
          letter is in the word but in the wrong position.
          <br />- <span style={{ color: "green" }}>Green</span> shows that the
          letter is correct and in the right spot.
          <br />
          Use these clues wisely to solve the mystery!
        </p>
      </>
    ),
  },
};

export default contentByDate;
