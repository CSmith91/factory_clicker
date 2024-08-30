import React, { useState, useEffect } from 'react';
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

  const updateItemCounts = (itemName, countChange, tempCountChange) => {
    const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
    const updateState = oreOrIngredient === 'ore' ? setOres : setIngredients;
  
    updateState(prevState => {
        const updatedItem = {
            ...prevState[itemName],
            count: prevState[itemName].count + countChange,
            tempCount: prevState[itemName].tempCount + tempCountChange
        };
        return {
            ...prevState,
            [itemName]: updatedItem
        };
    });
  };

  const handleBank = (itemName) => {
    const currentCount = outputCounts[itemName] || 0;
    const item = ores[itemName] ? ores[itemName] : ingredients[itemName];
    const storageLimit = getStorage(itemName);

    if (!item) {
        console.error(`${itemName} not found.`);
        return;
    }

    if (item.count + item.tempCount >= storageLimit) {
        onAlert(`${itemName} is full.`);
    } else{
        const newCount = item.count + currentCount;

        if (newCount + item.tempCount > storageLimit) {
            const partialAddCount = storageLimit - item.count - item.tempCount;
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

  useEffect(() => {
    Object.keys(ores).forEach(oreName => {
        if (ores[oreName].patch !== undefined && ingredients["Transport Belt"].unlocked) {
            checkBelts(oreName);
        }
    });

    Object.keys(ingredients).forEach(ingredientName => {
        if (ingredients[ingredientName].count !== undefined && ingredients["Transport Belt"].unlocked) {
            checkBelts(ingredientName);
        }
    });
  }, [ores, ingredients]);

  // Function to increment the ore count
  const onIncrement = (oreName, toolName, manOrMachine) => {

    if(ores["Wood"].harvested >= 20 && !unlockables.axe2.isVisible){
      setUnlockables(prevUnlockables => ({
          ...prevUnlockables,
          axe2: { 
              ...prevUnlockables.axe2,
              isVisible: true
          }
          }));
    }

    if(ores["Wood"].harvested >= 30 && !unlockables.storage1.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            storage1: { 
                ...prevUnlockables.storage1,
                isVisible: true
            }
        }));
    }

    if(ores["Wood"].harvested >= 45 && !unlockables.copper1.isVisible){
      setUnlockables(prevUnlockables => ({
          ...prevUnlockables,
          copper1: { 
              ...prevUnlockables.copper1,
              isVisible: true
          }
          }));
  }

    if(ores["Stone"].patch.size <= 119988 && !unlockables.pick2.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            pick2: { 
                ...prevUnlockables.pick2,
                isVisible: true
            }
            }));
    }

    if(ores["Stone"].patch.size <= 119895 && !unlockables.inserters1.isVisible){
      setUnlockables(prevUnlockables => ({
          ...prevUnlockables,
          inserters1: { 
              ...prevUnlockables.inserters1,
              isVisible: true
          }
          }));
    }

    if(ores["Iron Ore"].patch.size <= 349998 && !unlockables.drill1.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            drill1: { 
                ...prevUnlockables.drill1,
                isVisible: true
            }
            }));
    }

    if(ores["Iron Ore"].patch.size <= 349979 && !unlockables.belts1.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            belts1: { 
                ...prevUnlockables.belts1,
                isVisible: true
            }
            }));
    }

    if(ores["Iron Ore"].patch.size <= 349955 && !unlockables.coal1.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            coal1: { 
                ...prevUnlockables.coal1,
                isVisible: true
            }
            }));
    }

    if(ores["Iron Ore"].patch.size <= 349935 && !unlockables.storage2.isVisible){
      setUnlockables(prevUnlockables => ({
          ...prevUnlockables,
          storage2: { 
            ...prevUnlockables.storage2,
            isVisible: true
          }
      }))
    }

    if(ores["Copper Ore"].patch.size <= 339980 && !unlockables.wire1.isVisible){
      setUnlockables(prevUnlockables => ({
          ...prevUnlockables,
          wire1: { 
            ...prevUnlockables.wire1,
            isVisible: true
          }
      }))
    }

    if(ores["Copper Ore"].patch.size <= 339965 && !unlockables.chip1.isVisible){
      setUnlockables(prevUnlockables => ({
          ...prevUnlockables,
          chip1: { 
            ...prevUnlockables.chip1,
            isVisible: true
          }
      }))
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
    //console.log(`Our lanes[itemName] is: ${JSON.stringify(lanes[itemName])}`)
    const targetResource = ores[itemName] || ingredients[itemName];

    // first, we check if there are any resources to move
    //console.log(`Belts have been called! outputCounts[itemName] for ${itemName} is: ${outputCounts[itemName]}`)
    if(outputCounts[itemName] > 0){
    // second, we check if the target storage has space (including tempCount!)
      let totalCount = targetResource.count + targetResource.tempCount;
      if(totalCount < getStorage(itemName)){
        //console.log(`So far so good. totalCount of ${itemName} is: ${totalCount} and storageLimit is: ${getStorage(itemName)}`)
        // lastly iterate through the bus. Any lanes that are active (and not already running) then trigger the payout
        const bus = lanes[itemName]
        //console.log(`full bus: ${JSON.stringify(bus)}`)
        Object.entries(bus).forEach(([lane, details]) => {
          if (!details.isRunning && details.active) {
            // console.log(`Lane: ${lane}`);
            // console.log(`Details: ${JSON.stringify(details)}`);
            // console.log('-----------------------');
            let speed = details.speed;
            moveItemToBelt(itemName, lane, speed);
          }
        });
        }
      else{
        // storage is full
      }
    }
    else{
      // nothing to move
    }
  }

  const moveItemToBelt = (itemName, lane, speed) => {
    const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
    const targetResource = oreOrIngredient === 'ore' ? ores[itemName] : ingredients[itemName];

    // Move item only if there is room
    if (targetResource.tempCount + targetResource.count < getStorage(itemName)) {
      updateItemCounts(itemName, 0, 1); // Increment tempCount before processing

      setOutputCounts(prevCounts => {
          const newCount = Math.max(0, (prevCounts[itemName] || 0) - 1);
          return { ...prevCounts, [itemName]: newCount };
      });

      turnOnBelt(itemName, lane, speed);
    } 
    else {
        console.log(`Storage for ${itemName} is full or no room in tempCount.`);
    }
  };


  const turnOnBelt = (itemName, lane, speed) => {

    // belt payouts are different to machines
    // we have a constant take-take-take of resources at a very high rate
    // and a long delay for the final payout. The belts flash while they are
    // delivering resources but take/stop taking from the bank independantly
    // hence, this function has two timeouts: one for taking and another for 
    // arrival

    // set the belt lane as running
    updateLaneRunningState(itemName, lane, true);

    const beltId = `belt-${itemName.replace(/\s+/g, '-')}-${lane}`;
    const laneElement = document.querySelector(`#${beltId}`);
    
    if (laneElement) {
      // Determine which class to add based on the speed
      let flashClass = speed >= 5 ? 'flashing-fast' : speed >= 3 ? 'flashing-medium' : 'flashing-slow';
      laneElement.classList.add(flashClass);

      // Remove flashing effect and payout after delay
      setTimeout(() => {
        laneElement.classList.remove(flashClass);
      }, 50 / speed * 1000); 
    }
    else{
      console.error(`No laneElement found with ID: ${beltId}`);
    }

    // running separately to the above to ensure this always runs -- it would appear this fixes the transit bug
    setTimeout(() => {
      updateItemCounts(itemName, 1, -1)
    }, 50 / speed * 1000); 

    // loop back to achieve x items / second
    setTimeout(() => {
        updateLaneRunningState(itemName, lane, false);
    }, (1000 / (8 * speed))); // this is the throughput for belts
  };

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