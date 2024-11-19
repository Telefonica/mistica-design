import React, { useState, useEffect } from 'react';
import './simon.css';
import { Text10, Text4, Text3, ButtonPrimary } from '@telefonica/mistica';

// Sonidos importados
import sound1 from '../../../../img/games/1.mp3';
import sound2 from '../../../../img/games/2.mp3';
import sound3 from '../../../../img/games/3.mp3';
import sound4 from '../../../../img/games/4.mp3';

const colors = ['purple', 'blue', 'lightblue', 'black'];

function SimonSays() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highlight, setHighlight] = useState(null);
  const [message, setMessage] = useState('Press "Start" to begin');
  const [isGameOver, setIsGameOver] = useState(false);
  let currentSound = null; // Variable global para almacenar el sonido actual

  function playSound(color) {
    // Si ya hay un sonido reproducido, detenerlo
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0; // Reiniciar el tiempo del sonido
    }
  
    let sound;
    switch (color) {
      case 'purple':
        sound = new Audio(sound1);
        break;
      case 'blue':
        sound = new Audio(sound2);
        break;
      case 'lightblue':
        sound = new Audio(sound3);
        break;
      case 'black':
        sound = new Audio(sound4);
        break;
      default:
        return;
    }
  
    sound.play();
    currentSound = sound; // Actualizamos la referencia al sonido actual
  }
  
  useEffect(() => {
    if (isPlaying && playerSequence.length === sequence.length && playerSequence.length !== 0) {
      checkPlayerSequence();
    }
  }, [playerSequence]);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setMessage('Follow the sequence!');
    setIsGameOver(false);
    setIsPlaying(true);
    addColorToSequence();
  };

  const addColorToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prevSequence) => [...prevSequence, newColor]);
    playSequence([...sequence, newColor]);
  };

  function playSequence(sequence) {
    let i = 0;
    const interval = setInterval(() => {
      setHighlight(sequence[i]);
      playSound(sequence[i]); // Reproducir sonido
      i += 1;
      setTimeout(() => setHighlight(null), 500); // Reset highlight after sequence
      if (i === sequence.length) {
        clearInterval(interval);
    }
    }, 800);
  }

  const handlePlayerInput = (color) => {
    if (!isPlaying || highlight || isGameOver) return;

    setPlayerSequence((prevSequence) => {
      const newSequence = [...prevSequence, color];
      playSound(color);  // Reproducir sonido al hacer clic

      // Añadir animación específica al clic
      setHighlight(color);
      setTimeout(() => setHighlight(null), 500); // Reset highlight after click

      if (newSequence[newSequence.length - 1] !== sequence[newSequence.length - 1]) {
        setIsGameOver(true);
        setMessage('Game Over! You clicked the wrong color.');
        setIsPlaying(false);
        return newSequence;
      }

      return newSequence;
    });
  };

  const checkPlayerSequence = () => {
    if (playerSequence.join('') === sequence.join('')) {
      setScore(score + 10);
      setPlayerSequence([]);
      setTimeout(() => {
        addColorToSequence(); 
      }, 1000);
    } else {
      setIsPlaying(false);
      setMessage('Game Over!');
    }
  };

  return (
    <div className="simon-game">
      <div className="left-column">
        <Text10>Simon Says</Text10>
        <Text4>Instructions</Text4>
        <Text3>
          Press Start to begin! Follow a sequence of flashing colors, and repeat it back by pressing the buttons in the same order. <br />
          Each round, the sequence grows, testing how far you can go before you lose track. <br /><br />
        </Text3>
        <p>{message}</p>
        <Text3>Score: {score}</Text3>
      </div>
      <div className="right-column">
        <div className="simon-board">
          {colors.map((color) => (
            <div
              key={color}
              className={`color ${color} ${highlight === color ? 'highlight' : ''} ${isGameOver ? 'gameover' : ''}`}
              onClick={() => handlePlayerInput(color)}
              style={{ pointerEvents: isGameOver ? 'none' : 'auto' }}
            />
          ))}
            </div>
        {!isPlaying && !isGameOver && (
          <ButtonPrimary onPress={(e) => {
            e.preventDefault();
            startGame();
          }}>
            Start
          </ButtonPrimary>
        )}
      </div>
      {/* Falta añadir un toggle para encender o apagar el sonido y un textito del nivel en el que estás */}
    </div>
  );
}

export default SimonSays;
