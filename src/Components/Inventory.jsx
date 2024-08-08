import React from 'react';

const Inventory = ({ ores }) => {
    return (
        <div>
            <h2>Inventory</h2>
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
