import React, { useState } from 'react';

const OreButton = ({ ores, oreName, updateOutputCount }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        const craftTime = ores[oreName].craftTime;

        // Start the animation
        setIsAnimating(true);

        // Delay the execution of updateOutputCount
        setTimeout(() => {
            updateOutputCount(oreName, 'manual');

            // End the animation
            setIsAnimating(false);
        }, craftTime * 1000);
    };

    return (
        <div style={{ margin: '10px', position: 'relative' }}>
            <button 
                onClick={handleClick}
                className={`mine-button ${isAnimating ? 'animating' : ''}`}
                disabled={isAnimating}>
                Get {oreName}
            </button>
        </div>
    );
};

export default OreButton;