import React from 'react';

function Interface({ startGame }) {
    return (
        <div className="start-screen">
            <h1>Jogo de Sustentabilidade</h1>
            <button id="startButton" onClick={startGame}>Começar Jogo</button>
        </div>
    );
}

export default Interface;
