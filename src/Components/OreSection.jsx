import React from 'react';
import OreButton from './OreButton';

const OreSection = ({ ores, ingredients, onIncrement, handleMachineChange, onAlert }) => {

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
                            {/* THIS WILL BE FOR DRILLS, so replace .canFurnace with .canDrill! */}
                            {/* {oreData.canFurnace ? (
                                <Machines ores={ores} oreName={oreName} ingredients={ingredients} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                                ) : (<></>)} */}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default OreSection;