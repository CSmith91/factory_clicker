import React, { useState } from "react"
import stoneFurnace from './Images/stone_furnace.png'

const MachineOnSite = ({ itemName, machineName, handleMachineChange, onAlert }) => {
   
    const getMachineImage  = (machineName) => {
        switch (machineName) {
            case 'Stone Furnace':
                return stoneFurnace;
            default:
                return null
        }
    } 
    const machineImg = getMachineImage(machineName);

    const [counter, setCounter] = useState(0) // initialises state

    const onMachineChange = (action) => {
        handleMachineChange(action, machineName).then((result) =>{
            if (result) {
                setCounter(prevCounter => {
                    if (action === 'increment') {
                        setInputMax(prev => {
                            return prev + 10
                        })
                        return prevCounter + 1;
                    } else if (action === 'decrement') {
                        setInputMax(prev => {
                            return prev - 10
                        })
                        // Ensure the counter doesn't go below zero or any other condition you want to check
                        return prevCounter > 0 ? prevCounter - 1 : prevCounter;
                    } else {
                        return prevCounter;
                    }
                });
            }
            else if (!result && action === 'increment') {
                onAlert(`You need to craft more ${machineName}s`)
            }
        })
    };

    const [currentInput, setCurrentInput] = useState(0);
    const [inputMax, setInputMax] = useState(0);

    return(
        <>
        <div className="machineButtons">
            <p style={{padding: '5px'}}>{machineName}s for {itemName}:</p>
            <button onClick={() => onMachineChange('decrement')}>
                {"<"}
            </button>
            <p style={{padding: '5px'}}>{counter}</p>
            <button onClick={() => onMachineChange('increment')}>
                {">"}
            </button>
        </div>
        {/* Conditionally render the div if counter > 0 */}
        {counter > 0 && (
        <div>
            <div style={{marginBottom: "5%"}}>
                <button>{"Add " + itemName}</button>
            </div>
            <div className="machine-div">
                {machineImg && <img src={machineImg} alt={`${machineName} Image`} style={{ width: '32px', height: 'auto' }} />}
                <div className="machine-inputs">
                    <p>{itemName}: {currentInput} / {inputMax}</p>
                </div>
            </div>
        </div>
         )}
        </>
    )
}

export default MachineOnSite