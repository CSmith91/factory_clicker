import React from 'react';
import OreButton from './OreButton';

const OreSection = ({ ores, onIncrement }) => {

    return (
        <>
            <div>
                <h2>Resources</h2>
                    {Object.entries(ores)
                        .filter(([_, oreData]) => oreData.unlocked && oreData.canHandMine)
                        .map(([oreName]) => (
                            <OreButton key={oreName} oreName={oreName} onIncrement={onIncrement} />
                        ))}
            </div>
        </>
    );
};

export default OreSection;