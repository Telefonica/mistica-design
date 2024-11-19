import GamesView from "../pages/games-view";
import QuizView from "../pages/quiz-view";
import quizQuestions from "../components/quiz-questions";
import { IllustrationWoolClothes, IllustrationWishesLetter } from "../assets/illustrations/illustrations";

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
 };

 export default contentByDate;