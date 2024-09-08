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

    if(ores["Coal"].patch.size <= 344970 && !unlockables.boiler.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            boiler: { 
              ...prevUnlockables.boiler,
              isVisible: true
            }
        }))
      }

    if(ores["Coal"].patch.size <= 344880 && !unlockables.drill2.isVisible){
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
  
//   // ###########################  BELT LOGIC
//   // ###########################  BELT LOGIC
//   // ###########################  BELT LOGIC

//   useEffect(() => {
//     Object.keys(ores).forEach(oreName => {
//         if (ores[oreName].patch !== undefined && ingredients["Transport Belt"].unlocked) {
//             checkBelts(oreName);
//         }
//     });

//     Object.keys(ingredients).forEach(ingredientName => {
//         if (ingredients[ingredientName].count !== undefined && ingredients["Transport Belt"].unlocked) {
//             checkBelts(ingredientName);
//         }
//     });
//   }, [ores, ingredients, lanes]);

//   // function for switching isRunning boolean for each lane
//   const updateLaneRunningState = (itemName, lane, isRunning) => {
//     setLanes(prevLanes => ({
//       ...prevLanes,
//       [itemName]: {
//         ...prevLanes[itemName],
//         [lane]: {
//           ...prevLanes[itemName][lane],
//           isRunning: isRunning,
//         },
//       },
//     }));
//   };

//   const checkBelts = (itemName) => {
//     const targetResource = ores[itemName] || ingredients[itemName];
//     const bankAmount = siteCounts[itemName]

//     // first, we check if there are any resources to move
//     if(bankAmount > 0){
//     // second, we check if the target storage has space (including tempCount!)
//       const totalCount = targetResource.count + targetResource.tempCount;

//       if(totalCount < getStorage(itemName)){
//         // lastly iterate through the bus. Any lanes that are active (and not already running) then trigger the payout

//         const bus = lanes[itemName]

//         Object.entries(bus).forEach(([lane, details]) => {
//           if (!details.isRunning && details.active) {
//             // we've found an available lane that is not already running!
//             updateLaneRunningState(itemName, lane, true);

//             // determine speed stat and animation image
//             const speed = details.speed;
//             const beltId = `belt-${itemName.replace(/\s+/g, '-')}-${lane}`;
//             const laneElement = document.querySelector(`#${beltId}`);
//             const flashClass = speed >= 5 ? 'flashing-fast' : speed >= 3 ? 'flashing-medium' : 'flashing-slow';
            
//             if (laneElement) {
//               // Determine which class to add based on the speed
//                laneElement.classList.add(flashClass);
//             }

//             // lastly, we start the actual moving-of-goods function
//             moveItemToBelt(itemName, lane, speed, laneElement, flashClass);
//           }
//           else if(details.isRunning && targetResource.tempCount > 0){
//             const speed = details.speed;
//             const beltId = `belt-${itemName.replace(/\s+/g, '-')}-${lane}`;
//             const laneElement = document.querySelector(`#${beltId}`);
//             const flashClass = speed >= 5 ? 'flashing-fast' : speed >= 3 ? 'flashing-medium' : 'flashing-slow';
//             turnOnBelt(itemName, lane, speed, laneElement, flashClass)
//           }
//         });
//         }
//       // else if(){
//       //   // this is to check if the tempCount has 'stuck' and we need to clear it
//       // }
//       else{
//         // storage is full
//       }
//     }
//     else{
//       // nothing to move
//     }
//   }

//   const moveItemToBelt = (itemName, lane, speed, laneElement, flashClass) => {
//     loadBelt(itemName) // tempCount +1 && outputCount -1
//     turnOnBelt(itemName, lane, speed, laneElement, flashClass);
//   };

//   const loadBelt = (itemName) => {
//     updateItemCounts(itemName, 0, 1); // Increment tempCount before processing

//     setSiteCounts(prevCounts => {
//         const newCount = Math.max(0, (prevCounts[itemName] || 0) - 1);
//         return { ...prevCounts, [itemName]: newCount };
//     });
//   }

//   const updateItemCounts = (itemName, countChange, tempCountChange) => {
//     const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
//     const updateState = oreOrIngredient === 'ore' ? setOres : setIngredients;
  
//     updateState(prevState => {
//         const updatedItem = {
//             ...prevState[itemName],
//             count: prevState[itemName].count + countChange,
//             tempCount: prevState[itemName].tempCount + tempCountChange
//         };
//         return {
//             ...prevState,
//             [itemName]: updatedItem
//         };
//     });
//   };

//   // turnOnBelt looks at the queue and fully processes it and loops back on itself if there's still items in its queue 
//   const turnOnBelt = (itemName, lane, speed, laneElement, flashClass) => {

//     // set the belt lane as running
//     updateLaneRunningState(itemName, lane, true);

//     // check if we have any items in the queue
//     const throughput = 1000 / speed

//     setTimeout(() => {
//       const updatedItem = ores[itemName] ? ores[itemName] : ingredients[itemName];
//       if(updatedItem.tempCount > 0){
//         console.log(`updatedItem.tempCount is ${updatedItem.tempCount}`)
//         updateItemCounts(itemName, 1, -1); // Payout - add item.count and remove item.tempCount
//       }
//       // now lets check there are no more tempCounts
//       if(updatedItem.tempCount === 0){
//         // the queue is empty. Set belt's isRunning to false, and stop animation
//         updateLaneRunningState(itemName, lane, false);

//         if (laneElement) {
//           // Remove flashing effect
//           laneElement.classList.remove(flashClass);
//         }
//         else{
//           console.error(`No laneElement found with beltId`);
//         }
//       } 
//     }, (throughput))  

//   };

//   // this useEffect keeps us looping within the same belt lane if there is more tempCounts to drop-off
//   // this does NOT check all belts, like the other useEffect does
//   // useEffect(() => {
//   //   Object.keys(ores).forEach(itemName => {
//   //     if (ores[itemName].patch !== undefined && ingredients["Transport Belt"].unlocked) {
//   //       const bus = lanes[itemName]

//   //       if(bus){
//   //         Object.entries(bus).forEach(([lane, details]) => {
//   //           if (details.isRunning) {
//   //             // determine speed stat and animation image
//   //             const speed = details.speed;
//   //             const beltId = `belt-${itemName.replace(/\s+/g, '-')}-${lane}`;
//   //             const laneElement = document.querySelector(`#${beltId}`);
//   //             const flashClass = speed >= 5 ? 'flashing-fast' : speed >= 3 ? 'flashing-medium' : 'flashing-slow';
//   //             setTimeout(() => {
//   //               turnOnBelt(itemName, lane, speed, laneElement, flashClass)
//   //             }, 1000 / speed)
//   //           }
//   //         });
//   //       }
//   //     }
//   //   });

//   //   Object.keys(ingredients).forEach(itemName => {
//   //       if (ingredients[itemName].count !== undefined && ingredients["Transport Belt"].unlocked) {
//   //         const bus = lanes[itemName]

//   //         if(bus){
//   //           Object.entries(bus).forEach(([lane, details]) => {
//   //             if (details.isRunning) {
//   //               // determine speed stat and animation image
//   //               const speed = details.speed;
//   //               const beltId = `belt-${itemName.replace(/\s+/g, '-')}-${lane}`;
//   //               const laneElement = document.querySelector(`#${beltId}`);
//   //               const flashClass = speed >= 5 ? 'flashing-fast' : speed >= 3 ? 'flashing-medium' : 'flashing-slow';
//   //               setTimeout(() => {
//   //                 turnOnBelt(itemName, lane, speed, laneElement, flashClass)
//   //               }, 1000 / speed)
//   //             }
//   //           });
//   //         }
//   //       }
//   //   })
//   // }, [ores, ingredients, siteCounts])

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