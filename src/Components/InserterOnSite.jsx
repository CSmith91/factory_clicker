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
    inserterName,
    onAlert
    }) => {

    const [animation, setAnimation] = useState('')
    //const [running, setRunning] = useState(false)

    // State to hold all machine-related data
    const [inserterStates, setInserterStates] = useState({
        [inserterName]: {
            [itemName]: {
                [machineName]: {
                    count: 0,
                    isRunning: false,
                    isInserteringMain: false,
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
            if(currentInserterState?.isSelfInserting){
                // we have a burner that is adding it's own fuel!
                const fuelName = currentInserterState?.itemToAdd;
                const fuelItem = ores[fuelName] ? ores[fuelName] : ingredients[fuelName];
                const isOre = ores[fuelName] ? true : false;
                let carry = Math.min(fuelItem.count, maxCarry);

                // deduct fuel from inventory
                if (isOre) {
                    setOres(prevOres => ({
                        ...prevOres,
                        [fuelName]: {
                            ...prevOres[fuelName],
                            count: prevOres[fuelName].count - carry
                        }
                    }));
                } else {
                    setIngredients(prevIngs => ({
                        ...prevIngs,
                        [fuelName]: {
                            ...prevIngs[fuelName],
                            count: prevIngs[fuelName].count - carry
                        }
                    }));
                }

                // call payout to add the fuel to inserter
                const timeoutId = setTimeout(() => {
                    payout(inserterName, itemName, machineName, fuelName, carry)
                }, swingTime);
                return () => clearTimeout(timeoutId);
            }
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
                        
                        // check if this machine has less than input
                        if(machine.inputMax - machine.currentInput > 0){

                            // check we have the resource
                            const item = ores[itemName] ? ores[itemName] : ingredients[itemName];
                            if(item.count > 0){
                                setAnimation('active');
                                animationSet = true; 
                                turnOnInserter(inserter, inserterName, machineName, itemName, 'main');
                            }
                            else{
                                // we don't have the itemName in our inventory
                                setAnimation('inputReq');
                                animationSet = true; 
                            }
                        }
                        else{
                            // machines have full input resource, now check if fuel required
                            if(machine.fuels){
                                // loop through all the fuels to see if all fuels are 0
                                const oneFuelAtMax = Object.values(machine.fuels).some(fuel => fuel.current === machine.inputMax);

                                if (!oneFuelAtMax) {
                                    // Loop through all fuels in machine, see if there's room, then check if we have this in the inventory
                                    for (const [fuelName, fuelData] of Object.entries(machine.fuels)) {
                                        // Check if current fuel is less than inputMax and if there is fuel available in ingredients
                                        let inventoryFuel = ores[fuelName] ? ores[fuelName] : ingredients[fuelName]
                                        if (fuelData.current < machine.inputMax && inventoryFuel && inventoryFuel.count > 0) {
                                            console.log(`${fuelName} can be added to the machine.`);
                                            setAnimation('active');
                                            animationSet = true; 
                                            turnOnInserter(inserter, inserterName, machineName, itemName, 'fuel', fuelName);
                                            break; // Stop the loop once the first valid fuel is found
                                        }
                                    }
                                    if (!animationSet) {
                                        // if we get this far, there are no fuels available to add to the machine
                                        setAnimation('inputReq');
                                    }
                                }
                                else{
                                    // burner machine has max fuel and and max input, so do nothing!
                                    setAnimation('idle');
                                }
                            }
                            else{
                                // we have an electric machine with full content
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
                            isInserteringMain: true
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

    const payout = (inserterName, itemName, machineName, fuelName, carry) => {
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
                                        [fuelName]: {
                                            ...prevState.fuels[fuelName],
                                            current: prevState.fuels[fuelName].current + carry
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