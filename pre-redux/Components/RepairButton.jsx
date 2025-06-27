import React from 'react';

const RepairButton = ({ tools, toolName, onRepair }) => {

    const tool = tools[toolName];

    // Extract and format the cost
    const costText = Object.entries(tool.cost)
        .map(([resource, amount]) => `${amount} ${resource}`)
        .join(', ');

    return (
        <div style={{ margin: '10px' }}>
            <button 
                onClick={() => onRepair(toolName)}>
                Repair {toolName} ({costText})
            </button>
        </div>
    );
};

export default RepairButton;