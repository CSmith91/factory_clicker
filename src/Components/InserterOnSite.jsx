import { useEffect, useState } from "react";
import images from "./Images/images";

const InserterOnSite = ({                            
    ores,
    setOres,
    ingredients,
    setIngredients,
    fuels,
    fuelsArray,
    itemName,
    machineName,
    machineStates,
    setMachineStates,
    inserterName,
    onAlert
    }) => {

    const [animation, setAnimation] = useState('')

    // State to hold all machine-related data
    const [inserterStates, setInserterStates] = useState({
        [inserterName]: {
            [itemName]: {
                [machineName]: {
                    count: 0,
                    isRunning: false,
                    isInsertingMain: false,
                    isInsertingFuel: false,
                    itemToAdd: 'none',
                    ...(inserterName === "Burner Inserter" && {
                        isSelfInserting: false,
                        fuels: Object.keys(fuels).reduce((acc, fuelName) => {
                            acc[fuelName] = { current: 0 };
                            return acc;
                        }, {})
                    })
                }
            }
        }
    });

    // Handle incrementing inserterCounter
    const handleIncrement = (inserterName, itemName, machineName) => {
        const ingredientData = ingredients[inserterName];
        if (ingredientData.idleCount > 0) {
            setInserterStates(prevStates => ({
                ...prevStates,
                [inserterName]: {
                    ...prevStates[inserterName],
                    [itemName]: {
                        ...prevStates[inserterName][itemName],
                        [machineName]: {
                            ...prevStates[inserterName][itemName][machineName],
                            count: prevStates[inserterName][itemName][machineName].count + 1, // Increment the count by 1
                        }
                    }
                }
            }));
            setIngredients((prevIngredients) => ({
                ...prevIngredients,
                [inserterName]: {
                    ...ingredientData,
                    idleCount: ingredientData.idleCount - 1,
                }
            }));
        } else {
            onAlert(`No available ${inserterName}s.`);
        }
    };

    // Handle decrementing inserterCounter
    const handleDecrement = (inserterName, itemName, machineName) => {
        const ingredientData = ingredients[inserterName];
        const currentCount = inserterStates[inserterName][itemName][machineName].count || 0;
        if (currentCount  > 0 && ingredientData.count > ingredientData.idleCount) {
            setInserterStates(prevStates => ({
                ...prevStates,
                [inserterName]: {
                    ...prevStates[inserterName],
                    [itemName]: {
                        ...prevStates[inserterName][itemName],
                        [machineName]: {
                            ...prevStates[inserterName][itemName][machineName],
                            count: prevStates[inserterName][itemName][machineName].count -1
                        }
                    }
                }
            }));
            setIngredients((prevIngredients) => ({
                ...prevIngredients,
                [inserterName]: {
                    ...ingredientData,
                    idleCount: ingredientData.idleCount + 1,
                }
            }));
        }
    };

    // useEffect to monitor state changes and trigger checkInserters
    useEffect(() => {
        if(inserterStates[inserterName]){
            checkInserter(inserterStates[inserterName][itemName][machineName], inserterName, machineName, itemName)
        }
    }, [machineStates, inserterStates, ores, ingredients])

    // useEffect to handle inserter timings and payout
    useEffect(() => {
        const currentInserterState = inserterStates[inserterName][itemName][machineName] || {}; // Getting the state of the current machine
        const inserterSpeed = ingredients[inserterName].machineSpeed;
        const swingTime = 1000 / inserterSpeed / currentInserterState.count
        const maxCarry = ingredients[inserterName].maxCarry;

        // if the inserter is running, we need to call the payout (setting the terms first)
        if(currentInserterState?.isRunning){
            let inputName = ''
            if(currentInserterState?.isSelfInserting){
                // we have a burner that is adding it's own fuel!
                inputName = currentInserterState?.itemToAdd;
            }
            else if(currentInserterState?.isInsertingMain){
                inputName = itemName;
            }
            else if(currentInserterState?.isInsertingFuel){
                inputName = currentInserterState?.itemToAdd;
            }
            else{
                console.error('No valid inserter instruction')
            }

            const item = ores[inputName] ? ores[inputName] : ingredients[inputName];
            const isOre = ores[inputName] ? true : false;
            let carry = Math.min(item.count, maxCarry);

            // deduct resource from inventory
            if (isOre) {
                setOres(prevOres => ({
                    ...prevOres,
                    [inputName]: {
                        ...prevOres[inputName],
                        count: prevOres[inputName].count - carry
                    }
                }));
            } else {
                setIngredients(prevIngs => ({
                    ...prevIngs,
                    [inputName]: {
                        ...prevIngs[inputName],
                        count: prevIngs[inputName].count - carry
                    }
                }));
            }

            // call payout to add the fuel to inserter
            const timeoutId = setTimeout(() => {
                payout(inserterName, itemName, machineName, inputName, carry)
            }, swingTime);
            return () => clearTimeout(timeoutId);
        }
    }, [inserterStates])


    const checkInserter = (inserter, inserterName, machineName, itemName) => {
        // console.log(`inserter: ${JSON.stringify(inserter)}`) // inserter: {"count":0,"isRunning":false,"fuels":{"Wood":{"current":0},"Coal":{"current":0}}}
        const machine = machineStates[machineName][itemName];
        let animationSet = false; // Flag to prevent overwriting animation

        // check if there are any inserters
        if(inserter.count > 0){
            //console.log(`Smeee! Our machineStates[machineName] for ${inserterName} in ${machineName} is ${JSON.stringify(machineStates[machineName])}`)
            
            // check is the inserter isnt already running
            if(!inserter.isRunning){
                let canRun = false;
                let burner = false;

                // check if we have enough fuel or leccy
                if(inserterName === "Burner Inserter"){
                    const fuels = inserter.fuels;
                    canRun = Object.values(fuels).some(fuel => fuel.current > 0);
                    burner = true;
                }
                else{
                    // LECCY CHECK HERE --- NOT DONE YET
                    canRun = true;
                }

                // if we have enough fuel/leccy, we can now check machines
                if(canRun){
                    // check if we have any machines
                    if(machine.count > 0){
                        const item = ores[itemName] ? ores[itemName] : ingredients[itemName];
                        // check if this machine has less than input
                        let notDrill = true;
                        if(machineName === "Burner Drill" || machineName === "Electric Drill"){
                            notDrill = false;
                        }
                        if(notDrill && machine.inputMax - machine.currentInput > 0 && item.count > 0){
                            setAnimation('active');
                            animationSet = true; 
                            turnOnInserter(inserterName, machineName, itemName, 'main');
                        }
                        else if(notDrill && machine.inputMax - machine.currentInput > 0 && item.count == 0){
                            setAnimation('inputReq');
                            animationSet = true; 
                        }
                        else{
                            // machines have full input resource, now check if fuel required
                            if(machine.fuels){

                                // see if we have one fuel to focus on (this is to prevent stuffing every fuels into machines)
                                let activeFuel = null;
                                let maxFuelCurrent = -1; // Initialize with a low value

                                // Iterate over fuels and find the one with the highest current value
                                for (const [fuelName, fuelData] of Object.entries(machine.fuels)) {
                                    if (fuelData.current > maxFuelCurrent) {
                                        activeFuel = [fuelName, fuelData]; // Store the fuel with the highest current
                                        maxFuelCurrent = fuelData.current; // Update maxFuelCurrent
                                    }
                                }
                                
                                if (activeFuel && maxFuelCurrent > 0) {
                                    const [fuelName, fuelData] = activeFuel;
                                    let inventoryFuel = ores[fuelName] ? ores[fuelName] : ingredients[fuelName];
                                    
                                    if (machine.fuels[fuelName].current + 0.95 < machine.inputMax && inventoryFuel && inventoryFuel.count > 0) {
                                        setAnimation('active');
                                        animationSet = true;
                                        turnOnInserter(inserterName, machineName, itemName, 'fuel', fuelName);
                                    }
                                    else{
                                        // we have an active fuel but don't have more of the fuel available. This isnt a problem at this stage, so we can set to idle
                                        setAnimation('idle');
                                        animationSet = true;
                                    }
                                } else {
                                    // Iterate over fuels and check there's no other fuel with current > 0 -- this is to ensure we dont load additional fuels
                                    for (const [fuelName, fuelData] of Object.entries(machine.fuels)) {
                                        if (fuelData.current > 0) {
                                            break;
                                        }
                                    }
                                    
                                    // No active fuel and we're empty, so iterate through all fuels in machine, see if there's room, then check if we have this in the inventory
                                    for (const [fuelName, fuelData] of Object.entries(machine.fuels)) {
                                        // Check if current fuel is less than inputMax and if there is fuel available in ingredients
                                        let inventoryFuel = ores[fuelName] ? ores[fuelName] : ingredients[fuelName]
                                        if (fuelData.current + 0.95 < machine.inputMax && inventoryFuel && inventoryFuel.count > 0) {
                                            //console.log(`${fuelName} can be added to the machine.`);
                                            setAnimation('active');
                                            animationSet = true; 
                                            turnOnInserter(inserterName, machineName, itemName, 'fuel', fuelName);
                                            break; // Stop the loop once the first valid fuel is found
                                        }
                                    }
                                    if (!animationSet) {
                                        // if we get this far, there are no items available to add to the machine
                                        setAnimation('inputReq');
                                        animationSet = true; 
                                    }
                                }
                            }
                            else{
                                // we have an electric machine with full content
                                setAnimation('idle');
                            }
                        }
                    }
                    else{
                        // no machines deployed
                    }
                }
                else if(!canRun && burner && !inserter.isSelfInserting){
                    // we have a burner but no fuel, check we have available fuel to self-insert
                    for (const [fuelName, fuelData] of Object.entries(fuels)) {
                        if (fuelData.count > 0) {
                            setAnimation('self');
                            animationSet = true;
                            turnOnInserter(inserterName, machineName, itemName, 'self', fuelName);
                            break; // Stop the loop once the first valid fuel is found
                        }
                    }
                    // we need fuel but there isnt any available to add!
                    if (!animationSet) {
                        setAnimation('fuelReq');
                    } 
                }
                else{
                    console.error(`How did we get here?`)
                }
            }
            else{
                // inserter is already running!
            }
        }
        else {
            // none of this inserter available
            setAnimation('idle');
        }
    }

    const turnOnInserter = (inserterName, machineName, itemName, inserterInstruction, fuelType) => {
        //console.log(`${inserterName} for ${machineName} taking ${itemName} is on!`)

        // if we have a self-inserting burner inserter
        if(inserterInstruction === 'self'){
            //console.log(`${inserterName} for ${machineName} taking ${itemName} is on and self-inserting ${fuelType}!`)
            setInserterStates(prevStates => ({
                ...prevStates,
                [inserterName]: {
                    ...prevStates[inserterName],
                    [itemName]: {
                        ...prevStates[inserterName][itemName],
                        [machineName]: {
                            ...prevStates[inserterName][itemName][machineName],
                            isRunning: true,
                            isSelfInserting: true,
                            itemToAdd: fuelType,
                        }
                    }
                }
            }));
            
        }
        else if(inserterInstruction === 'main'){
            setInserterStates(prevStates => ({
                ...prevStates,
                [inserterName]: {
                    ...prevStates[inserterName],
                    [itemName]: {
                        ...prevStates[inserterName][itemName],
                        [machineName]: {
                            ...prevStates[inserterName][itemName][machineName],
                            isRunning: true,
                            isInsertingMain: true,
                            itemToAdd: itemName
                        }
                    }
                }
            }));
        }
        else if(inserterInstruction === 'fuel'){
            setInserterStates(prevStates => ({
                ...prevStates,
                [inserterName]: {
                    ...prevStates[inserterName],
                    [itemName]: {
                        ...prevStates[inserterName][itemName],
                        [machineName]: {
                            ...prevStates[inserterName][itemName][machineName],
                            isRunning: true,
                            isInsertingFuel: true,
                            itemToAdd: fuelType,
                        }
                    }
                }
            }));
        }
        else{
            console.error(`Something went wrong with ${inserterName} turning on for ${machineName} under ${itemName}`)
        }
    }

    const payout = (inserterName, itemName, machineName, inputName, carry) => {

        const currentInserterState = inserterStates[inserterName][itemName][machineName]

        if(currentInserterState.isSelfInserting){
            setInserterStates(prevStates => {
                const prevState = prevStates[inserterName][itemName][machineName];
                
                // Only update state if necessary to avoid unnecessary re-renders
                if (!prevState.isRunning || prevState.isSelfInserting || prevState.itemToAdd !== 'none') {
                    const newState = {
                        ...prevStates,
                        [inserterName]: {
                            ...prevStates[inserterName],
                            [itemName]: {
                                ...prevStates[inserterName][itemName],
                                [machineName]: {
                                    ...prevStates[inserterName][itemName][machineName],
                                    isRunning: false,
                                    isSelfInserting: false,
                                    itemToAdd: 'none',
                                    ...(prevState.fuels && {
                                        fuels: {
                                            ...prevState.fuels,
                                            [inputName]: {
                                                ...prevState.fuels[inputName],
                                                current: prevState.fuels[inputName].current + carry
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    };
                    return newState;
                }
                return prevStates;
            });
        }
        else if(currentInserterState.isInsertingMain){

            // handle the fuel or power (NEED TO CODE LECCY)
            if(inserterName === "Burner Inserter"){
                deductFuel(inserterName, machineName, itemName);
            }
            else{
                // HANDLE LECCY
            }

            // update the machine
            setMachineStates(prevStates => {
                const prevMachineState = prevStates[machineName][itemName];
        
                // Increase the currentInput by carry
                const newMachineState = {
                    ...prevMachineState,
                    currentInput: Math.min(prevMachineState.currentInput + carry, prevMachineState.inputMax)
                };
        
                return {
                    ...prevStates,
                    [machineName]: {
                        ...prevStates[machineName],
                        [itemName]: newMachineState
                    }
                };
            });

            // then update the inserter
            setInserterStates(prevStates => {
                const prevState = prevStates[inserterName][itemName][machineName];
                
                // Only update state if necessary to avoid unnecessary re-renders
                if (!prevState.isRunning || prevState.isInsertingMain || prevState.itemToAdd !== 'none') {
                    const newState = {
                        ...prevStates,
                        [inserterName]: {
                            ...prevStates[inserterName],
                            [itemName]: {
                                ...prevStates[inserterName][itemName],
                                [machineName]: {
                                    ...prevStates[inserterName][itemName][machineName],
                                    isRunning: false,
                                    isInsertingMain: false,
                                    itemToAdd: 'none',
                                }
                            }
                        }
                    };
                    return newState;
                }
                return prevStates;
            });
        }
        else if(currentInserterState.isInsertingFuel){
            // handle the fuel or power (NEED TO CODE LECCY)
            if(inserterName === "Burner Inserter"){
                deductFuel(inserterName, machineName, itemName);
            }
            else{
                // HANDLE LECCY
            }

            // update the machine
            setMachineStates(prevStates => {
                const prevMachineState = prevStates[machineName][itemName];
            
                // Increase the fuel amount
                const newFuels = {
                    ...prevMachineState.fuels,
                    [inputName]: {
                        ...prevMachineState.fuels[inputName],
                        current: Math.min(prevMachineState.fuels[inputName].current + carry, prevMachineState.inputMax)
                    }
                };
            
                // Return the updated state
                return {
                    ...prevStates,
                    [machineName]: {
                        ...prevStates[machineName],
                        [itemName]: {
                            ...prevMachineState,
                            fuels: newFuels
                        }
                    }
                };
            });

            // then update the inserter
            setInserterStates(prevStates => {
                const prevState = prevStates[inserterName][itemName][machineName];
                
                // Only update state if necessary to avoid unnecessary re-renders
                if (!prevState.isRunning || prevState.isInsertingMain || prevState.itemToAdd !== 'none') {
                    const newState = {
                        ...prevStates,
                        [inserterName]: {
                            ...prevStates[inserterName],
                            [itemName]: {
                                ...prevStates[inserterName][itemName],
                                [machineName]: {
                                    ...prevStates[inserterName][itemName][machineName],
                                    isRunning: false,
                                    isInsertingFuel: false,
                                    itemToAdd: 'none',
                                }
                            }
                        }
                    };
                    return newState;
                }
                return prevStates;
            });
        }
    }

    const deductFuel = (inserterName, machineName, itemName) => {

        const currentInserterState = inserterStates[inserterName][itemName][machineName];
        let chosenFuel = 'finding fuel';
        let chosenFuelName = '';

        for (const [fuelName, fuelData] of Object.entries(currentInserterState.fuels)) {
            if (fuelData.current > 0) {
                chosenFuel = ores[fuelName] ? ores[fuelName] : ingredients[fuelName]
                chosenFuelName = fuelName;
                break; // Stop the loop once the first valid fuel is found
            }
            chosenFuel = 'error'
        }

        if(chosenFuel === 'error' || chosenFuel === 'finding fuel'){
            console.error(`Couldn't find fuel for ${inserterName} to deduct. Code: ${chosenFuel}`)
            return;
        }

        const deductAmount = 7 / (chosenFuel.fuelValue * 100)

        setInserterStates(prevStates => ({
            ...prevStates,
            [inserterName]: {
                ...prevStates[inserterName],
                [itemName]: {
                    ...prevStates[inserterName][itemName],
                    [machineName]: {
                        ...prevStates[inserterName][itemName][machineName],
                        fuels: {
                            ...prevStates[inserterName][itemName][machineName].fuels,
                            [chosenFuelName]: {
                                ...prevStates[inserterName][itemName][machineName].fuels[chosenFuelName],
                                current: Math.max(parseFloat((prevStates[inserterName][itemName][machineName].fuels[chosenFuelName].current - deductAmount).toFixed(2)), 0) // Ensure fuel doesn't go below 0
                            }
                        }
                    }
                }
            }
        }));
    }

    // useEffect to undeploy all inserters when the parent machine count goes to 0
    useEffect(() => {
        if (machineStates[machineName][itemName].count === 0) {
            undeployInserters();
        }
    }, [machineStates]);

    const undeployInserters = () => {

        const prevInserterCount = inserterStates[inserterName][itemName][machineName].count

        setInserterStates(prevStates => {
            // Create a copy of the current inserter states
            const newStates = { ...prevStates };
    
            // Loop through the inserter states and reset or remove inserters for this machine
            Object.keys(newStates).forEach(inserterName => {
                if (newStates[inserterName] && newStates[inserterName][itemName] && newStates[inserterName][itemName][machineName]) {
                    const inserterState = newStates[inserterName][itemName][machineName];
    
                    // Reset basic inserter properties
                    inserterState.count = 0;
                    inserterState.isRunning = false;
                    inserterState.isInsertingMain = false;
                    inserterState.isInsertingFuel = false;
                    inserterState.itemToAdd = 'none';
    
                    // If this is a "Burner Inserter", reset the fuel values
                    if (inserterName === "Burner Inserter" && inserterState.fuels) {
                        Object.keys(inserterState.fuels).forEach(fuelName => {
                            inserterState.fuels[fuelName].current = 0;  // Reset fuel amount to 0
                        });
                    }
                }
            });
    
            // Return updated inserter states
            return newStates;
        });
    
        // You would also need to update the inventory to return the inserters to storage
        updateInventoryForUndeployedInserters(prevInserterCount);
    };
    
    const updateInventoryForUndeployedInserters = (prevInserterCount) => {
        // Logic to increase the inventory count of inserters when they're undeployed
        setIngredients(prevIngs => ({
            ...prevIngs,
            [inserterName]: {
                ...prevIngs[inserterName],
                idleCount: prevIngs[inserterName].idleCount + prevInserterCount
            }
        }));
    };


    return (
        <>
            {inserterName === 'Burner Inserter' ? (
                <div key={inserterName} className="burner-inserter-row">
                    <div className="inserters-lane">
                        <button onClick={() => handleIncrement(inserterName, itemName, machineName)}>+</button>
                        <div className={`inserterOnSite ${animation}`}>
                            <img src={`${images[inserterName]}`} alt={inserterName} className="menu-image" />
                        </div>
                        <p>{inserterStates[inserterName]?.[itemName]?.[machineName]?.count || 0}</p>
                        <button onClick={() => handleDecrement(inserterName, itemName, machineName)}>-</button>
                    </div>
                    <div className="burner-fuel-info">
                        {fuelsArray.map(([fuelName, fuelData]) => {
                            if (fuelData.unlocked) {
                                const fuelLevel = inserterStates[inserterName]?.[itemName]?.[machineName]?.fuels?.[fuelName]?.current || 0;
                                return (
                                    <div key={`${fuelName}-${inserterName}`} className="fuel-status">
                                        <p>{fuelName}: {fuelLevel}</p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            ) : (
                <div key={inserterName} className="inserters-lane">
                    <button onClick={() => handleIncrement(inserterName, itemName, machineName)}>+</button>
                    <div className={`inserterOnSite ${animation}`}>
                        <img src={`${images[inserterName]}`} alt={inserterName} className="menu-image" />
                    </div>
                    <p>{inserterStates[inserterName]?.[itemName]?.[machineName]?.count || 0}</p>
                    <button onClick={() => handleDecrement(inserterName, itemName, machineName)}>-</button>
                </div>
            )}
        </>
    )

}

export default InserterOnSite