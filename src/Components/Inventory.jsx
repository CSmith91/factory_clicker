import React from 'react';

const Inventory = ({ ores }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '45%' }}>
            <h2>Inventory</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ores).map(([oreName, oreData]) => (
                    <li key={oreName} style={{ marginBottom: '10px' }}>
                        {oreName}: {oreData.count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inventory;
