import React from 'react';

const Inventory = ({ ores, ingredients }) => {
    return (
        <div>
            <h2>Inventory</h2>
            <h3>Production</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ingredients)
                    .filter(([_, ingredientData]) => ingredientData.unlocked && ingredientData.group == 'p4') // Check only unlocked
                    .map(([ingredientName, ingredientData]) => (
                        <li key={ingredientName}>{ingredientName}: {ingredientData.count} ----- Idle Count: {ingredientData.idleCount}</li>
                    ))}
            </ul>
            <h3>Intermediate Products</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked) // Check only unlocked
                    .map(([oreName, oreData]) => (
                        <li key={oreName}>{oreName}: {oreData.count}</li>
                    ))}
            </ul>
        </div>
    );
};

export default Inventory;
