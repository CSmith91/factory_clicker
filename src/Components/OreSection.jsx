import React from 'react';
import OreButton from './OreButton';
import Furnaces from './Furnaces';

const OreSection = ({ ores, ingredients, onIncrement }) => {

    return (
        <>
            <div>
                <h2>Resource Patches</h2>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked)
                    .map(([oreName, oreData]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{oreName}</h3>
                            {oreData.canHandMine ? (
                                <OreButton key={oreName} oreName={oreName} onIncrement={onIncrement} /> 
                                ) : (<></>)}
                            {oreData.patch !== undefined ? (
                                <p>{oreName} patch remaining: {oreData.patch.size}</p> 
                            ) : (
                                <p>{oreName} harvested: {oreData.harvested}</p> 
                            )}
                            {oreData.canFurnace ? (
                                <Furnaces ores={ores} oreName={oreName} ingredients={ingredients} />
                                ) : (<></>)}
                        </div>
                    ))}
                <h2>Advanced Resources</h2>
                {Object.entries(ingredients)
                    .filter(([_, oreData]) => oreData.unlocked && oreData.canFurnace)
                    .map(([oreName, oreData]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{oreName}</h3>
                            <Furnaces ores={ores} oreName={oreName} ingredients={ingredients} />
                        </div>
                    ))}
            </div>
        </>
    );
};

export default OreSection;