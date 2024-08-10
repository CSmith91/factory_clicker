import React from 'react';
import OreButton from './OreButton';

const OreSection = ({ ores, onIncrement }) => {

    return (
        <>
            <div>
                <h2>Resource Patches</h2>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked)
                    .map(([oreName, oreData]) => (
                        <div key={oreName+"HarvestDiv"}>
                            {oreData.canHandMine ? (
                                <OreButton key={oreName} oreName={oreName} onIncrement={onIncrement} /> 
                                ) : (<></>)}
                            {oreData.patch !== undefined ? (
                                <p>{oreName} patch remaining: {oreData.patch.size}</p> 
                            ) : (
                                <p>{oreName} harvested: {oreData.harvested}</p> 
                            )}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default OreSection;