import {
  Text7
} from "@telefonica/mistica";
import React, { useState, useEffect } from 'react';
import '../components/quiz.css';
import { saveScore, updatePoints } from '../utils/score-manager'; // Importar las funciones de score-manager

const QuizView = ({ questionTitle, options, correctAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  // carga el score al principio
  useEffect(() => {
    const storedTotalScore = parseInt(localStorage.getItem("totalScore"), 10) || 0;
    setScore(storedTotalScore);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsAnswered(true);
    const answerIsCorrect = option === correctAnswer;
    setIsCorrect(answerIsCorrect);

    if (answerIsCorrect) {
      const newScore = score + 100;
      setScore(newScore);
      saveScore(100);
    }

    updatePoints();
  };

  // guarda el final al terminar
  useEffect(() => {
    const totalScore = parseInt(localStorage.getItem("totalScore"), 10);
    setScore(totalScore);
  }, [score]);

  return (
    <div className="quiz">
      <Text7>{questionTitle}</Text7>
      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`option ${isAnswered && option === correctAnswer ? 'correct' : ''} ${isAnswered && option === selectedOption && option !== correctAnswer ? 'incorrect' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="feedback">
          {isCorrect ? 'Ding Ding Ding, Correct!' : 'Incorrect answer'}
        </div>
      )}
      <div className="score">Score: {score}</div>
    </div>
  );
};

export default QuizView;

