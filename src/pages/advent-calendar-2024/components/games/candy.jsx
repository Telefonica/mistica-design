import {
  Text10,
  Text4,
  Text3,
  Text9
} from "@telefonica/mistica";
import React, { useState, useEffect } from 'react';
import blau from '../../../../img/games/blau.svg';
import movistar from '../../../../img/games/movistar.svg';
import o2 from '../../../../img/games/o2.svg';
import telefonica from '../../../../img/games/telefonica.svg';
import tu from '../../../../img/games/tu.svg';
import vivo from '../../../../img/games/vivo.svg';
import './candy.css';

const CandyCrush = () => {
  const width = 8;
  const candyColors = [movistar, tu, vivo, blau, telefonica, o2];
  const maxMoves = 10;

  const [squares, setSquares] = useState([]);
  const [score, setScore] = useState(0);
  const [movesRemaining, setMovesRemaining] = useState(maxMoves);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [invalidMove, setInvalidMove] = useState(null); // Estado para identificar si un movimiento es inválido
  
  useEffect(() => {
    if (movesRemaining === 0) {
      document.querySelector('.grid').classList.add('locked'); // Bloquea la cuadrícula
    }
  }, [movesRemaining]);
  
  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      moveDown();
      checkMatches();
    }, 100);

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, [squares]);

  function createBoard() {
    const initialSquares = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = Math.floor(Math.random() * candyColors.length);
      initialSquares.push(candyColors[randomColor]);
    }
    setSquares(initialSquares);
  }

  function moveDown() {
    let newSquares = [...squares];
    for (let i = width * (width - 1) - 1; i >= 0; i--) {
      if (newSquares[i + width] === undefined || newSquares[i + width] === '') {
        newSquares[i + width] = newSquares[i];
        newSquares[i] = '';
      }
    }
    for (let i = 0; i < width; i++) {
      if (newSquares[i] === '') {
        const randomColor = Math.floor(Math.random() * candyColors.length);
        newSquares[i] = candyColors[randomColor];
      }
    }
    setSquares(newSquares);
  }

  function animateAndClear(squaresToClear) {
    let newSquares = [...squares];
    squaresToClear.forEach(index => {
      newSquares[index] = '';
    });
    setSquares(newSquares);
  }

  function checkMatches() {
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
  }

  function checkRowForFour() {
    for (let i = 0; i < 63; i++) {
      if (i % width > width - 4) continue;
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = squares[i];
      const isBlank = decidedColor === '';

      if (rowOfFour.every(index => squares[index] === decidedColor) && !isBlank) {
        setScore(prevScore => prevScore + 4);
        animateAndClear(rowOfFour);
      }
    }
  }

  function checkColumnForFour() {
    for (let i = 0; i < 47; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = squares[i];
      const isBlank = decidedColor === '';

      if (columnOfFour.every(index => squares[index] === decidedColor) && !isBlank) {
        setScore(prevScore => prevScore + 4);
        animateAndClear(columnOfFour);
      }
    }
  }

  function checkRowForThree() {
    for (let i = 0; i < 64; i++) {
      if (i % width > width - 3) continue;
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = squares[i];
      const isBlank = decidedColor === '';

      if (rowOfThree.every(index => squares[index] === decidedColor) && !isBlank) {
        setScore(prevScore => prevScore + 3);
        animateAndClear(rowOfThree);
      }
    }
  }

  function checkColumnForThree() {
    for (let i = 0; i < 48; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = squares[i];
      const isBlank = decidedColor === '';

      if (columnOfThree.every(index => squares[index] === decidedColor) && !isBlank) {
        setScore(prevScore => prevScore + 3);
        animateAndClear(columnOfThree);
      }
    }
  }

  const handleDragStart = (e, index) => {
    if (movesRemaining === 0) return; // Bloquea el drag si no hay movimientos restantes
    setDraggingIndex(index);
    e.dataTransfer.setData('draggedIndex', index);
  };
  
  // const handleDrop = (e, index) => {
  //   if (movesRemaining === 0) return; // Bloquea el drop si no hay movimientos restantes
  //   const draggedIndex = e.dataTransfer.getData('draggedIndex');
    
  //   let newSquares = [...squares];
  //   let temp = newSquares[index];
  //   newSquares[index] = newSquares[draggedIndex];
  //   newSquares[draggedIndex] = temp;
    
  //   setSquares(newSquares);
  //   setMovesRemaining(prev => prev - 1);
  // };


  const handleDrop = (e, index) => {
    if (movesRemaining === 0) return;
    const draggedIndex = e.dataTransfer.getData('draggedIndex');
    const isAdjacent = Math.abs(draggedIndex - index) === 1 || Math.abs(draggedIndex - index) === width;

    if (isAdjacent) {
      let newSquares = [...squares];
      let temp = newSquares[index];
      newSquares[index] = newSquares[draggedIndex];
      newSquares[draggedIndex] = temp;
      setSquares(newSquares);
      setMovesRemaining(prev => prev - 1);
      setInvalidMove(null);  // Reset el estado de movimiento inválido
      setDraggingIndex(null);
    } else {
      setInvalidMove(draggedIndex); // Activamos el movimiento inválido

      setDraggingIndex(null); // Limpiamos el estado de "draggingIndex"
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="candy-crush">
      <div className="left-column">
        <Text10>Candy Crush</Text10>
        <p>Instructions: Try to match Telefonica brands of the same type in a row or column of 3!</p>
        <p id="score">Score: {score}</p>
      </div>
      <div className="right-column">
        <div className="grid">
          {squares.map((color, index) => (
            <div
              key={index}
              id={index}
              className={`square ${draggingIndex === index ? 'dragging' : ''} ${invalidMove === index ? 'invalid-move' : ''}`} // Aplica shake a la imagen arrastrada si el movimiento es inválido
              style={{ backgroundImage: `url(${color})` }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            ></div>
          ))}
        </div>
        <p id="timer">{movesRemaining} moves</p>
      </div>
    </div>
  );
};

export default CandyCrush;



