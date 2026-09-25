import { useEffect, useState } from "react";
import {
  Stack,
  Text,
  RadioGroup,
  BoxedRow,
  BoxedRowList,
  Text5,
  IconLightningRegular,
  IconAcademicRegular,
  IconBicycleBikeRegular,
  IconAngelRegular,
  IconCocktailRegular,
  skinVars,
  TextLink,
} from "@telefonica/mistica";
import DecorationPatty from "../../assets/decorations/decoration-patty";
import QuizProgress from "../quiz-progress";
import ContentWrapper from "../content-wrapper";

export const iconAssets = {
  lightning: IconLightningRegular,
  academic: IconAcademicRegular,
  "bicycle-bike": IconBicycleBikeRegular,
  angel: IconAngelRegular,
  cocktail: IconCocktailRegular,
};

export const iconQuestions = [
  {
    question: "How would you describe your personality?",
    options: [
      { label: "A fast-paced, high-energy person", value: "lightning" },
      { label: "A thoughtful, methodical person", value: "academic" },
      { label: "An active, adventurous person", value: "bicycle-bike" },
      { label: "A kind, nurturing person", value: "angel" },
      { label: "A social, fun-loving person", value: "cocktail" },
    ],
  },
  {
    question: "What kind of activities do you enjoy most?",
    options: [
      { label: "Someone who loves challenges", value: "lightning" },
      { label: "Someone who loves reading and learning", value: "academic" },
      { label: "Someone who enjoys being outdoors", value: "bicycle-bike" },
      { label: "Someone who believes in helping others", value: "angel" },
      { label: "Someone who enjoys going out", value: "cocktail" },
    ],
  },
  {
    question: "Which phrase resonates the most with you?",
    options: [
      { label: "You like to take risks", value: "lightning" },
      { label: "You enjoy solving problems", value: "academic" },
      { label: "You value sustainability", value: "bicycle-bike" },
      { label: "You feel connected to something greater", value: "angel" },
      { label: "You like to relax with a drink", value: "cocktail" },
    ],
  },
  {
    question: "How would others describe your style?",
    options: [
      { label: "Bold and dynamic", value: "lightning" },
      { label: "Organized and structured", value: "academic" },
      { label: "Sporty and energetic", value: "bicycle-bike" },
      { label: "Spiritual and peaceful", value: "angel" },
      { label: "Charming and sophisticated", value: "cocktail" },
    ],
  },
  {
    question: "How do you prefer to spend your free time?",
    options: [
      { label: "Prefer excitement over relaxation", value: "lightning" },
      { label: "Calm and reflective", value: "academic" },
      { label: "Appreciates freedom and movement", value: "bicycle-bike" },
      { label: "Loves to give guidance and support", value: "angel" },
      { label: "Vibrant social settings", value: "cocktail" },
    ],
  },
];

export const componentQuestions = [
  {
    question: "How would you describe your personality?",
    options: [
      {
        label: "I'm spontaneous and love a good adventure!",
        value: "Button",
      },
      {
        label: "I’m thoughtful and enjoy a good plan before acting.",
        value: "Card",
      },
      {
        label: "I like to stay calm, composed, and organized.",
        value: "Timer",
      },
      {
        label: "I tend to analyze situations carefully before diving in.",
        value: "Rating",
      },
      {
        label:
          "I’m the life of the party and love leading others with my energy!",
        value: "Hero",
      },
    ],
  },
  {
    question: "What do you like to do in your free time?",
    options: [
      {
        label: "I love to try new hobbies and dive into something spontaneous.",
        value: "Button",
      },
      {
        label: "I enjoy relaxing with a good book or a movie binge.",
        value: "Card",
      },
      {
        label:
          "I’m all about staying active—whether it’s sports or outdoor adventures.",
        value: "Timer",
      },
      {
        label:
          "I love doing something creative like painting, writing, or crafting.",
        value: "Rating",
      },
      {
        label:
          "I’m always up for hanging out with friends and organizing fun get-togethers.",
        value: "Hero",
      },
    ],
  },
  {
    question: "How do you usually unwind after a busy day?",
    options: [
      {
        label: "I hit the gym or go for a run to clear my mind.",
        value: "Button",
      },
      {
        label: "I like to sink into a good book or watch my favorite shows.",
        value: "Card",
      },
      {
        label:
          "I prefer to relax by planning my next adventure or learning something new.",
        value: "Timer",
      },
      {
        label:
          "I’ll grab a coffee and enjoy a deep conversation with a friend.",
        value: "Rating",
      },
      {
        label: "I throw on some music and let loose in my own little world.",
        value: "Hero",
      },
    ],
  },
  {
    question: "What type of music do you enjoy the most?",
    options: [
      {
        label: "I love upbeat, high-energy tracks that get me moving.",
        value: "Button",
      },
      {
        label: "I’m a fan of chill vibes, acoustic sounds, or lo-fi beats.",
        value: "Card",
      },
      {
        label: "I enjoy listening to classic hits or timeless rock and roll.",
        value: "Timer",
      },
      {
        label:
          "I appreciate music that has meaningful lyrics or a story to tell.",
        value: "Rating",
      },
      {
        label:
          "I’m always discovering new genres and sounds from around the world.",
        value: "Hero",
      },
    ],
  },
  {
    question: "How do you like to spend your weekends?",
    options: [
      {
        label:
          "I prefer spontaneous adventures—whether it’s a road trip or a new activity.",
        value: "Button",
      },
      {
        label:
          "I like to plan something relaxing, like a quiet weekend at home.",
        value: "Card",
      },
      {
        label:
          "I make sure to stay productive, even if it’s just a little weekend project.",
        value: "Timer",
      },
      {
        label: "I love catching up with friends or family over the weekend.",
        value: "Rating",
      },
      {
        label:
          "I spend the weekend unwinding and recharging for the week ahead.",
        value: "Hero",
      },
    ],
  },
  {
    question: "Which of these best describes your sense of humor?",
    options: [
      {
        label: "I love quick wit and sarcasm that keeps people on their toes.",
        value: "Button",
      },
      {
        label: "I enjoy clever wordplay and dry humor.",
        value: "Card",
      },
      {
        label: "I’m all about puns and dad jokes.",
        value: "Timer",
      },
      {
        label: "I appreciate humor that is more subtle and situational.",
        value: "Rating",
      },
      {
        label:
          "I’m the type to make everyone laugh with exaggerated gestures and impressions.",
        value: "Hero",
      },
    ],
  },
  {
    question: "If you were to describe your ideal vacation, it would be:",
    options: [
      {
        label:
          "An adventurous trip with hiking, exploring, and discovering new places.",
        value: "Button",
      },
      {
        label:
          "A peaceful retreat with beautiful views and plenty of downtime.",
        value: "Card",
      },
      {
        label: "A busy city break with lots of culture, food, and activities.",
        value: "Timer",
      },
      {
        label:
          "A luxury getaway where relaxation and pampering are top priorities.",
        value: "Rating",
      },
      {
        label:
          "A volunteer trip where I can make a difference while exploring.",
        value: "Hero",
      },
    ],
  },
];

export const componentAssets = {
  Button:
    "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/buttons",
  Card: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/cards",
  Timer:
    "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/timer",
  Rating:
    "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/rating",
  Hero: "https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/hero",
};

export const GuessWhat = ({ quizType, questions }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill("")); // Store answers dynamically based on the number of questions
  const [finalResult, setFinalResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index

  const quizName = `Guess what ${quizType} you are`;

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
      value: null, // Not yet calculated until submission
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
        score[option.value] = 0; // Initialize score for each possible icon
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
      (maxValue, value) => (score[value] > score[maxValue] ? value : maxValue),
      Object.keys(score)[0] // Default to the first key if no score
    );

    setFinalResult(maxScoreIcon);

    // Save the final result to localStorage
    const savedQuizzes = JSON.parse(localStorage.getItem("quizData")) || {};
    savedQuizzes[quizName] = {
      answers,
      value: maxScoreIcon,
      completed: true,
      currentQuestionIndex: currentQuestionIndex,
    };
    localStorage.setItem("quizData", JSON.stringify(savedQuizzes));
  };

  const FinalIcon = iconAssets[finalResult];
  const finalLink = componentAssets[finalResult];

  return (
    <ContentWrapper>
      {!finalResult && (
        <>
          <QuizProgress
            current={currentQuestionIndex + 1}
            total={questions.length}
          />

          <form onSubmit={(e) => e.preventDefault()}>
            <Stack space={24}>
              {/* Display only the current question */}
              <div key={currentQuestionIndex}>
                <Stack space={64}>
                  <Text5>{questions[currentQuestionIndex].question}</Text5>
                  <div style={{ textAlign: "initial" }}>
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
                              radioValue={option.value}
                            ></BoxedRow>
                          )
                        )}
                      </BoxedRowList>
                    </RadioGroup>
                  </div>
                </Stack>
              </div>
            </Stack>
          </form>
        </>
      )}

      {/* Show final result */}
      {finalResult && (
        <div style={{ textAlign: "center" }}>
          <Stack space={16}>
            <Text5>Your {quizType} is</Text5>
            {quizType === "icon" && (
              <DecorationPatty size={128} stroke="0.75">
                {FinalIcon && (
                  <FinalIcon size={64} color={skinVars.colors.brand} />
                )}{" "}
              </DecorationPatty>
            )}

            <Text size={28} weight="bold">
              {finalResult}
            </Text>
            {quizType === "component" && (
              <TextLink href={finalLink}>
                {" "}
                See {finalResult} documentation
              </TextLink>
            )}
            {/* Dynamically render the icon */}
            <Text5>
              Based on your answers this is the {quizType} that best represents
              you.
            </Text5>
          </Stack>
        </div>
      )}
    </ContentWrapper>
  );
};
