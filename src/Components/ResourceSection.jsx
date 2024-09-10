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
    debug,
    onAlert
}) => {

  const shouldShowFurnaces = () => {
      return ingredients["Brick"].unlocked
    };

  const [siteCounts, setSiteCounts] = useState({}); // count of item in bank
  const [pendingMachineOutput, setPendingMachineOutput] = useState({}); // temp value used by machines on site to ensure no output beyond storage limit

  const handleBank = (itemName) => {
    const currentCount = siteCounts[itemName] || 0;
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

    setSiteCounts(prevCounts => ({
        ...prevCounts,
        [itemName]: remainingOutputCount
    }));
    //console.log(`siteCounts: ${JSON.stringify(siteCounts)}`)
  };

  // Function to update the output count
  const updateSiteCounts = (itemName, amount, manOrMachine) => {

    if(manOrMachine){
        if(siteCounts[itemName] >= getStorage(itemName)){
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

    setSiteCounts(prevCounts => ({
        ...prevCounts,
        [itemName]: (prevCounts[itemName] || 0) + amount
    }));
  };

  useEffect(() => {
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

    if(ores["Coal"].patch.size <= 344940 && !unlockables.boiler.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            boiler: { 
              ...prevUnlockables.boiler,
              isVisible: true
            }
        }))
      }

    if(ores["Coal"].patch.size <= 344850 && !unlockables.drill2.isVisible){
    setUnlockables(prevUnlockables => ({
        ...prevUnlockables,
        drill2: { 
            ...prevUnlockables.drill2,
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

  }, [ores, unlockables, setUnlockables])

  // Function to increment the ore count
  const onIncrement = (oreName, toolName, manOrMachine) => {

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

  const isStorageFull = (itemName) => { 
    const currentStorage = siteCounts[itemName] || 0;
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
              siteCounts={siteCounts}
              setSiteCounts={setSiteCounts}
              updateSiteCounts={updateSiteCounts}
              networks={networks}
              setNetworks={setNetworks}
              lanes={lanes}
              setLanes={setLanes}
              debug={debug} 
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
                siteCounts={siteCounts}
                setSiteCounts={setSiteCounts}
                updateSiteCounts={updateSiteCounts}
                networks={networks}
                setNetworks={setNetworks}
                lanes={lanes}
                setLanes={setLanes}
                debug={debug} 
                onAlert={onAlert} />
            </div>
          )}
      </>
  )

}

export default ResourceSection