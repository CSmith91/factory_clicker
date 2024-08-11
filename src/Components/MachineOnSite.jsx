import React, { useState } from "react"

const onMachineChange = (action, setCounter) => {
    setCounter(prevCounter => {
        if (action === 'increment') {
            return prevCounter + 1;
        } else if (action === 'decrement') {
            // Ensure the counter doesn't go below zero or any other condition you want to check
            return prevCounter > 0 ? prevCounter - 1 : prevCounter;
        } else {
            return prevCounter;
        }
    });
}

const MachineOnSite = ({ furnaces }) => {
    const [counter, setCounter] = useState(0) // initialises state

    return(
        <div className="machineButtons">
            <button onClick={() => onMachineChange('decrement', setCounter)}>
                {"<"}
            </button>
            <p style={{padding: '5px'}}>{counter}</p>
            <button onClick={() => onMachineChange('increment', setCounter)}>
                {">"}
            </button>
        </div>
    )
}

export default MachineOnSite