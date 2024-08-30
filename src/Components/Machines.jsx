import React from "react";
import MachineOnSite from "./MachineOnSite";

const Machines = ({ unlockables, machineType, ores, oreName, ingredients,  setOres, setIngredients, storage, getStorage, pendingMachineOutput, setPendingMachineOutput, outputCounts, updateOutputCount, onAlert }) => {

    const itemName = oreName
    const workableItem = ores[oreName] ? ores[oreName] : ingredients[oreName]

    // Find all items that are furnaces (isFurnace: true)
    const furnaces = Object.entries(ingredients)
        .filter(([_, ingData]) => ingData.isFurnace);
    
    const drills = Object.entries(ingredients)
    .filter(([_, ingData]) => ingData.isDrill);

    const machines = machineType === "furnace" ? furnaces : drills 

    // this is for furnaces only
    const inputToOutput = (oreName) => {
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

    const output = machineType === "furnace" ? inputToOutput(oreName) : oreName;

    // Find all fuel items 
    const filterFuelItems = (items) => {
        return Object.entries(items)
            .filter(([_, itemData]) => itemData.fuelValue)
            .reduce((acc, [key, itemData]) => {
                acc[key] = itemData;
                return acc;
            }, {});
    };
    
    // Filter and combine fuels (both in ores and ingredients)
    const fuelOres = filterFuelItems(ores);
    const fuelIngredients = filterFuelItems(ingredients);
    const fuels = { ...fuelOres, ...fuelIngredients };

    return(
        <>
            {machines.map(([machineName, machineData]) => (
                    // Conditional check: render only if both the furnace and item are unlocked
                    machineData.unlocked && workableItem.unlocked && (
                        <div key={`${machineName}-${itemName}`}>
                            <MachineOnSite 
                                unlockables={unlockables}
                                itemName={itemName} 
                                output={output} 
                                machineName={machineName} 
                                ores={ores} 
                                ingredients={ingredients} 
                                setOres={setOres} 
                                setIngredients={setIngredients} 
                                storage={storage}
                                getStorage={getStorage}
                                fuels={fuels} 
                                pendingMachineOutput={pendingMachineOutput}
                                setPendingMachineOutput={setPendingMachineOutput}
                                outputCounts={outputCounts} 
                                updateOutputCount={updateOutputCount}
                                onAlert={onAlert} />
                        </div>
                    )
                ))}
        </>
    )

}

export default Machines