import React from 'react';

const OreButton = ({ oreName, onIncrement }) => {

    return (
        <div style={{ margin: '10px' }}>
            <button 
                onClick={() => onIncrement(oreName)}>
                Get {oreName}
            </button>
        </div>
    );
};

export default OreButton;