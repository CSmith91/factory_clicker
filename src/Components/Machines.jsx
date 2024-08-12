import React from "react";
import MachineOnSite from "./MachineOnSite";

const Machines = ({ ores, oreName, ingredients, handleMachineChange, onAlert }) => {

    // currently setup only for furnaces

    const itemName = oreName
    const furnaceableItem = ores[oreName] ? ores[oreName] : ingredients[oreName]

    // Find all items that are furnaces (isFurnace: true)
    const furnaces = Object.entries(ingredients)
        .filter(([_, ingData]) => ingData.isFurnace);

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
                            <MachineOnSite itemName={itemName} machineName={furnaceName} fuels={fuels} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    )
                ))}
        </>
    )

}

export default Machines