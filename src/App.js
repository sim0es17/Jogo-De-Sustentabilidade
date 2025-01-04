import React, { useState } from 'react';
import Board from './components/Board';
import './App.css';

function App() {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [target, setTarget] = useState('#4CAF50');  // Começa com Vidro
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [gameStarted, setGameStarted] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);

    const targetColors = ['#4CAF50', '#2196F3', '#FFD700', '#000000', '#808080'];  // Verde, Azul, Amarelo, Preto, Cinza

    const getRandomTarget = () => {
        const randomIndex = Math.floor(Math.random() * targetColors.length);
        return targetColors[randomIndex];
    };

    const handleStart = () => {
        setGameStarted(true);
        setScore(0);
        setLevel(1);
        setTarget(getRandomTarget());  // Define o alvo inicial aleatório
        setTimeRemaining(60);
        setTimerRunning(true);
    };

    const handleLevelAdvance = () => {
        if (level < 10) {
            const nextLevel = level + 1;
            setLevel(nextLevel);
            setTarget(getRandomTarget());  // Define novo alvo aleatório a cada nível
            setTimeRemaining(60);  // Reinicia o cronômetro para 60 segundos
            setTimerRunning(true);  // Reinicia o temporizador
        } else {
            alert('Parabéns! Terminaste todos os níveis.');
            setGameStarted(false);
        }
    };

    return (
        <div className="app-container">
            {!gameStarted ? (
                <div className="start-screen">
                    <h1>Jogo de Sustentabilidade</h1>
                    <button onClick={handleStart}>Começar Jogo</button>
                </div>
            ) : (
                <div className="game-container">
                    <Board
                        score={score}
                        setScore={setScore}
                        target={target}
                        setTarget={setTarget}
                        level={level}
                        setLevel={setLevel}
                        timeRemaining={timeRemaining}
                        setTimeRemaining={setTimeRemaining}
                        timerRunning={timerRunning}
                        setTimerRunning={setTimerRunning}
                        handleLevelAdvance={handleLevelAdvance}
                        setGameStarted={setGameStarted}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
