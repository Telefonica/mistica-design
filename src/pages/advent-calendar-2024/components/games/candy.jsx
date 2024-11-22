// CandyCrush.jsx
import { ButtonPrimary, Text, Stack, Align } from "@telefonica/mistica";
import { useScreenSize } from "@telefonica/mistica";
import Score from "../score";
import React, { useState, useEffect } from "react";
import blau from "../../../../img/games/blau.svg";
import movistar from "../../../../img/games/movistar.svg";
import o2 from "../../../../img/games/o2.svg";
import telefonica from "../../../../img/games/telefonica.svg";
import tu from "../../../../img/games/tu.svg";
import vivo from "../../../../img/games/vivo.svg";
import "./candy.css";

const CandyCrush = ({ onFinish }) => {
  const { isMobile } = useScreenSize();
  const width = 8;
  const candyColors = [movistar, tu, vivo, blau, telefonica, o2];
  const maxMoves = 10;

  const [squares, setSquares] = useState([]);
  const [score, setScore] = useState(0);
  const [movesRemaining, setMovesRemaining] = useState(maxMoves);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [invalidMove, setInvalidMove] = useState(null);
  const [status, setStatus] = useState("playing");

  const handleGameEnd = () => {
    if (onFinish) onFinish();
  };

  useEffect(() => {
    if (movesRemaining === 0) {
      document.querySelector(".grid").classList.add("locked");
      setStatus("gameover");
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

    return () => clearInterval(intervalId);
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
      if (newSquares[i + width] === undefined || newSquares[i + width] === "") {
        newSquares[i + width] = newSquares[i];
        newSquares[i] = "";
      }
    }
    for (let i = 0; i < width; i++) {
      if (newSquares[i] === "") {
        const randomColor = Math.floor(Math.random() * candyColors.length);
        newSquares[i] = candyColors[randomColor];
      }
    }
    setSquares(newSquares);
  }

  function animateAndClear(squaresToClear) {
    let newSquares = [...squares];
    squaresToClear.forEach((index) => {
      newSquares[index] = "";
    });
    setSquares(newSquares);
  }

  function checkMatches() {
    if (movesRemaining <= 9) {
      checkRowForFour();
      checkColumnForFour();
      checkRowForThree();
      checkColumnForThree();
    }
  }

  function checkRowForFour() {
    for (let i = 0; i < 63; i++) {
      if (i % width > width - 4) continue;
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = squares[i];
      const isBlank = decidedColor === "";

      if (
        rowOfFour.every((index) => squares[index] === decidedColor) &&
        !isBlank
      ) {
        setScore((prevScore) => prevScore + 4);
        animateAndClear(rowOfFour);
      }
    }
  }

  function checkColumnForFour() {
    for (let i = 0; i < 47; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = squares[i];
      const isBlank = decidedColor === "";

      if (
        columnOfFour.every((index) => squares[index] === decidedColor) &&
        !isBlank
      ) {
        setScore((prevScore) => prevScore + 4);
        animateAndClear(columnOfFour);
      }
    }
  }

  function checkRowForThree() {
    for (let i = 0; i < 64; i++) {
      if (i % width > width - 3) continue;
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = squares[i];
      const isBlank = decidedColor === "";

      if (
        rowOfThree.every((index) => squares[index] === decidedColor) &&
        !isBlank
      ) {
        setScore((prevScore) => prevScore + 3);
        animateAndClear(rowOfThree);
      }
    }
  }

  function checkColumnForThree() {
    for (let i = 0; i < 48; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = squares[i];
      const isBlank = decidedColor === "";

      if (
        columnOfThree.every((index) => squares[index] === decidedColor) &&
        !isBlank
      ) {
        setScore((prevScore) => prevScore + 3);
        animateAndClear(columnOfThree);
      }
    }
  }

  const swapCandies = (startIndex, endIndex) => {
    if (movesRemaining === 0) return;
    
    const isAdjacent = Math.abs(startIndex - endIndex) === 1 || Math.abs(startIndex - endIndex) === width;
    const isSameRow = Math.floor(startIndex / width) === Math.floor(endIndex / width);
    const isValidVertical = Math.abs(startIndex - endIndex) === width;
    
    if (isAdjacent && (isSameRow || isValidVertical)) {
      let newSquares = [...squares];
      let temp = newSquares[endIndex];
      newSquares[endIndex] = newSquares[startIndex];
      newSquares[startIndex] = temp;
      setSquares(newSquares);
      setMovesRemaining(prev => prev - 1);
      setInvalidMove(null);
      setSelectedIndex(null);
    } else {
      setInvalidMove(startIndex);
      setSelectedIndex(null);
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    }
  };

  const handleDragStart = (e, index) => {
    if (movesRemaining === 0 || isMobile) return;
    setDraggingIndex(index);
    e.dataTransfer.setData("draggedIndex", index);
  };

  const handleDrop = (e, index) => {
    if (movesRemaining === 0 || isMobile) return;
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    swapCandies(draggedIndex, index);
    setDraggingIndex(null);
  };

  const handleDragOver = (e) => {
    if (!isMobile) e.preventDefault();
  };

  const handleMobileClick = (index) => {
    if (movesRemaining === 0 || !isMobile) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      swapCandies(selectedIndex, index);
    }
  };

  return (
    <div className="candy-crush">
      {status === "playing" ? (
        <div className="right-column">
          <div className={`grid ${isMobile ? 'mobile-grid' : ''}`}>
            {squares.map((color, index) => (
              <div
                key={index}
                id={index}
                className={`square 
                  ${draggingIndex === index ? "dragging" : ""} 
                  ${selectedIndex === index ? "selected" : ""} 
                  ${invalidMove === index ? "invalid-move" : ""}
                  ${isMobile ? 'mobile-square' : ''}
                `}
                style={{ backgroundImage: `url(${color})` }}
                {...(!isMobile && {
                  draggable: true,
                  onDragStart: (e) => handleDragStart(e, index),
                  onDragOver: handleDragOver,
                  onDrop: (e) => handleDrop(e, index),
                })}
                {...(isMobile && {
                  onClick: () => handleMobileClick(index),
                })}
              ></div>
            ))}
          </div>
          <div style={{ 
            position: "absolute", 
            left: isMobile ? 16 : 48, 
            top: isMobile ? 32 : 64, 
            zIndex: 1 
          }}>
            <Score score={`${score}`} movements={`${movesRemaining}`} />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Align y="center" x="center">
            <Stack space={isMobile ? 16 : 24}>
              <Stack space={isMobile ? 12 : 16}>
                <Score score={score} isFinal />
                <Text size={isMobile ? 24 : 32} weight="medium">
                  Congratulations! You completed the game!
                </Text>
              </Stack>
              <ButtonPrimary onPress={handleGameEnd}>Back home</ButtonPrimary>
            </Stack>
          </Align>
        </div>
      )}
    </div>
  );
};

export default CandyCrush;
