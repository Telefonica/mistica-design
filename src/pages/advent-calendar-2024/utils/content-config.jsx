import GamesView from "../pages/games-view";
import QuizView from "../pages/quiz-view";
import quizQuestions from "../components/quiz-questions";
import {
  IllustrationWoolClothes,
  IllustrationWishesLetter,
} from "../assets/illustrations/illustrations";
import HigherOrLower from "../components/games/higher-or-lower";

const contentByDate = {
  "2024-11-20": {
    illustration: <IllustrationWishesLetter />,
    content: ({ closeModal }) => <HigherOrLower onFinish={closeModal} />,
    title: "Higher or Lower",
    description:
      "Answer the question by guessing whether the number is higher or lower than the given data.",
  },
};

export default contentByDate;
