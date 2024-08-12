import React from 'react';
import OreButton from './OreButton';
import Machines from './Machines';

const OreSection = ({ ores, ingredients, onIncrement, handleMachineChange, onAlert }) => {

    const getOutput = (oreName) => {
        switch (oreName) {
            case 'Stone':
                return 'Brick';
            case 'Iron Ore':
                return 'Iron Plate';
            case 'Copper Ore':
                return 'Copper Plate';
            case 'Iron Plate':
                return 'Steel';
            default:
                return null
        }
    }

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
                <h2>Smelting</h2>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <Machines ores={ores} oreName={oreName} ingredients={ingredients} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    ))}
                {Object.entries(ingredients)
                    .filter(([_, oreData]) => oreData.unlocked && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <Machines ores={ores} oreName={oreName} ingredients={ingredients} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    ))}
            </div>
        </>
    );
};

export default OreSection;