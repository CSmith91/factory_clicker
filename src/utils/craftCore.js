// Function for crafting
const checkCraft = (ingredientName, bulkCheck, bulkDebt) => {
    const toolName = ingredients[ingredientName] ? 'Hammer' : null;
    const items = ingredients[ingredientName] ? ingredients : networks;
    const item = items[ingredientName]
    const totalCount = item.count + item.tempCount

    if (!item || !item.cost) return;

    if(totalCount >= getStorage(ingredientName)){
      if(toolName){
        onAlert(`Storage is full. You cannot craft ${ingredientName}.`);
      }
      else{
        onAlert(`You've reached the max number of lanes for ${ingredientName}.`);
      }
      return; // Exit the function if storage is full
    }

    // Check if the hammer has durability
    if(toolName){
      const tool = tools[toolName];
      if (!tool || tool.durability <= 0) {
          onAlert(`Your ${toolName} is broken. You cannot craft ${ingredientName}.`);
          return; // Exit the function if the tool is broken
      }
    }

    const smartBuild = (ingredientName, outstandingItems, bulkDebt = {}, buildList = '', overBuild = {}, costList = {}) => {
      //console.log(`checking: ${JSON.stringify(ingredientName)}, which has a cost of ${JSON.stringify(outstandingItems)}`)
      let reduceItems = JSON.parse(JSON.stringify(outstandingItems)); // Make a deep copy of outstandingItems // {"Wire":3,"Iron Plate":1}
      
      // here we build a list of all the things we need. We loop continuously until we get to raw ingredients (or get a 'no'), and builds this list along the way
      for (const [resourceName, amountRequired] of Object.entries(reduceItems)) {
        const resource = ores[resourceName] || ingredients[resourceName];
        const multiplier = resource.multiplier || 1;
        let reduceCount = amountRequired;
        let availableCount = resource.isMachine ?  resource.idleCount : resource.count;
        let floatingCount = resource.tempCount < 0 ? resource.tempCount : 0;
        let fullCount = availableCount + floatingCount;

        // first, we deduct costList from fullCount
        if(costList[resourceName]){
          fullCount -= costList[resourceName]
          //console.log(`we've tweaked fullCount as we've used ${resourceName} already. We now have ${fullCount} remaining.`)
        }
        // we do another deduction with this is part of a bulk craft
        if(bulkDebt && bulkDebt[resourceName]){
          fullCount -= bulkDebt[resourceName]
          //console.log(`we've tweaked fullCount as we've used ${resourceName} in an ongoing bulk craft. We now have ${fullCount} remaining.`)
        }

        // console.log(`
        //   ${resourceName}
        //   availableCount is: ${availableCount}
        //   floatingCount is: ${floatingCount}
        // ***fullCount is: ${fullCount}***
        //   reduceCount: ${reduceCount}
        //   amountRequired: ${amountRequired}
        //   costList: ${JSON.stringify(costList)}
        //   overBuild: ${JSON.stringify(overBuild)}
        //   `)

        while(reduceCount > 0){
          // Check if we have this ingredient directly, in full
          if (fullCount >= amountRequired) {
            // Reduce the reduceCount
            reduceCount = 0;
            // Remove the item from reduceItems
            reduceItems[resourceName] -= amountRequired;
            costList[resourceName] = (costList[resourceName] || 0) + amountRequired;
            //console.log(`We have ${resourceName} in full, so we can reduce the reduceCount of ${resourceName} to ${reduceCount}. CostList is now: ${JSON.stringify(costList)} ReduceItems is now: ${JSON.stringify(reduceItems)}`);
            
          }
          // Check if we have this ingredient directly, in part
          else if (fullCount >= 1) {
            //console.log(`We have ${fullCount} ${resourceName}(s), so we can reduce the reduceCount of ${resourceName}`)
            // Reduce the reduceCount
            reduceCount -= fullCount;
            reduceItems[resourceName] -= fullCount;
            costList[resourceName] = (costList[resourceName] || 0) + fullCount;

            // reduce fullCount as we've now used one of the items
            fullCount -= costList[resourceName]
            //console.log(`After usage, we have ${fullCount} ${resourceName}(s). We can reduce the reduceCount of ${resourceName} to ${reduceCount}. ReduceItems is now: ${JSON.stringify(reduceItems)}`);
          } 
          // if we don't have (any more of) the resource directly, check if we can craft it instead         
          else if(!resource.isCraftable || ores[resourceName]){
            //console.log(`We can't craft ${resourceName}, which we need, so we must stop`);
            return [false, false, false]; // Return an array indicating failure
          }
          // now check if we can do a smart craft of this item
          else{
            buildList = `${resourceName}-`+buildList
            //console.log(`We don't have ${resourceName}, so buildList is now: ${JSON.stringify(buildList)}`);

            // Make a deep copy of resource.cost to avoid mutation
            const newCost = JSON.parse(JSON.stringify(resource.cost));
            //console.log(`Cost for ${resourceName} is: ${JSON.stringify(newCost)}`);

            // Recursive call to smartBuild for the current resource
            const [newBuildList, newOverBuild, newCostList] = smartBuild(resourceName, newCost, bulkDebt, buildList, overBuild, costList)
            
            // If we failed to craft, return false
            if (!newBuildList) return [false, false, false];

            // Otherwise, update the lists
            buildList = newBuildList;
            overBuild = newOverBuild;
            costList = newCostList;
        
            // otherwise, we've got enough for 1 of the item, so we reduce the reducer
            reduceCount -= multiplier;
            reduceItems[resourceName] -= multiplier;

            //console.log(`We've wrangled ${multiplier} ${resourceName}, so we can reduce the reduceCount to ${reduceCount}. ReduceItems is now: ${JSON.stringify(reduceItems)}`);

            // if we've wrangled more ingredients that we need, so we carry this forward
            if (reduceCount < 0) {
              overBuild[resourceName] = (overBuild[resourceName] || 0) - reduceCount;
              //console.log(`we have overBuild as: ${JSON.stringify(overBuild)} and our buildList is: ${buildList}`)
              if(overBuild[resourceName] >= multiplier){
                //console.log(`We've over-built enough ${resourceName} to reduce our costList`);
                for (const [resourceName, amountRequired] of Object.entries(resource.cost)) {
                  costList[resourceName] -= amountRequired;
                }

                // Correct the overBuild
                overBuild[resourceName] -= [multiplier]
                
                // Remove 1 instance of resourceName (plus hyphen) from the front of buildList
                const resourceWithHyphen = resourceName + '-';
                const firstInstanceIndex = buildList.indexOf(resourceWithHyphen);

                if (firstInstanceIndex !== -1) {
                  buildList = buildList.substring(0, firstInstanceIndex) + buildList.substring(firstInstanceIndex + resourceWithHyphen.length);
                }
                //console.log(`we've corrected the overBuild, leaving us with overBuild as: ${JSON.stringify(overBuild)}, costList as: ${JSON.stringify(costList)} and buildList is: ${buildList}`)
              }
            }
          }
        }
      }
      // Return after all items are processed
      return [buildList, overBuild, costList];
    }

    const smartCost = (cleanRawCost) => {
      for (const [itemName, itemAmount] of Object.entries(cleanRawCost)){
        const item = ores[itemName] ? ores[itemName] : ingredients[itemName];
        if(item.count < itemAmount){
          return false
        }
      }
      return true;
    }

    const checkHammer = (cleanList, toolName) => {
      // Count the number of hyphens in the string
      let hyphenCount = (cleanList.match(/-/g) || []).length;

      // Add 1 to the hyphen count (as specified)
      let totalOperations = hyphenCount + 1;

      // Retrieve the tool's corrodeRate and durability
      let corrodeRate = tools[toolName]?.corrodeRate || 0;
      let durability = tools[toolName]?.durability || 0;

      // Calculate how much durability is required for the operation
      let durabilityRequired = corrodeRate * totalOperations;
      let finalCondition = durability - durabilityRequired

      // console.log(`---checkHammer---
      //   totalOperations: ${totalOperations} for ${cleanList}
      //   corrodeRate = ${corrodeRate}
      //   durabilityRequired: ${totalOperations} x ${corrodeRate} = ${durabilityRequired}
      //   `)

      // Check if the tool has enough durability
      if (finalCondition > 0) {
        return durabilityRequired;  // Return cost if the tool has enough durability
      } else {
        return false; // Return false if the tool doesn't have enough durability
      }
    }

    // now we build our craft list - what we need
    const [craftList, surplusList, rawCost] = smartBuild(ingredientName, item.cost, bulkDebt)

    // console.log(`craftList: ${JSON.stringify(craftList)}
    // surplusList: ${JSON.stringify(surplusList)}
    // rawCost: ${JSON.stringify(rawCost)}`)

    // this should only catch missing RAW items (like plastic). Potential issue with this is that we might be 1 wire short but we have over-crafted 2 wire before cleanBuild kicks in
    if(craftList === false){
      onAlert(`Not enough resources to craft ${ingredientName}.`)
      return
    }

    // check we have enough raw ingredients
    const canAfford = smartCost(rawCost)
    if(!canAfford){
      onAlert(`Not enough resources to craft ${ingredientName}.`)
      return
    }

    // check our hammer can craft all these items without breaking
    const hammerDeteriation = checkHammer(craftList, toolName)

    if(!hammerDeteriation){
      onAlert(`Your hammer will break before crafting ${ingredientName}. Either repair it or craft more intermediary ingredients.`)
      return
    }

    // we setup a group ID for this craft. Items that require specific children will get a specific ID
    const groupId = `${craftList}${ingredientName}--${Date.now() + Math.random()}`;
    //console.log(`groupId is: ${JSON.stringify(groupId)}`)

    // we've built up a groupId and array for our craft execution order
    // if this was a 5x craft, we feed this info here:
    if(bulkCheck){
      return [true, ingredientName, groupId, rawCost, surplusList, hammerDeteriation]
    }
    else{
      onCraft(ingredientName, groupId, rawCost, surplusList, hammerDeteriation, false);  // Pass groupId to ensure grouping
    }
};

const craftDeductions = (itemName, totalCost, leftover, hammerCost, reverse, multiCraft = 1, oddCancel = {}) => {
    // multiCraft is ONLY used incrementing tempCount for the final item
    const operation = reverse ? -1 : 1;  // If reverse is true, we add; if false, we subtract

    // Update the hammer's durability, if applicable
    if(ingredients[itemName]){
      setTools(prevTools => {
          const toolName = "Hammer"
          const tool = prevTools[toolName];
          const updatedDurability = tool.durability - operation * hammerCost;
          return {
              ...prevTools,
              [toolName]: {
                  ...tool,
                  durability: Math.max(0, updatedDurability)
              }
          };
      });
    }

    // deducts costs
    Object.entries(totalCost).forEach(([resourceName, amountRequired]) => {
      if(ores[resourceName]){
        setOres(prevIngredients => ({
          ...prevIngredients,
          [resourceName]: {
            ...prevIngredients[resourceName],
            count: prevIngredients[resourceName].count - operation * amountRequired
          }
        }));
      }
      else if(ingredients[resourceName].isMachine){
        setIngredients(prevIngredients => ({
          ...prevIngredients,
          [resourceName]: {
            ...prevIngredients[resourceName],
            count: prevIngredients[resourceName].count - operation * amountRequired,
            idleCount: prevIngredients[resourceName].idleCount - operation * amountRequired,
          }
        }));
      }
      else{
        setIngredients(prevIngredients => ({
          ...prevIngredients,
          [resourceName]: {
            ...prevIngredients[resourceName],
            count: prevIngredients[resourceName].count - operation * amountRequired
          }
        }));
      }
    })

    const multiplier = ingredients[itemName].multiplier || 1;
    const tempAdder = multiCraft > 1 ? (operation * multiplier * multiCraft) : operation * multiplier

    // Reserve storage space for the item we're crafting, as well as any leftovers
    setIngredients(prevIngredients => {
      const updatedIngredients = { ...prevIngredients };
    
      // Increment the tempCount for itemName
      updatedIngredients[itemName] = {
        ...updatedIngredients[itemName],
        tempCount: updatedIngredients[itemName].tempCount + tempAdder
      };

      // this covers single-refund-from-bulk when the leftover is assymmetric (i.e. green chips take 3 wire, which has a multiplier of two)
      if(oddCancel && Object.keys(oddCancel).length > 0){
        Object.entries(oddCancel).forEach(([resourceName, amount]) => {
          if (updatedIngredients[resourceName]) {
            updatedIngredients[resourceName] = {
              ...updatedIngredients[resourceName],
              tempCount: updatedIngredients[resourceName].tempCount + amount
            };
          }
        });
      }
      else{
        // Iterate through the leftover object and increment the tempCount for each resource
        Object.entries(leftover).forEach(([resourceName, amount]) => {
          if (updatedIngredients[resourceName]) {
            updatedIngredients[resourceName] = {
              ...updatedIngredients[resourceName],
              tempCount: updatedIngredients[resourceName].tempCount + operation * amount
            };
          }
        });
      }
    
      return updatedIngredients;
    });

    setNetworks(prevNetworks => {
      const updatedNetworks = { ...prevNetworks };
      if (updatedNetworks[itemName]) {
        updatedNetworks[itemName].tempCount -= operation;
      }
      return updatedNetworks;
    });
}

const onCraft = (itemName, groupId, totalCost, leftover, hammerCost, multiCraft) => {

    // console.log(`onCraft
    // itemName is: ${JSON.stringify(itemName)}
    // groupId is: ${JSON.stringify(groupId)}
    // totalCost is: ${JSON.stringify(totalCost)}
    // leftover is: ${JSON.stringify(leftover)}
    // hammer goes down to: ${JSON.stringify(hammerCost)}
    // bulk: ${JSON.stringify(bulk)}`)

    craftDeductions(itemName, totalCost, leftover, hammerCost, false, multiCraft);

    // we now send the instructions to onCraft
    const buildCraftArray = (groupId, totalCost, hammerCost) => {
      // Split by '--' to remove the timestamp part
      const splitParts = groupId.split('--');
      
      // The first part before '--' is the list of resources
      const resourceString = splitParts[0];
      
      // Split the resource string by '-' to get individual items
      const splitGroup = resourceString.split('-').filter(Boolean); // Filter to remove empty items if any

      let craftArray = [];

      // Find the last unique resource name
      const lastItem = splitGroup[splitGroup.length - 1];

      // Iterate through the split array
      for (let i = 0; i < splitGroup.length; i++) {
        const resourceName = splitGroup[i];

        // Check if resourceName exists in ingredients
        if (ingredients[resourceName]) {
          const multiplier = ingredients[resourceName].multiplier || 1;

          // Check if the resourceName is the last item (mark all occurrences of the last unique item as 'null')
          if (resourceName === lastItem) {
            craftArray.push([resourceName, ingredients[resourceName], multiplier, null, groupId, totalCost, hammerCost]);
          } else {
            craftArray.push([resourceName, ingredients[resourceName], multiplier, 'child', groupId, totalCost, hammerCost]);
          }
        }
      }

      return craftArray;
    };

    const craftArray = buildCraftArray(groupId, totalCost, hammerCost);

    // note: child items dont get crafted, but are passed to addToCraftQueue to denote which items are being crafted as intermediaries
    craftArray.forEach(craftItem => {
      const [itemName, item, multiplier, child, groupId, totalCost, hammerCost] = craftItem
      addToCraftQueue(itemName, item, multiplier, child, groupId, leftover, totalCost, hammerCost, multiCraft)
    })

    if(leftover){
      Object.entries(leftover).forEach(([resourceName, amount]) => {
        const item = ores[resourceName] ? ores[resourceName] : ingredients[resourceName];
        addToCraftQueue(resourceName, item, amount, 'leftover', groupId, leftover, null, null, null)
      })
    }
    
};

export { checkCraft, craftDeductions, onCraft }