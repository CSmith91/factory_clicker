import React from "react";
import MachineOnSite from "./MachineOnSite";

const Furnaces = ({ ores, oreName, ingredients }) => {

    const itemName = oreName
    const furnaceableItem = ores[oreName] ? ores[oreName] : ingredients[oreName]

    // Find all items that are furnaces (isFurnace: true)
    const furnaces = Object.entries(ingredients)
        .filter(([_, ingData]) => ingData.isFurnace);

    return(
        <>
            {furnaces.map(([furnaceName, furnaceData]) => (
                    // Conditional check: render only if both the furnace and item are unlocked
                    furnaceData.unlocked && furnaceableItem.unlocked && (
                        <div key={`${furnaceName}-${itemName}`}>
                            <p>{furnaceName}s for {itemName}:</p>
                            <MachineOnSite furnaces={furnaces} />
                        </div>
                    )
                ))}
        </>
    )

}

export default Furnaces