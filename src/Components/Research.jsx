import React from "react"

const Research = ({ ores, onUnlock, researchItems}) => {
    return (
        <>
            <h2>Research</h2>
            {Object.keys(researchItems)
                .filter(oreName => !ores[oreName]?.unlocked) // Filter out already unlocked ores
                .map(researchItem => {
                const cost = researchItems[researchItem].cost;

                // Check if the user has enough resources for this research item
                const canUnlock = Object.entries(cost).every(([item, quantity]) => (ores[item]?.count || 0) >= quantity);


                return (
                    <div key={researchItem} style={{ margin: '10px' }}>
                        <button 
                            onClick={() => onUnlock(researchItem)}
                            disabled={!canUnlock}
                            style={{ padding: '10px', margin: '5px', backgroundColor: canUnlock ? 'lightgreen' : 'lightcoral' }}>
                            {canUnlock ? `Unlock ${researchItem}` : `Requires ${Object.entries(cost).map(([item, quantity]) => `${quantity} ${item}`).join(', ')}`}
                        </button>
                    </div>
                );
            })}
        </>
    );
}

export default Research