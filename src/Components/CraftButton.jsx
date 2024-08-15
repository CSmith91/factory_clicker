import React, { useState } from 'react';

const CraftButton = ({ ingredientName, checkCraft }) => {

    return (
        <div>
            <button 
                onClick={() => checkCraft(ingredientName)}>
                Craft
            </button>
        </div>
    );
};

export default CraftButton;