import React, { useState } from "react"
import MachineAddButton from "./MachineAddButton"
import stoneFurnace from './Images/stone_furnace.png'
import steelFurnace from './Images/steel_furnace.png'

const MachineOnSite = ({ itemName, machineName, ores, ingredients, setOres, setIngredients, fuels, handleMachineChange, onAlert }) => {
   
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
                    acc[fuelName] = { current: 0 };
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
                            [itemName]: {
                                ...machineStates[machineName]?.[itemName],
                                inputMax: newCounter * 10,
                                currentInput: machineStates[machineName]?.[itemName]?.currentInput || 0,
                                fuels: fuelsArray.reduce((acc, [fuelName]) => {
                                    acc[fuelName] = { current: 0 }; // Initialize or reset fuel state
                                    return acc;
                                }, {})
                            }
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

    // Adding ore and ingredients to a machine
    const addItem = (item) => {
        // Determine if item is ore or ingredient
        const isOre = ores[item] ? true : false;
        const itemData = isOre ? ores[item] : ingredients[item];

        // Find the machine state for the specific machineName and itemName
        const chosenMachineState = machineStates[machineName]?.[itemName];

        console.log("Chosen machine state: ", chosenMachineState);

        if (chosenMachineState.inputMax <= 0) {
            console.log("inputMax is 0 or not correctly set");
        }

        if (itemData.count < 1) {
            onAlert(`Not enough ${item}`);
        } else {
            // Check if the current input or fuel is not exceeding the inputMax
            const canAddMore = chosenMachineState && (
                (item === itemName && chosenMachineState.currentInput < chosenMachineState.inputMax) ||
                (chosenMachineState.fuels[item] && chosenMachineState.fuels[item].current < chosenMachineState.inputMax)
            );
            if (canAddMore) {
                if (item === itemName) {
                    // Update the current input if the item is the main input item
                    setMachineStates(prevState => ({
                        ...prevState,
                        [machineName]: {
                            ...prevState[machineName],
                            [itemName]: {
                                ...prevState[machineName][itemName],
                                currentInput: prevState[machineName][itemName].currentInput + 1
                            }
                        }
                    }));
                } else if (chosenMachineState.fuels[item]) {
                    // Update the fuel count if the item is a fuel
                    setMachineStates(prevState => ({
                        ...prevState,
                        [machineName]: {
                            ...prevState[machineName],
                            [itemName]: {
                                ...prevState[machineName][itemName],
                                fuels: {
                                    ...prevState[machineName][itemName].fuels,
                                    [item]: {
                                        current: prevState[machineName][itemName].fuels[item].current + 1
                                    }
                                }
                            }
                        }
                    }));
                }

                // Reduce the item count in ores or ingredients
                if (isOre) {
                    setOres(prevOres => ({
                        ...prevOres,
                        [item]: {
                            ...prevOres[item],
                            count: prevOres[item].count - 1
                        }
                    }));
                } else {
                    setIngredients(prevIngs => ({
                        ...prevIngs,
                        [item]: {
                            ...prevIngs[item],
                            count: prevIngs[item].count - 1
                        }
                    }));
                }
            } else {
                onAlert(`Cannot add more ${item}, limit reached.`);
            }
        }
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
                        <MachineAddButton machineName={machineName} itemName={itemName} addItem={addItem} handleMachineChange={handleMachineChange} onAlert={onAlert} />               
                        {machineParent.isBurner && fuelsArray.map(([fuelName, fuelData]) =>
                            fuelData.unlocked && (
                                <div key={`${machineName}-${itemName}-${fuelName}`}>
                                    <MachineAddButton machineName={machineName} itemName={itemName} fuelName={fuelName} addItem={addItem} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="machine-div" style={{marginBottom: "5%"}}>
                    {machineImg && <img src={machineImg} alt={`${machineName} Image`} style={{ width: '32px', height: 'auto' }} />}
                    <div className="machine-inputs">
                        <p>{itemName}: {currentMachineState[itemName].currentInput} / {currentMachineState[itemName].inputMax || 0}</p>
                        {machineParent.isBurner && fuelsArray.map(([fuelName, fuelData]) => {
                            const fuelState = currentMachineState[itemName].fuels?.[fuelName] || {}; // Default to empty object
                            return fuelData.unlocked && fuelState && (
                                <p key={`${fuelName}-${machineName}`}>
                                    {fuelName}: {fuelState.current || 0} / {currentMachineState[itemName].inputMax || 0}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </>
        )}
        </>
    )
}

export default MachineOnSite