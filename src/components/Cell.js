import React from 'react';
import './Cell.css';

const Cell = ({ color, emoji, isSelected, isExploding, onClick }) => {
    return (
        <div
            className={`cell ${isSelected ? 'selected' : ''} ${isExploding ? 'exploding' : ''}`}
            onClick={onClick}
            style={{ backgroundColor: color }}
        >
            {emoji}
        </div>
    );
};

export default Cell;
