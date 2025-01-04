import React, { useState, useEffect } from 'react';
import './Board.css';
import Cell from './Cell';

const emojiMap = {
    '#FFD700': '🥤',  // Amarelo - Plástico
    '#4CAF50': '🫙',  // Verde - Vidro
    '#2196F3': '📦',  // Azul - Papel
    '#000000': '🔋',  // Preto - Pilhas
    '#808080': '🗑️'   // Cinza - Lixo
};

const targetItems = {
    '#4CAF50': 'Vidro',
    '#2196F3': 'Plástico',
    '#FF0000': 'Papel',
    '#000000': 'Pilhas',
    '#808080': 'Lixo'  
};



const levelTargets = ['#4CAF50', '#2196F3', '#FF0000', '#000000', '#808080'];  

const getRandomTarget = (currentTarget) => {
    let newTarget;
    do {
        newTarget = levelTargets[Math.floor(Math.random() * levelTargets.length)];
    } while (newTarget === currentTarget);  // Evita repetir o mesmo alvo consecutivamente
    return newTarget;
};


const Board = ({ score, setScore, target, setTarget, setTimeRemaining, timerRunning, setTimerRunning, level, setLevel, gameStarted, setGameStarted }) => {

    const size = 10;
    const colors = Object.keys(emojiMap);
    const [board, setBoard] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [time, setTime] = useState(60);
    const [showLevelMessage, setShowLevelMessage] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [explodingCells, setExplodingCells] = useState(new Set());

    useEffect(() => {
        generateValidBoard();
    }, []);

    useEffect(() => {
        if (timerRunning) {
            const timer = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setTimerRunning(false);
                        showLevelCompleteMessage();
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timerRunning]);

    useEffect(() => {
        setTime(60);
        setTimerRunning(true);
        generateValidBoard();
        const nextTarget = getRandomTarget(target);  
        setTarget(nextTarget);  
    }, [level]);

    const generateValidBoard = () => {
        let newBoard;
        let validBoard = false;

        while (!validBoard) {
            newBoard = Array.from({ length: size * size }, () => {
                const color = colors[Math.floor(Math.random() * colors.length)];
                return {
                    color: color,
                    emoji: emojiMap[color],
                    id: Math.random()
                };
            });

            if (!checkForMatches(newBoard, true)) {
                validBoard = true;
            }
        }

        setBoard(newBoard);
    };

    
    const checkForMatches = (boardToCheck, preventExplosion = false) => {
        const width = size;
        let matches = new Set();
        let matchFound = false;
    
        // Verifica combinações horizontais
        for (let i = 0; i < 100; i++) {
            if (i % width <= width - 4) {
                const rowSet = [i, i + 1, i + 2, i + 3];
                if (rowSet.every(index => boardToCheck[index]?.color === boardToCheck[i]?.color)) {
                    rowSet.forEach(index => matches.add(index));
                    matchFound = true;
                }
            }
        }
    
        // Verifica combinações verticais
        for (let i = 0; i < 70; i++) {
            const colSet = [i, i + width, i + width * 2, i + width * 3];
            if (colSet.every(index => boardToCheck[index]?.color === boardToCheck[i]?.color)) {
                colSet.forEach(index => matches.add(index));
                matchFound = true;
            }
        }
    
        // Verifica diagonais (\)
        for (let i = 0; i < 70; i++) {
            if (i % width <= width - 4) {
                const diagSet1 = [i, i + width + 1, i + 2 * (width + 1), i + 3 * (width + 1)];
                if (diagSet1.every(index => boardToCheck[index]?.color === boardToCheck[i]?.color)) {
                    diagSet1.forEach(index => matches.add(index));
                    matchFound = true;
                }
            }
        }
    
        // Verifica diagonais (/)
        for (let i = 0; i < 70; i++) {
            if (i % width >= 3) {
                const diagSet2 = [i, i + width - 1, i + 2 * (width - 1), i + 3 * (width - 1)];
                if (diagSet2.every(index => boardToCheck[index]?.color === boardToCheck[i]?.color)) {
                    diagSet2.forEach(index => matches.add(index));
                    matchFound = true;
                }
            }
        }
    
        if (matchFound && !preventExplosion) {
            explodeMatches(matches, boardToCheck);  // Passa o tabuleiro para verificação de cores
        }
    
        return matchFound;
    };
        
    const explodeMatches = (matches, currentBoard = board) => {
        let targetCount = 0;
        matches.forEach(index => {
            if (currentBoard[index] && currentBoard[index].color === target) {
                targetCount++;
            }
        });
    
        // Pontuação com base nas explosões antes de alterar o tabuleiro
        if (targetCount === 4) {
            setScore((prev) => prev + 10);
        } else if (targetCount === 5) {
            setScore((prev) => prev + 20);
        } else if (targetCount >= 6) {
            setScore((prev) => prev + 50);
        }
    
        // Explosão visual (células desaparecem)
        setExplodingCells((prev) => {
            const newSet = new Set(prev);
            matches.forEach(idx => newSet.add(idx));
            return newSet;
        });
    
        setTimeout(() => {
            let newBoard = [...currentBoard];
            let exploded = false;
    
            matches.forEach(index => {
                if (newBoard[index]) {
                    exploded = true;
                    newBoard[index] = {
                        color: '',
                        emoji: '',
                        id: Math.random()
                    };
                }
            });
    
            setBoard([...newBoard]);  // Atualiza o tabuleiro com as bolinhas removidas
            setExplodingCells(new Set());
    
            // Regenera o tabuleiro após explosões
            if (exploded) {
                setTimeout(() => {
                    generateValidBoard();  // Força a regeneração completa do tabuleiro
                }, 300);
            }
        }, 300);
    };
    
    const showLevelCompleteMessage = () => {
        setShowLevelMessage(true);
        setTimeout(() => {
            setShowLevelMessage(false);
            handleLevelAdvance();
            setTimerRunning(true);
        }, 3000);
    };
    
    const handleLevelAdvance = () => {
        if (level < 10) {
            const nextLevel = level + 1;
            setLevel(nextLevel);
            setTarget(getRandomTarget());
            setTimeRemaining(60);  // Reinicia o cronômetro
            setTimerRunning(true);  // Reinicia o temporizador
        } else {
            alert('Parabéns! Terminaste todos os níveis.');
            setGameStarted(false);
        }
    };

    
    const swapCells = (index1, index2) => {
        const newBoard = [...board];
        const temp = { ...newBoard[index1] };
        newBoard[index1] = { ...newBoard[index2] };
        newBoard[index2] = temp;
        setBoard(newBoard);
    
        // Após a troca, verifica combinações e executa explosões, mesmo que haja apenas 3 antes da troca
        setTimeout(() => {
            let matchFound = checkForMatches(newBoard);
    
            // Se houver combinação após a troca, processa as explosões normalmente
            if (matchFound) {
                explodeMatches(newBoard);
            } else {
                // Caso contrário, mantém a troca mesmo sem combinação
                setBoard([...newBoard]);
            }
        }, 200);
    };
         
    const selectCell = (index) => {
        if (selectedCell === null) {
            setSelectedCell(index);
        } else {
            // Permite troca se for adjacente, horizontal, vertical ou diagonal
            if (isAdjacent(selectedCell, index)) {
                swapCells(selectedCell, index);
            }
            setSelectedCell(null);  // Limpa a seleção após a troca
        }
    };
    

    const isAdjacent = (index1, index2) => {
        const row1 = Math.floor(index1 / size);
        const col1 = index1 % size;
        const row2 = Math.floor(index2 / size);
        const col2 = index2 % size;
    
        return (
            (Math.abs(row1 - row2) === 1 && Math.abs(col1 - col2) === 0) ||  // Vertical
            (Math.abs(row1 - row2) === 0 && Math.abs(col1 - col2) === 1) ||  // Horizontal
            (Math.abs(row1 - row2) === 1 && Math.abs(col1 - col2) === 1)     // Diagonal
        );
    };
    
    return (
        <div className="board-container">
            {showLevelMessage ? (
                <div className="level-complete-message">
                    <h1>Nível Concluído!</h1>
                </div>
            ) : (
                <>
                    <div className="info-panel">
                        <h1 className="no-cursor">Pontuação: {score}</h1>     
                        <p className="no-cursor">Nível: {level}</p>
                        <p className="no-cursor">Alvo: {targetItems[target]}</p>
                        <p className="no-cursor">Tempo restante: {time}s</p>
                    </div>
                    <div className="board">
                        {board.map((cell, index) => (
                            <Cell
                                key={cell.id}
                                color={cell.color}
                                emoji={cell.emoji}
                                isSelected={selectedCell === index}
                                isExploding={explodingCells.has(index)}
                                onClick={() => selectCell(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
    
};

export default Board;
