import React from 'react';
import OreButton from './OreButton';

const OreSection = ({ ores, onIncrement }) => {

    return (
        <>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h2>Ore Patches</h2>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.canHandMine)
                    .map(([oreName]) => (
                        <OreButton key={oreName} oreName={oreName} onIncrement={onIncrement} />
                    ))}
            </div>
        </>
    );
};

export default OreSection;