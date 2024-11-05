import {
    Text10,
    Text4,
    Text3
} from "@telefonica/mistica";
import './wordle.css';
import React, { useState, useEffect } from "react";

const words = ["tokens"];
const chosenWord = words[0].toLowerCase();

const WordleGame = () => {
  const [currentAttempt, setCurrentAttempt] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");
  const maxAttempts = 10;
  const [score, setScore] = useState(0); // Track the score
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "enter" && !gameOver) {
        checkWord();
      } else if (key === "backspace") {
        setCurrentAttempt((prev) => prev.slice(0, -1));
      } else if (/^[a-z]$/.test(key) && currentAttempt.length < chosenWord.length && !gameOver) {
        setCurrentAttempt((prev) => [...prev, key]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentAttempt, gameOver]);

  const checkWord = () => {
    const input = currentAttempt.join("").toLowerCase(); // Convertir a minúsculas para comparar
    if (input.length !== chosenWord.length) {
      setMessage(`La palabra debe tener ${chosenWord.length} letras.`);
      return;
    }

    if (input !== chosenWord) {
            setAttempts((prev) => [...prev, input]);
    }
    setCurrentAttempt([]); // Reiniciar cada intento nuevo que haces

    if (input === chosenWord) {
      const points = calculateScore(attempts.length + 1);
      setScore(points);
      setMessage(`¡WHAAAT A MASTER OF WORDLE! ${chosenWord.toUpperCase()} was the hidden word ;)`);
      setGameOver(true);
      return;
    } else {
      if (attempts.length + 1 === maxAttempts) {
        setMessage(`Too many opportunities :(. The hidden word was: ${chosenWord.toUpperCase()}`);
        setGameOver(true);
        return;
      }
    }
  };

  const calculateScore = (attemptCount) => {
    return Math.max(0, 100 - (attemptCount - 1) * 10); // Score logic: 100 points max, subtract 20 for each attempt over the first
  };

  const getLetterStatus = (letter, index, input) => {
    const letterCount = {}; // Contador de letras de la palabra
    for (const char of chosenWord) {
      letterCount[char] = (letterCount[char] || 0) + 1;
    }

    //inicializar wrong
    const status = Array(input.length).fill('wrong');

    input.split('').forEach((char, i) => {
      if (char === chosenWord[i]) {
        status[i] = 'correct';
        letterCount[char] -= 1;
      }
    });

    input.split('').forEach((char, i) => {
      if (status[i] === 'wrong' && letterCount[char] > 0) {
        status[i] = 'partial';
        letterCount[char] -= 1; //para evitar duplicados
      }
    });

    return status[index];
  };

  return (
    <div className="wordle-game">
      <div className="left-column">
        <Text10>Wordle</Text10>
        <Text4>Instructions</Text4>
        <Text3>
        A crucial word has disappeared from Mística, and it's up to you to find it! <br />
        Each guess brings you closer to restoring order. Type your attempts, hit 'Enter,' and let the letters reveal their secrets. <br />
        Can you uncover the missing word and bring balance back to Mística? <br /><br />
        </Text3>
        <p>
  In the game, colors guide your guesses:<br />
  - <span style={{ color: 'gray' }}>Gray</span> means the letter is not in the word.<br />
  - <span style={{ color: '#FFD700' }}>Yellow</span> indicates the letter is in the word but in the wrong position.<br />
  - <span style={{ color: 'green' }}>Green</span> shows that the letter is correct and in the right spot.<br />
  Use these clues wisely to solve the mystery!
</p>
    <Text3>Score: {score}</Text3>
        {message && <p>{message}</p>}
      </div>
      <div className="right-column">
        <div className="word-grid">
          {attempts.map((attempt, rowIndex) => (
            <div key={rowIndex} className="letter-boxes">
              {attempt.split("").map((letter, index) => (
                <div key={index} className={`letter-box ${getLetterStatus(letter, index, attempt)}`}>
                  {letter.toUpperCase()} {/* Mostrar letras en mayúsculas */}
                </div>
              ))}
            </div>
          ))}
          {gameOver ? (
            <div className="letter-boxes">
              {chosenWord.split("").map((letter, index) => (
                <div key={index} className={`letter-box correct`}>
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          ) : (
            <div className="letter-boxes">
              {currentAttempt.map((letter, index) => (
                <div key={index} className="letter-box">{letter.toUpperCase()}</div>
              ))}
              {Array(chosenWord.length - currentAttempt.length)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="letter-box"></div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordleGame;
