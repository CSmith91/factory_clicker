import React from 'react';

const CraftButton = ({ ingredientName, checkCraft, isBus }) => {

    const buttonText = isBus ? "Build" : "Craft";

    return (
        <div>
            <button 
                onClick={() => checkCraft(ingredientName)}>
                {buttonText}
            </button>
        </div>
    );
};

export default CraftButton;