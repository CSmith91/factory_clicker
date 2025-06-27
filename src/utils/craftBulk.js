const bulkCheck = (bulkItemName) => {

    let totalCrafts = 5; // Attempt to craft 5x
    let successfulCrafts = 0;
    let allCrafts = '';
    let bulkRawCost = {};
    let bulkSurplus = {};
    let bulkHammerLoss = 0;
    let bulkGroupId = ''
  
    for (let i = 0; i < totalCrafts; i++) {
      // console.log(`Start of loop ${i+1}
      //   allCrafts: ${JSON.stringify(allCrafts)}
      //   bulkRawCost: ${JSON.stringify(bulkRawCost)}
      //   bulkSurplus: ${JSON.stringify(bulkSurplus)}
      //   bulkHammerLoss: ${JSON.stringify(bulkHammerLoss)}`)

      const result = checkCraft(bulkItemName, true); // return [true, ingredientName, groupId, rawCost, surplusList, hammerDeteriation]
      if (!result) {
        break;
      }

      const result2 = checkCraft(bulkItemName, true, bulkRawCost)
      if (!result2) {
        break;
      }

      // Call checkCraft to trigger crafting logic and deductions
      const [success, ingredientName, groupId, rawCost, surplusList, hammerDeteriation] = checkCraft(bulkItemName, true, bulkRawCost); // return [true, ingredientName, groupId, rawCost, surplusList, hammerDeteriation]
      if (!success) {
        break;
      }

      if(i === 0){
        bulkGroupId = groupId.split('--')[0];
      }

      let grouping = groupId.split('--')[0];

      // break if this loop would push the hammer beyond it's durability
      if(bulkHammerLoss + hammerDeteriation > tools['Hammer'].durability){
        break;
      }

      let canAdd = true;

      // Loop through rawCost but check beforehand if adding the amount would surpass the inventory limits
      for (const [resourceName, amountToAdd] of Object.entries(rawCost)) {
        // Check if the resource exists in ores or ingredients
        const inventoryItem = ores[resourceName] ? ores[resourceName] : ingredients[resourceName];
        
        // Use idleCount if available, otherwise use count
        const inventoryCount = inventoryItem.idleCount ? inventoryItem.idleCount : inventoryItem.count;
        //console.log(`^^^^^^inventoryCount for ${resourceName}: ${inventoryCount}`)

        // Calculate the current total (existing bulk amount + amountToAdd)
        const currentBulkAmount = bulkRawCost[resourceName] || 0;
        const totalAfterAddition = currentBulkAmount + amountToAdd;
        //console.log(`currentBulkAmount for ${resourceName}: ${currentBulkAmount}`)
        //console.log(`^^^^^^totalAfterAddition for ${resourceName}: ${totalAfterAddition}`)

        // If adding would exceed the inventory, break the loop
        if (totalAfterAddition > inventoryCount) {
          canAdd = false;
          break;
        }
      }

      if(!canAdd) break;

      // Loop through the rawCost and add to bulkRawCost  
      for (const [resource, amount] of Object.entries(rawCost)) {
        if (bulkRawCost[resource]) {
          bulkRawCost[resource] += amount;
        } else {
          bulkRawCost[resource] = amount;
        }
      }

      // Loop through the surplusList and add to bulkSurplus
      for (const [resource, amount] of Object.entries(surplusList)) {
        if (bulkSurplus[resource]) {
          bulkSurplus[resource] += amount;
        } else {
          bulkSurplus[resource] = amount;
        }
      }

      bulkHammerLoss += hammerDeteriation;
      //console.log(`bulkHammerLoss has been increased by ${hammerDeteriation} to ${bulkHammerLoss}`)
      allCrafts += grouping+'-';
      successfulCrafts++

      // lastly, we check bulkSurplus to see if we have an excess and can reduce the costs / crafts
      for (const [resourceName, surplusAmount] of Object.entries(bulkSurplus)) {
        let resource = ingredients[resourceName] ? ingredients[resourceName] : ores[resourceName];
        let multiplier = resource.multiplier || 1;

        if(surplusAmount >= multiplier){
          for (const [subResourceName, subAmount] of Object.entries(resource.cost)) {
            bulkRawCost[subResourceName] -= subAmount;
          }

          // Amend the bulkSurplus
          bulkSurplus[resourceName] -= [multiplier]
          // Amend hammer usage
          bulkHammerLoss -= 1* tools.Hammer.corrodeRate
          //console.log(`we have a surplus, so bulkHammerLoss has been decreased by ${tools.Hammer.corrodeRate} to ${bulkHammerLoss}`)
          
          // Remove the last instance of resourceName (plus hyphen) from allCrafts
          const resourceWithHyphen = resourceName + '-';
          const lastInstanceIndex = allCrafts.lastIndexOf(resourceWithHyphen); // Get the last occurrence of the resource

          if (lastInstanceIndex !== -1) {
            allCrafts = allCrafts.substring(0, lastInstanceIndex) + allCrafts.substring(lastInstanceIndex + resourceWithHyphen.length);
          }
        }
      }
    }

    // console.log(`Exited bulkSmartBuild:
    //   successfulCrafts: ${successfulCrafts}
    //   allCrafts: ${JSON.stringify(allCrafts)}
    //   bulkRawCost: ${JSON.stringify(bulkRawCost)}
    //   bulkSurplus: ${JSON.stringify(bulkSurplus)}
    //   bulkHammerLoss: ${JSON.stringify(bulkHammerLoss)}
    //   bulkGroupId: ${bulkGroupId}`)

    const stackedId = reorderBulk(allCrafts, bulkGroupId)
    //console.log(`stackedId: ${JSON.stringify(stackedId)}`)

    if(allCrafts){
      onCraft(bulkItemName, stackedId, bulkRawCost, bulkSurplus, bulkHammerLoss, successfulCrafts);
    }
    
  };

const reorderBulk = (allCrafts) => {
  // Remove the trailing hyphen and split the string into an array of items
  let craftsArray = allCrafts.slice(0, -1).split('-');

  // Create a map to store the items and their counts
  let craftsMap = new Map();

  // Count the occurrences of each item, maintaining the order of first appearance
  for (let item of craftsArray) {
    if (craftsMap.has(item)) {
      craftsMap.set(item, craftsMap.get(item) + 1);
    } else {
      craftsMap.set(item, 1);
    }
  }

  // Rebuild the string by repeating each item according to its count
  let newAllCrafts = '';
  for (let [item, count] of craftsMap) {
    newAllCrafts += (item + '-').repeat(count);
  }

  newAllCrafts += ('-'+ Date.now() + Math.random() + '__BULK')

  return newAllCrafts;
};

export { bulkCheck, reorderBulk }