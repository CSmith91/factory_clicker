import React from 'react';

const Inventory = ({ ores, ingredients }) => {
    return (
        <div>
            <h2>Inventory</h2>
            <h3>Production</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ingredients)
                    .filter(([_, ingredientData]) => ingredientData.unlocked && ingredientData.group === 'p4') // Check only unlocked
                    .map(([ingredientName, ingredientData]) => {
                        // Extract and format the cost
                        const costText = Object.entries(ingredientData.cost)
                        .map(([resource, amount]) => `${amount} ${resource}`)
                        .join(', ');

                        return(
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {ingredientData.isCraftable && <button>Craft</button>}
                            <li key={ingredientName} style={{marginLeft: '10px'}}>
                                {ingredientName} ({costText}): {ingredientData.count} <br/> Idle Count: {ingredientData.idleCount}
                            </li>
                        </div>
                        );
                    })}
            </ul>
            <h3>Intermediate Products</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked) // Check only unlocked
                    .map(([oreName, oreData]) => (
                        <li key={oreName}>{oreName}: {oreData.count}</li>
                    ))}
            </ul>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ingredients)
                    .filter(([_, ingredientData]) => ingredientData.unlocked && ingredientData.group === 'i5') // Check only unlocked
                    .map(([ingredientName, ingredientData]) => {
                        // Extract and format the cost
                        const costText = Object.entries(ingredientData.cost)
                        .map(([resource, amount]) => `${amount} ${resource}`)
                        .join(', ');

                        return(
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {ingredientData.isCraftable && <button>Craft</button>}
                                <li key={ingredientName} style={{marginLeft: '10px'}}>
                                    {ingredientName} ({costText}): {ingredientData.count}
                                </li>
                            </div>
                        );
                    })}
            </ul>
        </div>
    );
};

export default Inventory;
