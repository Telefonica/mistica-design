import GamesView from "../pages/games-view";

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
import { GuessWhat, icons, questions } from "../components/quizzes/guess-what";
import { componentQuestions } from "../components/quizzes/guess-what";
import { iconQuestions } from "../components/quizzes/guess-what";
import { componentAssets } from "../components/quizzes/guess-what";
import EmojiMovies from "../components/games/movie-emoji";
import GuessTheComponent, {
  meterGuess,
  NakedCardGuess,
} from "../components/quizzes/guess-component";
import CandyCrush from "../components/games/candy";
import AdventCalendarHistory from "../components/static-content/advent-calendar-history";
import ChristmasGreetings from "../components/static-content/christmas-greetings";
import TopContributors from "../components/static-content/top-contributors";
import {
  Illustration02,
  Illustration03,
  Illustration04,
  Illustration05,
  Illustration06,
  Illustration09,
} from "../assets/illustrations/illustrations";
import Horoscope from "../components/static-content/horoscope";

const contentByDate = {
  "2024-12-02": {
    repeatable: false,
    illustration: <Illustration02 />,
    content: ({ closeModal }) => <CandyCrush onFinish={closeModal} />,
    title: "“Brandy” crush",
    description:
      "Try to match Telefónica brands of the same type in a row or column of 3. You have 10 moves. Can you score the highest with the fewest moves?",
  },
  "2024-12-03": {
    repeatable: false,
    illustration: <Illustration03 />,
    content: ({ closeModal }) => <EmojiMovies onFinish={closeModal} />,
    title: "Emoji movie",
    description:
      "Can you guess which Christmas movie these emojis represent? 🎬.",
  },
  "2024-12-04": {
    repeatable: true,
    illustration: <Illustration04 />,
    content: (
      <GuessWhat questions={componentQuestions} quizType={"component"} />
    ),
    title: "Component Match",
    description:
      "If you were an Mística icon, which one would you be? Choose the answers that best fit you and find out! ",
  },
  "2024-12-05": {
    repeatable: false,
    illustration: <Illustration05 />,
    content: ({ closeModal }) => <HigherOrLower onFinish={closeModal} />,
    title: "Higher or Lower",
    description:
      "Answer the question by guessing whether the number is higher or lower than the given data.",
  },
  "2024-12-06": {
    repeatable: false,
    illustration: <Illustration06 />,
    content: ({ closeModal }) => <WordleGame onFinish={closeModal} />,
    title: "Wordle",
    description: (
      <>
        <Text3 color={skinVars.colors.brand}>
          Type your attempts, hit 'Enter,' and let the letters reveal their
          secrets. <br />
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: skinVars.colors.warning,
                border: `2px solid white`,
                borderRadius: "4px",
              }}
            ></div>
            Yellow indicates the letter is in the word but in the wrong
            position.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
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
  "2024-12-09": {
    repeatable: true,
    illustration: <Illustration09 />,
    content: <Horoscope />,
    title: "Mística zodiac sign",
    description:
      "What component are you based on your zodiac sign? Discover your match!",
  },
  "2024-12-10": {
    repeatable: false,
    content: ({ closeModal }) => (
      <GuessTheComponent component={meterGuess} onFinish={closeModal} />
    ),
    title: "What Mística component is?",
    description:
      "Can you guess which is? Only the wisest will succeed! The component image is blurred to make it more difficult, you don't need to put on your glasses 👓 ",
  },
  "2024-12-11": {
    repeatable: true,
    content: <AdventCalendarHistory />,
    title: "Did you know...",
    description: "Where the tradition Christmas calendar comes from?",
  },
  "2024-12-12": {
    illustration: <IllustrationWoolClothes />,
    content: ({ closeModal }) => <MemoryGame onFinish={closeModal} />,
    title: "Memory cards",
    description: (
      <Text3 color={skinVars.colors.brand}>
        Chaos has struck in Mística—a series of icons have been shuffled out of
        place! It's your mission to match them and restore harmony in less than
        60s.
        <br /> <br />
        Flip the cards, find the pairs, and show off your memory skills to bring
        everything back in order!
      </Text3>
    ),
  },
  "2024-12-13": {
    repeatable: true,
    content: <GuessWhat questions={iconQuestions} quizType={"icon"} />,
    title: "Icon Match",
    description:
      "If you were an Mística icon, which one would you be? Choose the answers that best fit you and find out! ",
  },
  "2024-12-18": {
    repeatable: false,
    content: ({ closeModal }) => (
      <GuessTheComponent component={NakedCardGuess} onFinish={closeModal} />
    ),
    title: "What Mística component is?",
    description:
      "Can you guess which is? Only the wisest will succeed! The component image is blurred to make it more difficult, you don't need to put on your glasses 👓 ",
  },
  "2024-12-20": {
    repeatable: true,
    content: <TopContributors />,
    title: "Top contributors",
    description: "A big thank you to our contributors!",
  },
  "2024-12-22": {
    content: ({ closeModal }) => <SimonSays onFinish={closeModal} />,
    title: "Simon says",
    description: (
      <>
        <Text3 color={skinVars.colors.brand}>
          Press Start to begin! Follow a sequence of flashing colors, and repeat
          it back by pressing the buttons in the same order.
          <br /> Each round, the sequence grows, testing how far you can go
          before you lose track. <br />
          <br />
        </Text3>
        <Text1 color={skinVars.colors.brand}>
          Want to hear the colors? Press the sound toggle to listen to the fun
          sounds and make the game even more exciting!
        </Text1>
      </>
    ),
  },
  "2024-12-23": {
    content: ({ closeModal }) => <WordleGame onFinish={closeModal} />,
    title: "Wordle",
    description: (
      <>
        <Text3 color={skinVars.colors.brand}>
          Type your attempts, hit 'Enter,' and let the letters reveal their
          secrets. <br />
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: skinVars.colors.warning,
                border: `2px solid white`,
                borderRadius: "4px",
              }}
            ></div>
            Yellow indicates the letter is in the word but in the wrong
            position.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
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
  "2024-12-25": {
    repeatable: true,
    content: <ChristmasGreetings />,
    title: "Happy Christmas!",
    description: "And a merry new year",
  },
};

export default contentByDate;
