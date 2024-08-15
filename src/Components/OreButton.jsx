import React, { useState } from 'react';

const OreButton = ({ ores, oreName, outputCounts, updateOutputCount, getStorage }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const craftTime = ores[oreName].craftTime;

    const handleClick = () => {

        // check the bank isn't full
        if(outputCounts[oreName]){
            if(outputCounts[oreName] >= getStorage(oreName)){
                return;
            }
            else{
                startMine()
            }
        }
        else{
            startMine()
        }
    }

    const startMine = () => {
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
                disabled={isAnimating}
                style={{ '--craft-time': `${craftTime}s` }}>
                Get {oreName}
            </button>
        </div>
    );
};

export default OreButton;