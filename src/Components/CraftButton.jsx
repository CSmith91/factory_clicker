import React, { useState } from 'react';

const CraftButton = ({ ingredients, ingredientName, checkCraft, isAnimating }) => {

    const craftTime = ingredients[ingredientName].craftTime;

    return (
        <div>
            <button 
                onClick={() => checkCraft(ingredientName, craftTime)}
                className={`mine-button ${isAnimating ? 'animating' : ''}`}
                disabled={isAnimating}
                style={{ '--craft-time': `${craftTime}s` }}>
                Craft
            </button>
        </div>
    );
};

export default CraftButton;