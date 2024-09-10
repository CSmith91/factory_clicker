import React, { useState } from 'react';

const OreButton = ({ ores, oreName, siteCounts, pendingMachineOutput, setPendingMachineOutput, updateSiteCounts, getStorage }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const craftTime = ores[oreName].craftTime;

    const handleClick = () => {

        // check the bank isn't full
        if(siteCounts[oreName]){
            if(siteCounts[oreName] + pendingMachineOutput[oreName] >= getStorage(oreName)){
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
        // Update the pending output
        setPendingMachineOutput(prevPending => ({
            ...prevPending,
            [oreName]: (prevPending[oreName] || 0) + 1
        }));

        // Delay the execution of updateSiteCounts
        setTimeout(() => {
            updateSiteCounts(oreName, 1, 'manual');

            setPendingMachineOutput(prevPending => ({
                ...prevPending,
                [oreName]: (prevPending[oreName] || 0)- 1
            }));

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