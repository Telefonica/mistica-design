import GamesView from "../pages/games-view";
import QuizView from "../pages/quiz-view";
import quizQuestions from "../components/quiz-questions";
import { IllustrationWoolClothes, IllustrationWishesLetter } from "../assets/illustrations/illustrations";

const contentByDate = {
    "2024-11-01": "Welcome to the Advent Calendar!",
    "2024-11-02": <GamesView game="Memory" />,
    "2024-11-03": <GamesView game="Wordle" />,
    "2024-11-04": <GamesView game="Candy" />,

    "2024-11-06": <QuizView 
    questionTitle={quizQuestions[0].questionTitle}
    options={quizQuestions[0].options}
    correctAnswer={quizQuestions[0].correctAnswer}
  />,

  "2024-11-07": <QuizView 
    questionTitle={quizQuestions[1].questionTitle}
    options={quizQuestions[1].options}
    correctAnswer={quizQuestions[1].correctAnswer}
  />,

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
    correctAnswer={quizQuestions[2].correctAnswer}
  />,
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
 };

 export default contentByDate;