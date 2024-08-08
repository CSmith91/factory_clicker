import React from 'react';

const OreButton = ({ oreName, onIncrement }) => {

    return (
        <div style={{ margin: '10px' }}>
            <button 
                onClick={() => onIncrement(oreName)} 
                style={{ padding: '10px', fontSize: '16px' }}>
                Get {oreName}
            </button>
        </div>
    );
};

export default OreButton;