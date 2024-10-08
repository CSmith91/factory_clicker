import React, { useState, useEffect } from "react"
import MachineAddButton from "./MachineAddButton"
import Inserters from "./Inserters";
import images from './Images/images';

const MachineOnSite = ({ 
    unlockables, 
    itemName, 
    output, 
    machineName, 
    ores, 
    ingredients, 
    setOres, 
    setIngredients, 
    storage, 
    getStorage, 
    fuels, 
    pendingMachineOutput, 
    setPendingMachineOutput, 
    siteCounts, 
    updateSiteCounts, 
    onAlert }) => {
   
    // counter of how many machines on site there are
    const [counter, setCounter] = useState(0) // initialises state
    const [animation, setAnimation] = useState('inputReq')

    // State to hold all machine-related data
    const [machineStates, setMachineStates] = useState({
        [machineName]: {
            [itemName]: {
                count: 0,
                currentInput: 0,
                inputMax: 0,
                isRunning: false,
                ...((machineName !== "Electric Furnace" && machineName !== "Electric Drill" ) && {
                    fuels: Object.keys(fuels).reduce((acc, fuelName) => {
                        acc[fuelName] = { current: 0 };
                        return acc;
                    }, {})
                })
            }
        }
    });

    // UseEffect to monitor state changes and trigger checkProduction
    useEffect(() => {
        // Run checkProduction when machineStates[machineName] changes
        if (machineStates[machineName]) {
            checkProduction(machineStates[machineName]);
        }
    }, [machineStates[machineName], siteCounts, storage]); // Dependency array

    // UseEffect to handle the production timing
    useEffect(() => {
        const currentMachineState = machineStates[machineName]?.[itemName];
        const machineSpeed = ingredients[machineName].machineSpeed
        
        if (currentMachineState?.isRunning) {
            const makeTime = ingredients[machineName].isDrill ? ores[output].craftTime : ingredients[output].craftTime
            const multiplier = 
            (ingredients[output]?.multiplier !== undefined) ? ingredients[output].multiplier :
            (ores[output]?.multiplier !== undefined) ? ores[output].multiplier : 
            1;
            const waitTime = makeTime / currentMachineState.count;

            const timeoutId = setTimeout(() => {
                // deduct pending first, then add actual through payout, as payout goes on to checkProduction again
                setPendingMachineOutput(prevPending => ({
                    ...prevPending,
                    [output]: prevPending[output] - multiplier
                }));
                payout(machineStates[machineName]);

            }, waitTime / machineSpeed * 1000);
            
            return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or dependency change
        }
    }, [machineStates, machineName, itemName, ingredients, output]);

    // shows the machines resource amounts
    const machineParent = ingredients[machineName]
    const currentMachineState = machineStates[machineName] || {}; // Getting the state of the current machine
    const fuelsArray = Object.entries(fuels);

    // handles changing the number of machines on site
    const handleMachineChange = (action, machineName) => {
        // Get current counts
        const currentOnSiteCount = counter[machineName] || 0;
        const currentIdleCount = ingredients[machineName].idleCount;
    
        if (action === 'increment' && currentIdleCount > 0) {
            // Proceed only if there's an idle machine available
            const updatedOnSiteCount = currentOnSiteCount + 1;
            const updatedIdleCount = currentIdleCount - 1;
    
            // Update the state
            setCounter(prevCounter => ({
                ...prevCounter,
                [machineName]: updatedOnSiteCount,
            }));
    
            setIngredients(prevIngredients => ({
                ...prevIngredients,
                [machineName]: {
                    ...prevIngredients[machineName],
                    idleCount: updatedIdleCount,
                },
            }));
    
            setMachineStates(prevMachineStates => ({
                ...prevMachineStates,
                [machineName]: {
                    ...prevMachineStates[machineName],
                    [itemName]: {
                        ...prevMachineStates[machineName]?.[itemName],
                        count: updatedOnSiteCount,
                        inputMax: updatedOnSiteCount * 10,
                    },
                },
            }));
        } else if (action === 'decrement' && currentOnSiteCount > 0) {
            // Allow decrement only if there's a machine on-site
            const updatedOnSiteCount = currentOnSiteCount - 1;
            const updatedIdleCount = currentIdleCount + 1;
    
            // Update the state
            setCounter(prevCounter => ({
                ...prevCounter,
                [machineName]: updatedOnSiteCount,
            }));
    
            setIngredients(prevIngredients => ({
                ...prevIngredients,
                [machineName]: {
                    ...prevIngredients[machineName],
                    idleCount: updatedIdleCount,
                },
            }));
    
            setMachineStates(prevMachineStates => ({
                ...prevMachineStates,
                [machineName]: {
                    ...prevMachineStates[machineName],
                    [itemName]: {
                        ...prevMachineStates[machineName]?.[itemName],
                        count: updatedOnSiteCount,
                        inputMax: updatedOnSiteCount * 10,
                    },
                },
            }));
        } else if (action === 'increment') {
            // Notify the user if no idle machines are available
            onAlert(`No idle ${machineName}s`);
        }
    };  

    // Adding ore and ingredients to a machine
    const addItem = (item, byHand) => {
        // Determine if item is ore or ingredient
        const isOre = ores[item] ? true : false;
        const itemData = isOre ? ores[item] : ingredients[item];
    
        // Find the machine state for the specific machineName and itemName
        const chosenMachineState = machineStates[machineName]?.[itemName];

        if (chosenMachineState.inputMax <= 0) {
            console.log("inputMax is 0 or not correctly set");
        }

        if (itemData.count < 1) {
            if(byHand){
                onAlert(`Not enough ${item}`);
            }
        } else {
            // Check if the current input or fuel is not exceeding the inputMax
            const canAddMore = chosenMachineState && (
                (item === itemName && item !== "Coal" && chosenMachineState.currentInput < chosenMachineState.inputMax) ||
                (chosenMachineState.fuels && chosenMachineState.fuels[item] && chosenMachineState.fuels[item].current < chosenMachineState.inputMax)
            );
            if (canAddMore) {
                if (item === itemName && item !== "Coal") {
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
                if(byHand){
                    onAlert(`Cannot add more ${item}, limit reached.`);
                }
            }
        }
    };

    const checkProduction = (machine) => {
        //console.log(JSON.stringify(machine))
        // console.log(JSON.stringify(input))

        // first, check we have any machines
        if(machine[itemName].count > 0){
            // second, check we have room in the destination output
            if(siteCounts[output] + pendingMachineOutput[output] < getStorage(output) || !siteCounts[output]){
                // third, check we aren't aleady running this machine
                if(!machine[itemName].isRunning){
                    // fourth, check we have ingredients

                    let amount = '';

                    if(ingredients[machineName].isFurnace){
                        const cost = ingredients[output].cost
                        const targetName = Object.keys(cost)[0];  // Get the first key, "Stone"
                        amount = cost[targetName];  // Access the value dynamically
                        //const haveIngredients = ores[itemName] ? ores[itemName] : ingredients[itemName]
                        
                        //console.log(`Current Input: ${machine[itemName].currentInput}, Required Amount: ${amount}`);
                        //console.log(`Fuel Levels:`, Object.values(fuels));
                    }

                    if(machine[itemName].currentInput >= amount || ingredients[machineName].isDrill){
                        // fifth, check if we require fuel
                        if(ingredients[machineName].isBurner){
                            // sixth, check we have fuel
                            const fuels = machine[itemName].fuels;
                            const fuelAvailable = Object.values(fuels).some(fuel => fuel.current > 0);

                            if (fuelAvailable) {
                                setAnimation('active');
                                turnOnProduction();  // Call the function if any fuel is available
                            }
                            else if(itemName === "Coal" && ingredients[machineName].isDrill){
                                // ** Special event ** we have burner drills on coal with no fuel
                                if(ores["Coal"].patch.size > 1){
                                    turnOnProduction()
                                }
                                else{
                                    setAnimation('fuelReq');
                                }
                            }
                            else {
                                setAnimation('fuelReq');
                            }
                        }
                        else{
                            // electric machine. Power check here -- NOT YET CODED
                            setAnimation('active');
                            turnOnProduction()
                            // checks can also lead to 
                            // setAnimation('noPower');
                            // setAnimation('lowPower'); <-- this still turns on production but with a delay // you may want to add this check later where the time delay is calculated
                        }
                    } 
                    else {
                        setAnimation('inputReq');
                    }
                } 
                else {
                    //console.log(`${machineName}s making ${output} are already running.`);
                }
            } 
            else{
                setAnimation('outputFull');
            }
        }
        else {
            //console.log(`No ${machineName} available.`);
        }
    }


    const turnOnProduction = () => {

        // Update the running state
        setMachineStates(prevState => ({
            ...prevState,
            [machineName]: {
                ...prevState[machineName],
                [itemName]: {
                    ...prevState[machineName][itemName],
                    isRunning: true
                }
            }
        }));

        const multiplier = 
        (ingredients[output]?.multiplier !== undefined) ? ingredients[output].multiplier :
        (ores[output]?.multiplier !== undefined) ? ores[output].multiplier : 
        1;
        // Update the pending machine output
        setPendingMachineOutput(prevPending => ({
            ...prevPending,
            [output]: (prevPending[output] || 0) + multiplier
        }));
        // this triggers the useEffect to now call the payout script after a delay 
    }

    const payout = (machine) => {
        // deduct input
        if(ingredients[machineName]?.isFurnace){
            const cost = ingredients[output].cost
            const targetName = Object.keys(cost)[0];  // Get the first key, e.g. "Stone"
            const amount = cost[targetName];  // Access the value dynamically
                    
            setMachineStates(prevState => ({
                ...prevState,
                [machineName]: {
                    ...prevState[machineName],
                    [itemName]: {
                        ...prevState[machineName][itemName],
                        currentInput: prevState[machineName][itemName].currentInput - amount
                    }
                }
            }));
        }

        let fuelDeducted = false; // Track if any fuel was deducted

        // deduct fuel (if applicable)
        if (ingredients[machineName]?.isBurner) {
            const fuels = machine[itemName].fuels;

            // Find the first available fuel and deduct from it
            for (const fuelName of Object.keys(fuels)) {
                if (fuels[fuelName].current > 0) {
                    // Determine if fuel is in ores or ingredients
                    const fuelSource = ores[fuelName] ? ores : ingredients;
                    const fuelValue = fuelSource[fuelName].fuelValue;

                    const fuelToDeduct = 1 / fuelValue;

                    setMachineStates(prevState => ({
                        ...prevState,
                        [machineName]: {
                            ...prevState[machineName],
                            [itemName]: {
                                ...prevState[machineName][itemName],
                                fuels: {
                                    ...prevState[machineName][itemName].fuels,
                                    [fuelName]: {
                                        current: prevState[machineName][itemName].fuels[fuelName].current - fuelToDeduct
                                    }
                                }
                            }
                        }
                    }));

                    fuelDeducted = true; // Indicate that fuel was deducted
                    // Break out of the loop after deducting from one fuel source
                    break;
                }
            }
        }

        // check if this is a self-start from the burner drills on coal
        if(!fuelDeducted && ingredients[machineName]?.isBurner && ingredients[machineName]?.isDrill && itemName === 'Coal' ){

            setOres(prevOres => ({
                ...prevOres,
                [itemName]: {
                    ...prevOres[itemName],
                    patch: {
                        ...prevOres[itemName].patch,
                        size: prevOres[itemName].patch.size - 1
                    }
                }
            }));

            setMachineStates(prevState => ({
                ...prevState,
                [machineName]: {
                    ...prevState[machineName],
                    [itemName]: {
                        ...prevState[machineName][itemName],
                        fuels: {
                            ...prevState[machineName][itemName].fuels,
                            [itemName]: {
                                current: prevState[machineName][itemName].fuels[itemName].current + 1
                            }
                        }
                    }
                }
            }));
        }
        
        // else, payout
        else{
            // check its not 1 to many
            const oreOrIngredient = ingredients[output] ? ingredients[output] : ores[output]
            const multiplier = oreOrIngredient.multiplier ? oreOrIngredient.multiplier : 1;
            //console.log(`output: ${JSON.stringify(output)}`)
            updateSiteCounts(output, multiplier)

            // reduce ore patch if its a drill
            if(ingredients[machineName]?.isDrill){
                setOres(prevOres => ({
                    ...prevOres,
                    [itemName]: {
                        ...prevOres[itemName],
                        patch: {
                            ...prevOres[itemName].patch,
                            size: prevOres[itemName].patch.size - multiplier
                        }
                    }
                }));
            }
        }

        // turn off and loop back
        setMachineStates(prevState => ({
            ...prevState,
            [machineName]: {
                ...prevState[machineName],
                [itemName]: {
                    ...prevState[machineName][itemName],
                    isRunning: false
                }
            }
        }));
        checkProduction(machine)
    }

    return(
        <>
        <div className="machineButtons">
            <p style={{padding: '5px'}}>{machineName}s in use:</p>
            <button onClick={() => handleMachineChange('decrement', machineName)}>
                {"<"}
            </button>
            <p style={{padding: '5px'}}>{counter[machineName] || 0}</p>
            <button onClick={() => handleMachineChange('increment', machineName)}>
                {">"}
            </button>
        </div>
        {/* Show the div if counter > 0 */}
        {/* {counter[machineName] > 0 && ( */}
            <div style={{ display: counter[machineName] > 0 ? 'block' : 'none' }}>
                <div style={{marginBottom: "5%"}}>
                    <div className="machine-inserters">
                            {unlockables.inserters1.unlocked && machineName !== "Electric Drill" && (
                                <Inserters 
                                    ores={ores} 
                                    setOres={setOres} 
                                    ingredients={ingredients} 
                                    setIngredients={setIngredients} 
                                    fuels={fuels} 
                                    fuelsArray={fuelsArray} 
                                    machineName={machineName} 
                                    itemName={itemName} 
                                    machineStates={machineStates}
                                    setMachineStates={setMachineStates}
                                    onAlert={onAlert} />
                            )}    
                    </div>
                    <div style={{marginBottom: "5%"}} className="machine-input-buttons">
                        {machineParent.isFurnace && (
                            <MachineAddButton machineName={machineName} itemName={itemName} addItem={addItem} handleMachineChange={handleMachineChange} onAlert={onAlert} />   
                        )}            
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
                    <div className={`machineOnSite ${animation}`}>
                        {images[machineName] && <img src={images[machineName]} alt={`${machineName}`} style={{ width: '32px', height: 'auto' }} />}
                    </div>
                    <div className="machine-inputs">
                        {machineParent.isFurnace && (
                            <p>{itemName}: {currentMachineState[itemName]?.currentInput || 0} / {currentMachineState[itemName]?.inputMax || 0}</p>
                        )}    
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
            </div>
            {/* )} */}
        </>
    )
}

export default MachineOnSite