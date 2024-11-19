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
import './memory.css';
import { saveScore } from "../../utils/score-manager";

const initialCards = [
    blau, blau,
    movistar, movistar,
    o2, o2,
    telefonica, telefonica,
    tu, tu,
    vivo, vivo,
    vivo, vivo,
    vivo, vivo,
    vivo, vivo
];

const MemoryGame = () => {
    const timeLimit = 60; // Tiempo en segundos
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [score, setScore] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);
    const [gameEnded, setGameEnded] = useState(false); // Para controlar cuando termina
    const [revealedCards, setRevealedCards] = useState([]); // Cartas reveladas

    // Función para barajar las cartas
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Efecto para iniciar el juego
    useEffect(() => {
        setCards(shuffle([...initialCards]));
    }, []);

    // Efecto para manejar el temporizador
    useEffect(() => {
        if (timerStarted && timeRemaining > 0 && !gameEnded) {
            const timerId = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timeRemaining === 0 && !gameEnded) {
            setGameEnded(true);
        }
    }, [timerStarted, timeRemaining, gameEnded]);

    useEffect(() => {
        if (gameEnded) {
            saveScore(score); // Guarda el score final en localStorage
        }
    }, [gameEnded, score]);

    const startTimer = () => {
        setTimerStarted(true);
    };

    const flipCard = (index) => {
        if (gameEnded || revealedCards.includes(index)) return; // Evitar interacciones si el juego ha terminado o si la carta ya ha sido revelada

        if (flippedCards.length === 0 && !timerStarted) {
            startTimer(); // Inicia el temporizador al girar la primera carta
        }

        if (flippedCards.length < 2) {
            const newFlippedCards = [...flippedCards, index];
            setFlippedCards(newFlippedCards);

            if (newFlippedCards.length === 2) {
                setTimeout(() => checkForMatch(newFlippedCards), 500);
            }
        }
    };

    const checkForMatch = (newFlippedCards) => {
        const [firstCardIndex, secondCardIndex] = newFlippedCards;

        if (cards[firstCardIndex] === cards[secondCardIndex]) {
            setMatchedPairs(prev => prev + 1);
            const scoreToAdd = Math.max(0, timeRemaining);
            setScore(prev => prev + scoreToAdd); // Sumar tiempo restante a la puntuación

            // Añadir índices de cartas reveladas a la lista de cartas reveladas
            setRevealedCards(prev => [...prev, firstCardIndex, secondCardIndex]);
            setFlippedCards([]); // Reiniciar cartas volteadas
        } else {
            setTimeout(() => {
                setFlippedCards([]); // Reiniciar cartas volteadas si no hay coincidencia
            }, 500);
        }

        // Verificar si se han encontrado todos los pares
        if (matchedPairs + 1 === cards.length / 2) {
            setGameEnded(true); // Terminar el juego si se encuentran todos los pares
        }
    };

    return (
        <div className="memory-game">
            <div className="left-column">
                <Text10>Memory Cards</Text10>
                <Text4>Instructions</Text4>
                <Text3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
                    aliquip ex ea commodo consequat. Excepteur sint occaecat 
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text3>
                <Text9 id="score">Score: {score}</Text9>
                {gameEnded && <p>Congratulations! Your final score is: {score}</p>}
            </div>
            <div className="right-column">
                <div className="card-grid">
                    {cards.map((imageUrl, index) => (
                        <div
                        key={index}
                        className={`card ${flippedCards.includes(index) || revealedCards.includes(index) ? "flipped" : ""} ${gameEnded ? "disabled" : ""}`}
                        onClick={() => flipCard(index)}
                        >
                            {(flippedCards.includes(index) || revealedCards.includes(index)) ? (
                                <img src={imageUrl} alt="Card" style={{ display: "block" }} />
                            ) : (
                                <div className="card-back"></div>
                            )}
                        </div>
                    ))}
                </div>
                <p id="timer">{timeRemaining} s</p>
            </div>
        </div>
    );
};

export default MemoryGame;
