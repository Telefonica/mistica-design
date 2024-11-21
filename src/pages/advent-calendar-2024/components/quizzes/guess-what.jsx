import { useEffect, useState } from "react";
import {
  ResponsiveLayout,
  Stack,
  Text4,
  RadioGroup,
  RadioButton,
  ButtonPrimary,
  BoxedRow,
  BoxedRowList,
  Text5,
  IconLightningRegular,
  IconAcademicRegular,
  IconBicycleBikeRegular,
  IconAngelRegular,
  IconCocktailRegular,
  skinVars,
} from "@telefonica/mistica";
import DecorationPatty from "../../assets/decorations/decoration-patty";

export const icons = {
  lightning: IconLightningRegular,
  academic: IconAcademicRegular,
  "bicycle-bike": IconBicycleBikeRegular,
  angel: IconAngelRegular,
  cocktail: IconCocktailRegular,
};

export const questions = [
  {
    question: "How would you describe your personality?",
    options: [
      { label: "A fast-paced, high-energy person", icon: "lightning" },
      { label: "A thoughtful, methodical person", icon: "academic" },
      { label: "An active, adventurous person", icon: "bicycle-bike" },
      { label: "A kind, nurturing person", icon: "angel" },
      { label: "A social, fun-loving person", icon: "cocktail" },
    ],
  },
  {
    question: "What kind of activities do you enjoy most?",
    options: [
      { label: "Someone who loves challenges", icon: "lightning" },
      { label: "Someone who loves reading and learning", icon: "academic" },
      { label: "Someone who enjoys being outdoors", icon: "bicycle-bike" },
      { label: "Someone who believes in helping others", icon: "angel" },
      { label: "Someone who enjoys going out", icon: "cocktail" },
    ],
  },
  {
    question: "Which phrase resonates the most with you?",
    options: [
      { label: "You like to take risks", icon: "lightning" },
      { label: "You enjoy solving problems", icon: "academic" },
      { label: "You value sustainability", icon: "bicycle-bike" },
      { label: "You feel connected to something greater", icon: "angel" },
      { label: "You like to relax with a drink", icon: "cocktail" },
    ],
  },
  {
    question: "How would others describe your style?",
    options: [
      { label: "Bold and dynamic", icon: "lightning" },
      { label: "Organized and structured", icon: "academic" },
      { label: "Sporty and energetic", icon: "bicycle-bike" },
      { label: "Spiritual and peaceful", icon: "angel" },
      { label: "Charming and sophisticated", icon: "cocktail" },
    ],
  },
  {
    question: "How do you prefer to spend your free time?",
    options: [
      { label: "Prefer excitement over relaxation", icon: "lightning" },
      { label: "Calm and reflective", icon: "academic" },
      { label: "Appreciates freedom and movement", icon: "bicycle-bike" },
      { label: "Loves to give guidance and support", icon: "angel" },
      { label: "Vibrant social settings", icon: "cocktail" },
    ],
  },
];

const components = {
  lightning: {
    name: "LightningComponent",
    docLink: "https://docs.example.com/lightning",
  },
  academic: {
    name: "AcademicComponent",
    docLink: "https://docs.example.com/academic",
  },
  "bicycle-bike": {
    name: "BicycleComponent",
    docLink: "https://docs.example.com/bicycle",
  },
  angel: {
    name: "AngelComponent",
    docLink: "https://docs.example.com/angel",
  },
  cocktail: {
    name: "CocktailComponent",
    docLink: "https://docs.example.com/cocktail",
  },
};

export const GuessWhat = ({ quizName, quizAnswer, questions, icons }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill("")); // Store answers dynamically based on the number of questions
  const [finalResult, setFinalResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index

  // Load saved quiz data from localStorage based on the quiz name
  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizData")) || {};
    const savedGame = savedQuizzes[quizName]; // Get data specific to this quiz

    if (savedGame) {
      setAnswers(savedGame.answers);
      setCurrentQuestionIndex(savedGame.currentQuestionIndex || 0);
      if (savedGame?.completed) {
        setFinalResult(savedGame.icon); // Set the icon if quiz is completed
      }
    }
  }, [quizName]);

  // Handle the change of an answer
  const handleAnswerChange = (index) => (value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // Save the answers and current question index immediately in localStorage
    const savedQuizzes = JSON.parse(localStorage.getItem("quizData")) || {};
    savedQuizzes[quizName] = {
      answers: newAnswers,
      icon: null, // Not yet calculated until submission
      completed: false, // Quiz is not completed yet
      currentQuestionIndex: index + 1, // Update the current question index
    };
    localStorage.setItem("quizData", JSON.stringify(savedQuizzes));

    // Move to the next question or calculate the result if it's the last question
    if (index < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(index + 1);
      }, 750);
    } else {
      setTimeout(() => {
        handleSubmit();
      }, 750);
      // If it's the last question, submit the quiz
    }
  };

  // Calculate the result based on the answers
  const handleSubmit = () => {
    // Initialize a score object that dynamically uses the icons from the questions options
    const score = {};

    // Iterate over each question's options to initialize score keys dynamically
    questions.forEach((questionObj) => {
      questionObj.options.forEach((option) => {
        score[option.icon] = 0; // Initialize score for each possible icon
      });
    });

    // Count the selected icons based on answers
    answers.forEach((answer) => {
      if (answer) {
        score[answer] += 1;
      }
    });

    // Find the icon with the highest score
    const maxScoreIcon = Object.keys(score).reduce(
      (maxIcon, icon) => (score[icon] > score[maxIcon] ? icon : maxIcon),
      Object.keys(score)[0] // Default to the first key if no score
    );

    setFinalResult(maxScoreIcon);

    // Save the final result to localStorage
    const savedQuizzes = JSON.parse(localStorage.getItem("quizData")) || {};
    savedQuizzes[quizName] = {
      answers,
      icon: maxScoreIcon,
      completed: true,
      currentQuestionIndex: currentQuestionIndex,
    };
    localStorage.setItem("quizData", JSON.stringify(savedQuizzes));
  };

  const FinalIcon = icons[finalResult];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Show question based on current question index */}
      {!finalResult && (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ maxWidth: 600, width: "100%" }}
        >
          <Stack space={24}>
            {/* Display only the current question */}
            <div key={currentQuestionIndex}>
              <Stack space={64}>
                <Text5>{questions[currentQuestionIndex].question}</Text5>

                <RadioGroup
                  name={`question-${currentQuestionIndex}`}
                  value={answers[currentQuestionIndex]}
                  onChange={handleAnswerChange(currentQuestionIndex)}
                >
                  <BoxedRowList>
                    {questions[currentQuestionIndex].options.map(
                      (option, optionIndex) => (
                        <BoxedRow
                          title={option.label}
                          key={optionIndex}
                          id={`question-${currentQuestionIndex}-option-${optionIndex}`}
                          radioValue={option.icon}
                        ></BoxedRow>
                      )
                    )}
                  </BoxedRowList>
                </RadioGroup>
              </Stack>
            </div>
          </Stack>
        </form>
      )}

      {/* Show final result */}
      {finalResult && (
        <div>
          {quizAnswer === "icon" ? (
            <>
              <h2>Your icon: {finalResult}</h2>
              <DecorationPatty size={220}>
                {FinalIcon && (
                  <FinalIcon size={110} color={skinVars.colors.brand} />
                )}{" "}
              </DecorationPatty>
              {/* Dynamically render the icon */}
              <p>
                Based on your answers, the icon that best represents you is:{" "}
                <strong>
                  {finalResult.charAt(0).toUpperCase() + finalResult.slice(1)}
                </strong>
                .
              </p>
            </>
          ) : (
            <>
              <h2>Your component: {components[finalResult].name}</h2>
              <a
                href={components[finalResult].docLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Documentation
              </a>
              <p>
                Based on your answers, the component that best represents you
                is: <strong>{components[finalResult].name}</strong>.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
