import React from "react"

const Research = ({ ores, ingredients, onUnlock, unlockables }) => {
    return (
        <>
            <h2>Research</h2>
            {Object.keys(unlockables)
                .filter(itemName => !unlockables[itemName]?.unlocked) // Filter out already unlocked items
                .map(itemName => {
                    const cost = unlockables[itemName].cost;

                    // Check if the user has enough resources for this unlockable item
                    const canUnlock = Object.entries(cost).every(([item, quantity]) => {
                        const oreCount = ores[item]?.count || 0;
                        const ingredientCount = ingredients[item]?.count || 0;
                        return (oreCount + ingredientCount) >= quantity;
                    });

                    return (
                        <div key={itemName+'div'}>
                            {unlockables[itemName].isVisible && (
                            <div key={itemName} style={{ margin: '10px' }}>
                                <button
                                    onClick={() => onUnlock(itemName)}
                                    disabled={!canUnlock}
                                    style={{ padding: '10px', borderRadius: '10px', margin: '5px', backgroundColor: canUnlock ? 'lightgreen' : 'lightcoral' }}>
                                    <b>{unlockables[itemName].title}</b>
                                    <br />
                                    {unlockables[itemName].desc}
                                    <br />
                                    {canUnlock ? `Use ${Object.entries(cost).map(([item, quantity]) => `${quantity} ${item}`).join(', ')}` : `(Requires ${Object.entries(cost).map(([item, quantity]) => `${quantity} ${item}`).join(', ')})`}
                                </button>
                            </div>
                            )}
                        </div>
                    );
                })}
        </>
    );
};


export default Research