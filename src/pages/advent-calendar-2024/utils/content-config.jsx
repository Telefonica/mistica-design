import GamesView from "../pages/games-view";
import QuizView from "../pages/quiz-view";
import quizQuestions from "../components/quiz-questions";

const contentByDate = {
    "2024-11-01": "Welcome to the Advent Calendar!",
    "2024-11-02": <GamesView game="Memory" />,
    "2024-11-03": <GamesView game="Wordle" />,
    "2024-11-04": <GamesView game="Candy" />,
    "2024-11-05": <GamesView game="Simon" />,

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

  "2024-11-08": <QuizView 
    questionTitle={quizQuestions[2].questionTitle}
    options={quizQuestions[2].options}
    correctAnswer={quizQuestions[2].correctAnswer}
  />,

  "2024-11-09": <QuizView 
    questionTitle={quizQuestions[3].questionTitle}
    options={quizQuestions[3].options}
    correctAnswer={quizQuestions[3].correctAnswer}
  />,
 };

 export default contentByDate;