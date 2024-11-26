import { Placeholder, skinVars, Text1, Text3 } from "@telefonica/mistica";

import {
  Illustration02,
  Illustration03,
  Illustration04,
  Illustration05,
  Illustration06,
  Illustration09,
  Illustration10,
  Illustration11,
  Illustration12,
  Illustration13,
  Illustration16,
  Illustration17,
  Illustration18,
  Illustration19,
  Illustration20,
  Illustration23,
  Illustration24,
  Illustration25,
} from "../assets/illustrations/illustrations";

import CandyCrush from "../components/games/candy";
import MemoryGame from "../components/games/memory";
import EmojiMovies, {
  set1Movies,
  set2Movies,
} from "../components/games/movie-emoji";
import SimonSays from "../components/games/simon";
import WordleGame from "../components/games/wordle";
import {
  componentQuestions,
  GuessWhat,
  iconQuestions,
} from "../components/quizzes/guess-what";
import AdventCalendarHistory from "../components/static-content/advent-calendar-history";
import ChristmasGreetings from "../components/static-content/christmas-greetings";
import ChristmasMovies from "../components/static-content/christmas-movies";
import Horoscope from "../components/static-content/horoscope";
import TopContributors from "../components/static-content/top-contributors";
import MusicLists from "../components/static-content/music-list";
import HigherOrLower, {
  HigherLowerdataSet1,
  HigherLowerdataSet2,
} from "../components/games/higher-or-lower";
import GuessTheComponent from "../components/quizzes/guess-component";
import {
  guessComponentSet1,
  guessComponentSet2,
} from "../components/quizzes/guess-component";

const contentByDate = {
  "2024-12-02": {
    repeatable: false,
    illustration: <Illustration02 />,
    illustrationDimmed: <Illustration02 disabled />,
    content: ({ closeModal }) => <CandyCrush onFinish={closeModal} />,
    title: "“Brandy” crush",
    description:
      "Try to match Telefónica brands of the same type in a row or column of 3. You have 10 moves. Can you score the highest with the fewest moves?",
  },
  "2024-12-03": {
    repeatable: false,
    illustration: <Illustration03 />,
    illustrationDimmed: <Illustration03 disabled />,
    content: ({ closeModal }) => (
      <EmojiMovies movies={set1Movies} onFinish={closeModal} />
    ),
    title: "Emoji movie",
    description:
      "Can you guess which Christmas movie these emojis represent? 🎬.",
  },
  "2024-12-04": {
    repeatable: false,
    illustration: <Illustration04 />,
    illustrationDimmed: <Illustration04 disabled />,
    content: (
      <GuessWhat questions={componentQuestions} quizType={"component"} />
    ),
    title: "Component Match",
    description:
      "If you were a component, which one would you be? Find out here! 🧩",
  },
  "2024-12-05": {
    repeatable: false,
    content: ({ closeModal }) => <WordleGame onFinish={closeModal} />,
    illustration: <Illustration05 />,
    illustrationDimmed: <Illustration05 disabled />,
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
  "2024-12-06": {
    repeatable: true,
    illustration: <Illustration06 />,
    illustrationDimmed: <Illustration06 disabled />,
    content: <AdventCalendarHistory />,
    title: "Did you know...",
    description: "Where the tradition Christmas calendar comes from?",
  },
  "2024-12-09": {
    repeatable: true,
    illustration: <Illustration09 />,
    illustrationDimmed: <Illustration09 disabled />,
    content: <Horoscope />,
    title: "Mística zodiac sign",
    description:
      "What component are you based on your zodiac sign? Discover your match!",
  },
  "2024-12-10": {
    repeatable: false,
    illustration: <Illustration10 />,
    illustrationDimmed: <Illustration10 disabled />,
    content: ({ closeModal }) => (
      <GuessTheComponent component={meterGuess} onFinish={closeModal} />
    ),
    title: "What Mística component is?",
    description:
      "Can you guess which is? Only the wisest will succeed! The component image is blurred to make it more difficult, you don't need to put on your glasses 👓 ",
  },
  "2024-12-11": {
    repeatable: false,
    illustration: <Illustration11 />,
    illustrationDimmed: <Illustration11 disabled />,
    content: ({ closeModal }) => (
      <HigherOrLower set={1} data={HigherLowerdataSet1} onFinish={closeModal} />
    ),
    title: "Higher or Lower",
    description:
      "Answer the question by guessing whether the number is higher or lower than the given data.",
  },
  "2024-12-12": {
    repeatable: true,
    illustration: <Illustration12 />,
    illustrationDimmed: <Illustration12 disabled />,
    content: <GuessWhat questions={iconQuestions} quizType={"icon"} />,
    title: "Icon Match",
    description:
      "If you were an Mística icon, which one would you be? Choose the answers that best fit you and find out! ",
  },
  "2024-12-13": {
    repeatable: false,
    illustration: <Illustration13 />,
    illustrationDimmed: <Illustration13 disabled />,
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

  "2024-12-16": {
    repeatable: false,
    illustration: <Illustration16 />,
    illustrationDimmed: <Illustration16 disabled />,
    content: ({ closeModal }) => (
      <EmojiMovies movies={set2Movies} onFinish={closeModal} />
    ),
    title: "Emoji movie",
    description:
      "Can you guess which Christmas movie these emojis represent? 🎬.",
  },
  "2024-12-17": {
    repeatable: false,
    illustration: <Illustration17 />,
    illustrationDimmed: <Illustration17 disabled />,
    content: ({ closeModal }) => (
      <HigherOrLower set={2} data={HigherLowerdataSet2} onFinish={closeModal} />
    ),
    title: "Higher or Lower",
    description:
      "Answer the question by guessing whether the number is higher or lower than the given data.",
  },
  "2024-12-18": {
    repeatable: false,
    illustration: <Illustration18 />,
    illustrationDimmed: <Illustration18 disabled />,
    content: ({ closeModal }) => (
      <GuessTheComponent
        set={2}
        questions={guessComponentSet2}
        onFinish={closeModal}
      />
    ),
    title: "What Mística component is?",
    description:
      "Can you guess which is? Only the wisest will succeed! The component image is blurred to make it more difficult, you don't need to put on your glasses 👓 ",
  },
  "2024-12-19": {
    repeatable: true,
    illustration: <Illustration19 />,
    illustrationDimmed: <Illustration19 disabled />,
    content: <TopContributors />,
    title: "Top contributors",
    description: "A big thank you to our contributors!",
  },
  "2024-12-20": {
    repeatable: false,
    illustration: <Illustration20 />,
    illustrationDimmed: <Illustration20 disabled />,
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
    repeatable: true,
    illustration: <Illustration23 />,
    illustrationDimmed: <Illustration23 disabled />,
    content: <ChristmasMovies />,
    title: "Popcorn Night",
    description:
      "If you prefer to stay home these days and enjoy some peace and quiet, here are some “Christmas” movie recommendations.🍿 And don't worry, the Grinch won't mind you staying home! 😜",
  },
  "2024-12-24": {
    repeatable: true,
    illustration: <Illustration24 />,
    illustrationDimmed: <Illustration24 disabled />,
    content: <MusicLists />,
    title: "Tired of carols?",
    description:
      "These playlists are for those who want something different this season.",
  },
  "2024-12-25": {
    repeatable: true,
    illustration: <Illustration25 />,
    illustrationDimmed: <Illustration25 disabled />,
    content: <ChristmasGreetings />,
    title: "Happy Christmas!",
    description: "And a merry new year",
  },
};

export default contentByDate;
