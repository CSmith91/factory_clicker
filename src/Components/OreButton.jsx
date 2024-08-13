import React from 'react';

const OreButton = ({ oreName, updateOutputCount }) => {

    return (
        <div style={{ margin: '10px' }}>
            <button 
                onClick={() => updateOutputCount(oreName, 'manual')}>
                Get {oreName}
            </button>
        </div>
    );
};

export default OreButton;