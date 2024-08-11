import React from 'react';

const CraftButton = ({ ingredientName, onCraft }) => {

    return (
        <div>
            <button 
                onClick={() => onCraft(ingredientName)}>
                Craft
            </button>
        </div>
    );
};

export default CraftButton;