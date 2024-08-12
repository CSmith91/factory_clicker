import React from "react";
import MachineOnSite from "./MachineOnSite";

const Machines = ({ ores, oreName, ingredients,  setOres, setIngredients, handleMachineChange, onAlert }) => {

    // currently setup only for furnaces

    const itemName = oreName
    const furnaceableItem = ores[oreName] ? ores[oreName] : ingredients[oreName]

    // Find all items that are furnaces (isFurnace: true)
    const furnaces = Object.entries(ingredients)
        .filter(([_, ingData]) => ingData.isFurnace);

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

    const output = inputToOutput(oreName)

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
            {furnaces.map(([furnaceName, furnaceData]) => (
                    // Conditional check: render only if both the furnace and item are unlocked
                    furnaceData.unlocked && furnaceableItem.unlocked && (
                        <div key={`${furnaceName}-${itemName}`}>
                            <MachineOnSite itemName={itemName} output={output} machineName={furnaceName} ores={ores} ingredients={ingredients} setOres={setOres} setIngredients={setIngredients} fuels={fuels} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    )
                ))}
        </>
    )

}

export default Machines