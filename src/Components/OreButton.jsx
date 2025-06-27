import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incrementSiteCount, incrementPendingOutput } from '../app/features/sites/sitesSlice';
import { useStorageHelpers } from '../hooks/useStorageHelpers';

const OreButton = ({ oreName }) => {
    const dispatch = useDispatch();
    const ores = useSelector(state => state.ores);
    const siteCounts = useSelector(state => state.sites.siteCounts);
    const pendingMachineOutput = useSelector(state => state.sites.pendingMachineOutput);
    const { getStorage } = useStorageHelpers();

    const [isAnimating, setIsAnimating] = useState(false);
    const craftTime = ores[oreName].craftTime;

    const handleClick = () => {
        const banked = siteCounts[oreName] || 0;
        const pending = pendingMachineOutput[oreName] || 0;
        const storageLimit = getStorage(oreName);

        if (banked + pending >= storageLimit) return;
        startMine();
    };

    const startMine = () => {
        setIsAnimating(true);

        // Add pending output
        dispatch(incrementPendingOutput({ itemName: oreName, amount: 1 }));

        // Delay the execution of adding to site count
        setTimeout(() => {
            dispatch(incrementSiteCount({ itemName: oreName, amount: 1 }));

            // Remove the pending output
            dispatch(incrementPendingOutput({ itemName: oreName, amount: -1 }));

            setIsAnimating(false);
        }, craftTime * 1000);
    };

    return (
        <div style={{ margin: '10px', position: 'relative' }}>
            <button
                onClick={handleClick}
                className={`mine-button ${isAnimating ? 'animating' : ''}`}
                disabled={isAnimating}
                style={{ '--craft-time': `${craftTime}s` }}
            >
                Get {oreName}
            </button>
        </div>
    );
};

export default OreButton;
