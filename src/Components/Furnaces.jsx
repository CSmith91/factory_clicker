import React from "react";
import Machines from "./Machines";

const Furnaces = ({ ores, ingredients,  setOres, setIngredients,  handleMachineChange, onAlert }) => {

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

    return(
        <>
        <h2>Furnaces</h2>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <Machines ores={ores} oreName={oreName} ingredients={ingredients} setOres={setOres} setIngredients={setIngredients} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    ))}
                {Object.entries(ingredients)
                    .filter(([_, oreData]) => oreData.unlocked && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <Machines ores={ores} oreName={oreName} ingredients={ingredients} setOres={setOres} setIngredients={setIngredients} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    ))}
        </>
    )
}

export default Furnaces