import React, { useState } from 'react';
import OresAndDrills from './OresAndDrills';
import Furnaces from './Furnaces'

const ResourceSection = ({
    unlockables,
    setUnlockables,
    ores,
    ingredients,
    tools,
    setOres,
    setIngredients,
    storage,
    getStorage,
    setTools,
    handleMachineChange,
    networks,
    setNetworks,
    lanes,
    setLanes,
    onAlert
}) => {

  const shouldShowFurnaces = () => {
      return ingredients["Brick"].unlocked
    };

  const [outputCounts, setOutputCounts] = useState({});
  const [pendingMachineOutput, setPendingMachineOutput] = useState({});

  const incrementTempCount = (itemName, incrementBy) => {
    const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
    if(oreOrIngredient === 'ore'){
      setOres(prevOres => ({
          ...prevOres,
          [itemName]: {
              ...prevOres[itemName],
              tempCount: prevOres[itemName].tempCount + incrementBy
          }
      }));
    }
    else if(oreOrIngredient === 'ingredient'){
      setIngredients(prevOres => ({
        ...prevOres,
        [itemName]: {
            ...prevOres[itemName],
            tempCount: prevOres[itemName].tempCount + incrementBy
        }
    }));
    }
    else{
      console.log(`Something's gone wrong incrementing ${itemName} temp value through belts!`)
    }
  };

  const incrementCount = (itemName, incrementBy) => {
    console.log(`I've been called!`)
    const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
    if(oreOrIngredient === 'ore'){
      setOres(prevOres => ({
          ...prevOres,
          [itemName]: {
              ...prevOres[itemName],
              count: prevOres[itemName].count + incrementBy
          }
      }));
    }
    else if(oreOrIngredient === 'ingredient'){
      setIngredients(prevOres => ({
        ...prevOres,
        [itemName]: {
            ...prevOres[itemName],
            count: prevOres[itemName].count + incrementBy
        }
    }));
    }
    else{
      console.log(`Something's gone wrong incrementing ${itemName} final value through belts!`)
    }
  };

  const handleBank = (itemName) => {
    const currentCount = outputCounts[itemName] || 0;
    const item = ores[itemName] ? ores[itemName] : ingredients[itemName];
    const storageLimit = getStorage(itemName);

    if (!item) {
        console.error(`${itemName} not found.`);
        return;
    }

    if (item.count >= storageLimit) {
        onAlert(`${itemName} is full.`);
    } else{
        const newCount = item.count + currentCount;

        if (newCount > storageLimit) {
            const partialAddCount = storageLimit - item.count;
            updateInventoryAndBank(itemName, partialAddCount, currentCount - partialAddCount);
        } else if (currentCount > 0) {
            updateInventoryAndBank(itemName, currentCount, 0);
        }
    }
  };

  const updateInventoryAndBank = (itemName, countToAdd, remainingOutputCount) => {
    const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
    if(oreOrIngredient === 'ore'){
        setOres(prevIngs => ({
            ...prevIngs,
            [itemName]: {
                ...prevIngs[itemName],
                count: prevIngs[itemName].count + countToAdd
            }
        }));
    }
    else if(oreOrIngredient === 'ingredient'){
        setIngredients(prevIngs => ({
            ...prevIngs,
            [itemName]: {
                ...prevIngs[itemName],
                count: prevIngs[itemName].count + countToAdd
            }
        }));
    }
    else{
        console.error(`${itemName} not found in state.`);
    }

    setOutputCounts(prevCounts => ({
        ...prevCounts,
        [itemName]: remainingOutputCount
    }));
    //console.log(`outputCounts: ${JSON.stringify(outputCounts)}`)
  };

  // Function to update the output count
  const updateOutputCount = (itemName, amount, manOrMachine) => {

    if(manOrMachine){
        if(outputCounts[itemName] >= getStorage(itemName)){
            if(manOrMachine === 'manual'){
                onAlert(`Storage is full. You cannot mine ${itemName}.`);
            }
            return; // Exit the function if storage is full
        }

        // Check if the tool is usable before incrementing
        const toolName = itemName === 'Wood' ? 'Axe' : 'Pickaxe';
        const tool = tools[toolName];

        if ((manOrMachine === 'manual' && tool.durability <= 0 ) || !tool) {
            onAlert(`Your ${toolName} is broken. You cannot mine ${itemName}.`);
            return; // Exit the function if the tool is broken
        }

        // If the tool is usable, proceed with incrementing the ore and output count
        onIncrement(itemName, toolName, manOrMachine);
    
    }

    setOutputCounts(prevCounts => ({
        ...prevCounts,
        [itemName]: (prevCounts[itemName] || 0) + amount
    }));
  };


  // Function to increment the ore count
  const onIncrement = (oreName, toolName, manOrMachine) => {

    if(ores["Stone"].patch.size === 119988){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            pick2: { 
                ...prevUnlockables.pick2,
                isVisible: true
            }
            }));
    }

    if(ores["Wood"].harvested === 20){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            axe2: { 
                ...prevUnlockables.axe2,
                isVisible: true
            }
            }));
    }

    if(ores["Wood"].harvested === 30){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            storage1: { 
                ...prevUnlockables.storage1,
                isVisible: true
            }
        }));
    }

    if(ores["Iron Ore"].patch.size === 349998){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            drill1: { 
                ...prevUnlockables.drill1,
                isVisible: true
            }
            }));
    }

    if(ores["Iron Ore"].patch.size === 349972){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            belts1: { 
                ...prevUnlockables.belts1,
                isVisible: true
            }
            }));
    }

    if(ores["Iron Ore"].patch.size === 349955){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            coal1: { 
                ...prevUnlockables.coal1,
                isVisible: true
            }
            }));
    }

    if(ores["Iron Ore"].patch.size === 349935){
    setUnlockables(prevUnlockables => ({
        ...prevUnlockables,
        storage2: { 
          ...prevUnlockables.storage2,
          isVisible: true
        }
    }))
    }

    if(ores["Wood"].harvested === 45){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            copper1: { 
                ...prevUnlockables.copper1,
                isVisible: true
            }
            }));
    }
    
    if(manOrMachine === "manual"){
        // Update the tool's durability
        setTools(prevTools => {
        const tool = prevTools[toolName];
        const updatedDurability = tool.durability - tool.corrodeRate;
        return {
            ...prevTools,
            [toolName]: {
                ...tool,
                durability: Math.max(0, updatedDurability)
            }
        };
        });
    }

    // Increment the ore count only if the tool had durability or machine-mined
    setOres(prevOres => {
        const tool = tools[toolName];
        if (tool.durability > 0 || !manOrMachine === 'manual') {
            // update patch, if applicable
            const updatedPatch = prevOres[oreName].patch
            ? { ...prevOres[oreName].patch, size: prevOres[oreName].patch.size - 1 }
            : undefined;
            //update harvest, if applicable
            const updatedHarvest = prevOres[oreName].harvested !== undefined
            ? prevOres[oreName].harvested + 1
            : undefined;

            return {
                ...prevOres,
                [oreName]: {
                    ...prevOres[oreName],
                    harvested: updatedHarvest,
                    patch: updatedPatch
                }
            };
        }
        return prevOres;
    });
  };

  // useEffect(() => {
  //   checkBelts(itemName)
  // }, [onIncrement])

  const updateLaneRunningState = (itemName, lane, isRunning) => {
    setLanes(prevLanes => ({
      ...prevLanes,
      [itemName]: {
        ...prevLanes[itemName],
        [lane]: {
          ...prevLanes[itemName][lane],
          isRunning: isRunning,
        },
      },
    }));
  };
  
  const checkBelts = (itemName) => {
    console.log(`Belts have been called
      itemName: ${itemName}
      outputCounts[itemName]: ${outputCounts[itemName]}
      `)
    //console.log(`Our lanes[itemName] is: ${JSON.stringify(lanes[itemName])}`)
    const targetResource = ores[itemName] || ingredients[itemName];

    // first, we check if there are any resources to move
    console.log(`outputCounts[itemName] for ${itemName} is: ${outputCounts[itemName]}`)
    if(outputCounts[itemName] > 0){
      // second, we check if the target storage has space (including tempCount!)
      if(targetResource.count + targetResource.tempCount < getStorage(targetResource)){
        // lastly iterate through the bus. Any lanes that are active (and not already running) then trigger the payout
        let bus = lanes[itemName]

        for (let lane in bus) {
          if (bus[lane].active && !bus[lane].isRunning) {
              console.log(`Is running? ${bus[lane].isRunning} Found an active, non-running belt! Turning on.`)
              let speed = bus[lane].speed;
              incrementTempCount(itemName, 1);   
              turnOnBelt(itemName, lane, speed)
          }
        }
      }
      else{
        // storage is full
      }
    }
    else{
      // nothing to move
    }
  }

  const turnOnBelt = (itemName, lane, speed) => {

    // belt payouts are different to machines
    // we have a constant take-take-take of resources at a very high rate
    // and a long delay for the final payout. The belts flash while they are
    // delivering resources but take/stop taking from the bank independantly
    // hence, this function has two timeouts: one for taking and another for 
    // arrival

    // set the belt lane as running
    updateLaneRunningState(itemName, lane, true);

    const beltId = `belt-${itemName}-${lane}`;
    //console.log(`Attempting to find element with ID: ${beltId}`);

    // Add a flashing effect to the lane in CSS
    const laneElement = document.querySelector(`#${beltId}`);
    
    if (laneElement) {
      // Determine which class to add based on the speed
      let flashClass;
      if (speed >= 5) flashClass = 'flashing-fast';
      else if (speed >= 3) flashClass = 'flashing-medium';
      else flashClass = 'flashing-slow';

      // Add the corresponding class for flashing
      laneElement.classList.add(flashClass);

      // Remove flashing effect and payout after delay
      setTimeout(() => {
        laneElement.classList.remove(flashClass);
        beltPayout(itemName);
      }, 2000 ) // 50 / speed * 1000); // ADDDED 2000 FOR QUICKER TESTING
    }
    else{
      console.error(`No laneElement found with ID: ${beltId}`);
      //console.log(document.body.innerHTML);
    }

    const throughput = 8 * speed
    // loop back to achieve x items / second
    setTimeout(() => {
      // deduct item from the bank (almost) immediately
      setOutputCounts(prevCounts => {
        const newCount = (prevCounts[itemName] || 0) - 1;
        return { ...prevCounts, [itemName]: Math.max(0, newCount) };
      });

      updateLaneRunningState(itemName, lane, false);
      checkBelts(itemName)

    }, 1000 ) // / throughput ) //BLOCKED THROUGHPUT FOR SLOWER TESTING
  };

  const beltPayout = (itemName) => {
    console.log(`I've paid out!`)
    // add item to inventory
    incrementCount(itemName, 1); 

    // remove item as a temp value
    incrementTempCount(itemName, -1);  
  }

  const isStorageFull = (itemName) => { 
    const currentStorage = outputCounts[itemName] || 0;
    const storageLimit = getStorage(itemName);

    if (currentStorage >= storageLimit) {
        return true;
    }
    return false;
  };

  return (
      <>
          {/* Ore Patch Section */}
          <div className='section'>
            <OresAndDrills 
              unlockables={unlockables}
              ores={ores} 
              ingredients={ingredients} 
              setOres={setOres} 
              setIngredients={setIngredients} 
              storage={storage} 
              getStorage={getStorage} 
              isStorageFull={isStorageFull}
              handleMachineChange={handleMachineChange}
              pendingMachineOutput={pendingMachineOutput}
              setPendingMachineOutput={setPendingMachineOutput}
              handleBank={handleBank}
              outputCounts={outputCounts}
              updateOutputCount={updateOutputCount}
              networks={networks}
              setNetworks={setNetworks}
              checkBelts={checkBelts}
              lanes={lanes}
              setLanes={setLanes}
              onAlert={onAlert} />
          </div>

          {/* Furnaces Section */}
          {shouldShowFurnaces() && (
            <div className='section'>
              <Furnaces 
                unlockables={unlockables}
                ores={ores} 
                ingredients={ingredients} 
                setOres={setOres} 
                setIngredients={setIngredients} 
                storage={storage} 
                getStorage={getStorage} 
                isStorageFull={isStorageFull}
                handleMachineChange={handleMachineChange} 
                pendingMachineOutput={pendingMachineOutput}
                setPendingMachineOutput={setPendingMachineOutput}
                handleBank={handleBank}
                outputCounts={outputCounts}
                updateOutputCount={updateOutputCount}
                networks={networks}
                setNetworks={setNetworks}
                checkBelts={checkBelts}
                lanes={lanes}
                setLanes={setLanes}
                onAlert={onAlert} />
            </div>
          )}
      </>
  )

}

export default ResourceSection