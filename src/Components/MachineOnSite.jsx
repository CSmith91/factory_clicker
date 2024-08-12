import React, { useState } from "react"
import FuelButton from "./FuelButton"
import stoneFurnace from './Images/stone_furnace.png'
import steelFurnace from './Images/steel_furnace.png'

const MachineOnSite = ({ itemName, machineName, ingredients, fuels, handleMachineChange, onAlert }) => {
   
    // counter of how many machines on site there are
    const [counter, setCounter] = useState(0) // initialises state

    // load image of machine
    const getMachineImage  = (machineName) => {
        switch (machineName) {
            case 'Stone Furnace':
                return stoneFurnace;
            case 'Steel Furnace':
                return steelFurnace;
            default:
                return null
        }
    } 
    const machineImg = getMachineImage(machineName);

    // State to hold all machine-related data
    const [machineStates, setMachineStates] = useState({
        [machineName]: {
            [itemName]: {
                currentInput: 0,
                inputMax: 0,
                fuels: Object.keys(fuels).reduce((acc, fuelName) => {
                    acc[fuelName] = { fuelCurrent: 0 };
                    return acc;
                }, {})
            }
        }
    });

    // shows the machines resource amounts
    const machineParent = ingredients[machineName]
    const currentMachineState = machineStates[machineName] || {}; // Getting the state of the current machine
    const fuelsArray = Object.entries(fuels);

    // handles changing the number of machines
    const onMachineChange = (action) => {
        handleMachineChange(action, machineName).then((result) =>{
            if (result) {
                setCounter(prevCounter => {
                    let newCounter = prevCounter;
                    if (action === 'increment') {
                        newCounter = prevCounter + 1;
                    } else if (action === 'decrement') {
                        newCounter = prevCounter > 0 ? prevCounter - 1 : prevCounter;
                    }

                    // Update machine states dynamically based on the new counter
                    const updatedMachineStates = {
                        ...machineStates,
                        [machineName]: {
                            ...machineStates[machineName],
                            inputMax: newCounter * 10, // example logic for inputMax
                            currentInput: machineStates[machineName]?.currentInput || 0,
                            fuels: fuelsArray.map(fuel => ({
                                name: fuel[0],
                                current: 0
                            }))
                        }
                    };

                    setMachineStates(updatedMachineStates);
                    return newCounter;
                });
            } else if (!result && action === 'increment') {
                onAlert(`You need to craft more ${machineName}s`);
            }
        })
    };

    return(
        <>
        <div className="machineButtons">
            <p style={{padding: '5px'}}>{machineName}s in use:</p>
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
            <>
                <div style={{marginBottom: "5%"}}>
                    <div style={{marginBottom: "5%"}} className="machine-input-buttons">
                        <button>{"Add " + itemName}</button>                
                        {machineParent.isBurner && fuelsArray.map(([fuelName, fuelData]) =>
                            fuelData.unlocked && (
                                <div key={`${machineName}-${itemName}-${fuelName}`}>
                                    <FuelButton fuelName={fuelName} />
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="machine-div" style={{marginBottom: "5%"}}>
                {machineImg && <img src={machineImg} alt={`${machineName} Image`} style={{ width: '32px', height: 'auto' }} />}
                <div className="machine-inputs">
                    <p>{itemName}: {currentMachineState.currentInput} / {currentMachineState.inputMax}</p>
                    {machineParent.isBurner && fuelsArray.map(([fuelName, fuelData]) => {
                        const fuelState = currentMachineState.fuels?.find(fuel => fuel.name === fuelName);
                        return fuelData.unlocked && fuelState && (
                            <p key={`${fuelName}-${machineName}`}>{fuelName}: {fuelState.current} / {currentMachineState.inputMax}</p>
                        )
                    })}
                </div>
            </div>
            </>
        )}
        </>
    )
}

export default MachineOnSite