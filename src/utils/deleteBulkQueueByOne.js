const deleteBulkQueueByOneExt = (parentName, groupId, refund, leftover, hammerRefund, queueCancelList, previousLeftover, otherFunctions) => {

    const {ores, ingredients, setIngredients, setCraftQueue} = otherFunctions;

    console.log(`We're deleting an item in a bulk queue
        parentName: ${parentName}
        groupId: ${groupId}
        refund: ${JSON.stringify(refund)}
        leftover: ${JSON.stringify(leftover)}
        previousLeftover: ${JSON.stringify(previousLeftover)}
        hammerRefund: ${hammerRefund}
        queueCancelList: ${JSON.stringify(queueCancelList)}
    `)

    // this function updates the tempCount of the leftover item, if required.
    const leftoverFix = singleFromBulkLeftoverFix(previousLeftover, leftover, setIngredients)
    console.log(`leftoverFix: ${JSON.stringify(leftoverFix)}`)

    // remove the clicked item from the queue by id, and update the leftover, if required.
    // ######## DLETEE WHEN COMPLETE --- NEED TO ADD UPDATING THE item.leftover
        // we need to use:
                    // if(item.leftover[resourceName]) {
                // item.leftover[resourceName] += amount
                // }
                // else {
                // item.leftover[resourceName] = amount;
                // }
    setCraftQueue((prevQueue) => {
        //console.log(`prevQueue: ${JSON.stringify(prevQueue)}`)
  
        // Helper function to update the groupId
        const updateGroupId = (groupId, queueCancelList) => {
          // Split the groupId string by '-' to get an array of items
          let groupIdParts = groupId.split('-');
  
          // Remove items from the groupId based on the queueCancelList
          Object.keys(queueCancelList).forEach((itemName) => {
            const multiplier = ores[itemName] ? 1 : ingredients[itemName].multiplier ? ingredients[itemName].multiplier : 1;
            const countToRemove = queueCancelList[itemName] / multiplier;
            let countRemoved = 0;
  
            // Loop through groupIdParts and remove the items one by one
            groupIdParts = groupIdParts.filter((part) => {
                if (part === itemName && countRemoved < countToRemove) {
                    countRemoved++;
                    return false; // Remove this item
                }
                return true; // Keep this item
            });
        });
  
          // Rebuild the groupId string from the updated groupIdParts
          return groupIdParts.join('-');
        };

        let hasChanges = false; // Track if we make changes
  
        // Loop through the queue and process only the items matching the groupId
        const updatedQueue = prevQueue.map((item) => {
            if (item.groupId === groupId && item.queue > 0) {
                // Reduce the queue based on queueCancelList for matching items
                const cancelAmount = queueCancelList[item.ingredientName] || 0;
                const newQueueCount = item.queue - (cancelAmount / item.multiplier);
                const newMultiCraft = item.multiCraft - 1;
  
                // If the queue count goes to 0 or below, don't include this item
                if (newQueueCount <= 0) return null; // Will be filtered out later
  
                // Update the groupId by removing the items in queueCancelList
                const newGroupId = updateGroupId(item.groupId, queueCancelList);
  
                // Update hammerCost and totalCost
                const newHammerCost = item.hammerCost ? item.hammerCost - hammerRefund : null;
                const newTotalCost = item.totalCost ? Object.keys(item.totalCost).reduce((newCost, key) => {
                    newCost[key] = item.totalCost[key] - (refund[key] || 0);
                    return newCost;}, {}) : null;

                // Update the leftover if it exists, otherwise set to null
                const newLeftover = item.leftover 
                ? { ...item.leftover } // Create a shallow copy to avoid mutating the original
                : null;

                if (newLeftover) {
                    Object.entries(leftoverFix).forEach(([key, value]) => {
                        newLeftover[key] = (newLeftover[key] || 0) + value;
                    });
                }

                hasChanges = true;
  
                return {
                    ...item,
                    groupId: newGroupId,
                    multiCraft: newMultiCraft,
                    queue: Math.max(newQueueCount, 0), // Update queue count
                    leftover: newLeftover, // Update leftover
                    hammerCost: newHammerCost, // Update hammer cost
                    totalCost: newTotalCost, // Update total cost
                };
            }
            return item; // Leave non-matching items unchanged
        });

        if (!hasChanges) return prevQueue; // Prevent unnecessary updates
  
        // Filter out any items that were set to null (i.e., queue count reached 0)
        return updatedQueue.filter(item => item !== null);
      });

}

const singleFromBulkLeftoverFix = (previousLeftover, updatedLeftover, setIngredients) => {
    console.log(`JSON.stringify(previousLeftover): ${JSON.stringify(previousLeftover)} && JSON.stringify(updatedLeftover): ${JSON.stringify(updatedLeftover)}`)

    // lastly we check if the leftover amount has changed, as this is uniquely affected in single-refund-from-bulk processes, specifically and limited to, the tempCount of that leftover item
    let oddCancel = {};

    // initialise all keys if not initialised, and set to zero
    for (let key in previousLeftover) {
        if (!updatedLeftover[key]) {
            updatedLeftover[key] = 0;
        }
    }

    if(JSON.stringify(previousLeftover) !== JSON.stringify(updatedLeftover)){
        for (let key in updatedLeftover) {
            oddCancel[key] = updatedLeftover[key];
        }

        for (let key in previousLeftover) {
            if (key in oddCancel) { // Check if the key exists in oddCancel
                oddCancel[key] -= previousLeftover[key];
            } else {
                oddCancel[key] = -previousLeftover[key];
            }
        }
    }

    // Check if leftover is different. If so, update the leftover's tempCount
    setIngredients(prevIngredients => {
        const updatedIngredients = { ...prevIngredients };
        if(oddCancel && Object.keys(oddCancel).length > 0){
            Object.entries(oddCancel).forEach(([resourceName, amount]) => {
                if (updatedIngredients[resourceName]) {
                    updatedIngredients[resourceName] = {
                        ...updatedIngredients[resourceName],
                        tempCount: updatedIngredients[resourceName].tempCount + amount
                    };
                    console.log(`tempCount for ${resourceName} incremented by ${amount}.`)
                }
            });
        }
        return updatedIngredients;
    });

    return oddCancel;
}

// ORIGINAL THAT WORKS WITH CANCELLATION
// const deleteBulkQueueByOneExt = (parentName, groupId, refund, leftover, hammerRefund, queueCancelList, previousLeftover, otherFunctions) => {

//     const {ores, ingredients, setIngredients, setCraftQueue} = otherFunctions;

//     console.log(We're deleting an item in a bulk queue
//         parentName: ${parentName}
//         groupId: ${groupId}
//         refund: ${JSON.stringify(refund)}
//         leftover: ${JSON.stringify(leftover)}
//         previousLeftover: ${JSON.stringify(previousLeftover)}
//         hammerRefund: ${hammerRefund}
//         queueCancelList: ${JSON.stringify(queueCancelList)}
//     )

//     // remove the clicked item from the queue by id
//     setCraftQueue((prevQueue) => {
//         //console.log(prevQueue: ${JSON.stringify(prevQueue)})
  
//         // Helper function to update the groupId
//         const updateGroupId = (groupId, queueCancelList) => {
//           // Split the groupId string by '-' to get an array of items
//           let groupIdParts = groupId.split('-');
  
//           // Remove items from the groupId based on the queueCancelList
//           Object.keys(queueCancelList).forEach((itemName) => {
//             const multiplier = ores[itemName] ? 1 : ingredients[itemName].multiplier ? ingredients[itemName].multiplier : 1;
//             const countToRemove = queueCancelList[itemName] / multiplier;
//             let countRemoved = 0;
  
//             // Loop through groupIdParts and remove the items one by one
//             groupIdParts = groupIdParts.filter((part) => {
//                 if (part === itemName && countRemoved < countToRemove) {
//                     countRemoved++;
//                     return false; // Remove this item
//                 }
//                 return true; // Keep this item
//             });
//         });
  
//           // Rebuild the groupId string from the updated groupIdParts
//           return groupIdParts.join('-');
//         };
  
//         // Loop through the queue and process only the items matching the groupId
//         const updatedQueue = prevQueue.map((item) => {
//             if (item.groupId === groupId && item.queue > 0) {
//                 // Reduce the queue based on queueCancelList for matching items
//                 const cancelAmount = queueCancelList[item.ingredientName] || 0;
//                 const newQueueCount = item.queue - (cancelAmount / item.multiplier);
//                 const newMultiCraft = item.multiCraft - 1;
  
//                 // If the queue count goes to 0 or below, don't include this item
//                 if (newQueueCount <= 0) {
//                     return null; // Will be filtered out later
//                 }
  
//                 // Update the groupId by removing the items in queueCancelList
//                 const newGroupId = updateGroupId(item.groupId, queueCancelList);
  
//                 // Update hammerCost and totalCost
//                 const newHammerCost = item.hammerCost ? item.hammerCost - hammerRefund : null;
//                 const newTotalCost = item.totalCost
//                     ? Object.keys(item.totalCost).reduce((newCost, key) => {
//                           newCost[key] = item.totalCost[key] - (refund[key] || 0);
//                           return newCost;
//                       }, {})
//                     : null;
                
//                 console.log(JSON.stringify(previousLeftover): ${JSON.stringify(previousLeftover)} && JSON.stringify(leftover): ${JSON.stringify(leftover)})

//                 // lastly we check if the leftover amount has changed, as this is uniquely affected in single-refund-from-bulk processes, specifically and limited to, the tempCount of that leftover item
//                 let oddCancel = {};

//                 // initialise all keys if not initialised, and set to zero
//                 for (let key in previousLeftover) {
//                     if (!leftover[key]) {
//                         leftover[key] = 0;
//                     }
//                 }

//                 // console.log(
//                 //     originalLeftover: ${JSON.stringify(originalLeftover)}
//                 //     cancelLeftover: ${JSON.stringify(cancelLeftover)}
//                 //     )

//                 if(JSON.stringify(previousLeftover) !== JSON.stringify(leftover)){
//                     for (let key in leftover) {
//                         oddCancel[key] = leftover[key];
//                     }

//                     for (let key in previousLeftover) {
//                         if (key in oddCancel) { // Check if the key exists in oddCancel
//                             oddCancel[key] -= previousLeftover[key];
//                         } else {
//                             oddCancel[key] = -previousLeftover[key];
//                         }
//                     }
//                 }
  
//                 // Check if leftover is different and assign it to item.leftover
//                 setIngredients(prevIngredients => {
//                     const updatedIngredients = { ...prevIngredients };
//                     if(oddCancel && Object.keys(oddCancel).length > 0){
//                         Object.entries(oddCancel).forEach(([resourceName, amount]) => {
//                           if (updatedIngredients[resourceName]) {
//                             updatedIngredients[resourceName] = {
//                               ...updatedIngredients[resourceName],
//                               tempCount: updatedIngredients[resourceName].tempCount + amount
//                             };
//                           }
//                           if(item.leftover[resourceName]) {
//                             item.leftover[resourceName] += amount
//                           }
//                           else {
//                             item.leftover[resourceName] = amount;
//                           }
//                         });

//                         console.log(Refund leftover difference! item.leftover is now: ${JSON.stringify(item.leftover)})

//                     }

//                     return updatedIngredients;
//                 });

  
//                 return {
//                     ...item,
//                     groupId: newGroupId,
//                     multiCraft: newMultiCraft,
//                     queue: Math.max(newQueueCount, 0), // Update queue count
//                     leftover: leftover, // Update leftover
//                     hammerCost: newHammerCost, // Update hammer cost
//                     totalCost: newTotalCost, // Update total cost
//                 };
//             }
//             return item; // Leave non-matching items unchanged
//         });
  
//         // Filter out any items that were set to null (i.e., queue count reached 0)
//         return updatedQueue.filter(item => item !== null);
//       });

// }

export default deleteBulkQueueByOneExt