import React, { useState, useEffect } from "react";
import "./simon.css";

import { Text, Text3, Text4, ButtonPrimary, Stack, IconButton } from "@telefonica/mistica";


import sound1 from "../../../../img/games/1.mp3";
import sound2 from "../../../../img/games/2.mp3";
import sound3 from "../../../../img/games/3.mp3";
import sound4 from "../../../../img/games/4.mp3";

import Score from "../score";

import { saveGameData } from "../../utils/score-manager";
import { DecorationPatty } from "../../assets/decorations/decorations";

const colors = ["green", "red", "yellow", "blue"];

const MuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.4479 4.60191C12.7001 4.46154 12.9994 4.46434 13.246 4.61315C13.4954 4.76196 13.6423 5.02307 13.6423 5.31506V19.432C13.6423 19.7296 13.4843 20.002 13.2293 20.1451C13.1075 20.2153 12.9827 20.249 12.8387 20.249C12.6945 20.249 12.5532 20.2097 12.4257 20.1339L5.24009 16.0572H3.04532C2.60748 16.0572 2.25 15.695 2.25 15.2514V9.49845C2.25 9.0549 2.60748 8.69265 3.04532 8.69265H5.24009L12.4479 4.60191Z" fill="#031A34"/>
    <path d="M22.6162 9.75712L20.0335 12.3739L22.6162 14.9906C22.8296 15.2068 22.8296 15.5549 22.6162 15.7711C22.5109 15.8806 22.3696 15.934 22.231 15.934C22.0925 15.934 21.9511 15.8778 21.8458 15.7711L19.2631 13.1544L16.6804 15.7711C16.5751 15.8806 16.4338 15.934 16.2952 15.934C16.1566 15.934 16.0153 15.8778 15.91 15.7711C15.6967 15.5549 15.6967 15.2068 15.91 14.9906L18.4927 12.3739L15.91 9.75712C15.6967 9.54089 15.6967 9.19274 15.91 8.97659C16.1234 8.76037 16.4671 8.76037 16.6804 8.97659L19.2631 11.5933L21.8458 8.97659C22.0592 8.76037 22.4029 8.76037 22.6162 8.97659C22.8296 9.19274 22.8296 9.54089 22.6162 9.75712Z" fill="#031A34"/>
  </svg>
);

const UnmuteIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.2 4.23367C17.45 4.09367 17.75 4.09367 18 4.24367C18.25 4.39367 18.4 4.65367 18.4 4.94367V19.0637C18.4 19.3637 18.24 19.6337 17.99 19.7737C17.87 19.8437 17.74 19.8737 17.6 19.8737C17.46 19.8737 17.31 19.8337 17.19 19.7537L10 15.6737H7.8C7.36 15.6737 7 15.3137 7 14.8637V9.11367C7 8.67367 7.36 8.30367 7.8 8.30367H9.99L17.2 4.23367Z" fill="#031A34"/>
  </svg>
);


const SimonSays = ({ onFinish }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [score, setScore] = useState(0);
  const [highlight, setHighlight] = useState(null);
  const [message, setMessage] = useState('Press "Start" to begin');
  const [isGameOver, setIsGameOver] = useState(false);

  const [status, setStatus] = useState("playing");
  const [isMuted, setIsMuted] = useState(true);

  const gameName = "simonSays";

  const handleGameEnd = () => {
    if (onFinish) onFinish();
  };


  useEffect(() => {
    const gameScores = JSON.parse(localStorage.getItem("gameScores")) || {};
    const savedGame = gameScores[gameName];

    if (savedGame?.completed) {
      setScore(savedGame.score);

      setStatus("completed");

      setMessage("Game Completed!");
    }
  }, []);


  const toggleMute = () => {
    setIsMuted((prevState) => !prevState);
  };  

  let currentSound = null;


  function playSound(color) {
    if (isMuted) return;
  
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0;
    }

    let sound;
    switch (color) {

      case "green":
        sound = new Audio(sound1);
        break;
      case "red":
        sound = new Audio(sound2);
        break;
      case "yellow":
        sound = new Audio(sound3);
        break;
      case "blue":

        sound = new Audio(sound4);
        break;
      default:
        return;
    }

    sound.play();
    currentSound = sound;
  }

  useEffect(() => {
    if (
      isPlaying &&
      playerSequence.length === sequence.length &&
      playerSequence.length !== 0
    ) {
      checkPlayerSequence();
    }
  }, [playerSequence]);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setMessage("Follow the sequence!");
    setIsGameOver(false);
    setIsPlaying(true);

    setIsPlayerTurn(false);
    setStatus("playing");

    addColorToSequence();
  };

  const addColorToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prevSequence) => [...prevSequence, newColor]);
    playSequence([...sequence, newColor]);
  };

  function playSequence(sequence) {
    let i = 0;
    setIsPlayerTurn(false);
    const interval = setInterval(() => {
      setHighlight(sequence[i]);
      playSound(sequence[i]);
      i += 1;
      setTimeout(() => setHighlight(null), 500);
      if (i === sequence.length) {
        clearInterval(interval);

        setTimeout(() => setIsPlayerTurn(true), 500);

      }
    }, 800);
  }

  const handlePlayerInput = (color) => {
    if (!isPlayerTurn || highlight || isGameOver) return;

    setPlayerSequence((prevSequence) => {
      const newSequence = [...prevSequence, color];

      playSound(color);


      setHighlight(color);
      setTimeout(() => setHighlight(null), 500);

      if (
        newSequence[newSequence.length - 1] !== sequence[newSequence.length - 1]
      ) {
        setIsGameOver(true);
        setMessage("Game Over! You clicked the wrong color.");

        setStatus("completed");
        setIsPlaying(false);
        setIsPlayerTurn(false);
        saveGameData(gameName, score, isGameOver);

        return newSequence;
      }

      return newSequence;
    });
  };

  const checkPlayerSequence = () => {
    if (playerSequence.join("") === sequence.join("")) {
      setScore(score + 10);
      setPlayerSequence([]);
      setTimeout(() => setIsPlayerTurn(false), 500);
      setTimeout(() => {
        addColorToSequence();
      }, 1000);
    } else {
      setIsGameOver(true);
      setMessage("Game Over!");

      setStatus("completed");
      setIsPlayerTurn(false);
      saveGameData(gameName, score, isGameOver);

    }
  };

  useEffect(() => {

    if (isGameOver) {
      saveGameData(gameName, score, isGameOver);

    }
  }, [isGameOver]);

  return (
    <>

      <div style={{ position: "absolute", left: 48, top: 64 }}>
        <Score score={`${score}`} />
      </div>
      
      <div
        style={{
          position: "absolute",
          top: 48,
          right: 120,
          cursor: "pointer",
        }}
      >
        <IconButton
          type="neutral"
          backgroundType="soft"
          Icon={isMuted ? MuteIcon : UnmuteIcon}
          onPress={toggleMute}
        />

      </div>

      <div className="simon-game">
        {status === "playing" ? (
          <Stack space={16}>

            <div style={{ position: "relative" }}>
              <Text4>
                {!isPlaying 
                  ? "Press 'Start' to begin"
                  : !isPlayerTurn 
                    ? "Pay attention..." 
                    : "Your turn!"}
              </Text4>
            </div>

            <div className="simon-board">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`color ${color} ${
                    highlight === color ? "highlight" : ""
                  } ${isGameOver ? "gameover" : ""}`}
                  onClick={() => handlePlayerInput(color)}

                  style={{ pointerEvents: isGameOver || !isPlayerTurn ? "none" : "auto" }}

                />
              ))}
            </div>
            {!isPlaying && !isGameOver && status === "playing" && (
              <ButtonPrimary
                onPress={(e) => {
                  e.preventDefault();
                  startGame();
                }}
              >
                Start
              </ButtonPrimary>
            )}
          </Stack>
        ) : (
          <Stack space={24}>
            <Stack space={16}>
              <DecorationPatty text={`${score}`}></DecorationPatty>
              <Text3>Your final score</Text3>
              <Text size={32} weight="medium">
                Congratulations! You completed the game!
              </Text>
            </Stack>
            <ButtonPrimary onPress={handleGameEnd}>Back home</ButtonPrimary>
          </Stack>
        )}
      </div>
    </>
  );
};

export default SimonSays;