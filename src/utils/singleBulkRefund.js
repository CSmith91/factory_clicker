// testing: bulk craft green chips and individually cancel, check how the queue is cancelled and check refund into inventory is correct
// repeat for red chips
// test bulk crafting green chips with PARTIAL amount of wire, forcing a less conventional bulk craft, then cancel and check results

const singleBulkRefundExt = (parentName, groupId, totalCost, leftover, otherFunctions) => {

    // Use otherFunctions to access functions from App.js
    const { ores, ingredients, tools, craftDeductions, deleteBulkQueueByOne } = otherFunctions;

    // this is what we need to cancel
    let cancelSum = JSON.parse(JSON.stringify(ingredients[parentName].cost));
    let cancelLeftover = leftover;
    let totalRefundPool = totalCost;
    const originalLeftover = JSON.parse(JSON.stringify(leftover));

    // this is what we used initially, so when cancelling, need to refund these items:
    // Step 1: Split the string at '--' to ignore everything after it
    const cleanString = groupId.split('--')[0];
    // Step 2: Split by hyphen to get each component
    const components = cleanString.split('-');
    // Step 3: Filter out duplicates using a Set to get unique names
    const componentArray = [...new Set(components)];    // this gives us an output like: ["Wire","Electronic Circuit"]

    // lets combine cancelSum and cancelLeftover to create: toCancel
    let toCancel = {...cancelSum}
    for (let key in cancelLeftover) {
        if (toCancel[key]) {
            toCancel[key] += cancelLeftover[key];
            cancelLeftover[key] -= cancelLeftover[key];
        } else {
            toCancel[key] = cancelLeftover[key];
        }
    }
    
    // console.log(`----------------------------------
    //   cancelling a single ${parentName} within a bulk craft
    //   toCancel: ${JSON.stringify(toCancel)} // note: this is the craft cost PLUS any leftovers
    //   groupId: ${groupId}
    //   totalRefundPool: ${JSON.stringify(totalRefundPool)}
    //   componentArray: ${JSON.stringify(componentArray)}
    //   cancelLeftover: ${JSON.stringify(cancelLeftover)}
    //   `)

    let rawRefund = {};     // we build up an object that details all the items we directly refund -- these are the raw ingredients, bypassing any intermediaries if we crafted THOSE from raw
    let hammerRefund = 0;   // the number of crafts we're undoing and hence undoing the 'wear' done to the hammer tool
    let queueCancel = {};   // we also build up an object that details the items (and their amount) we need to remove from the queue
    
    [totalRefundPool, cancelLeftover, rawRefund, hammerRefund, queueCancel] = smartRefund(componentArray, toCancel, cancelLeftover, totalRefundPool, rawRefund, hammerRefund, queueCancel, ores, ingredients)

    // console.log(`----------------------------------
    //     finished the single ${parentName} within a bulk craft
    //     cancelLeftover is now: ${JSON.stringify(cancelLeftover)}
    //     rawRefund is: ${JSON.stringify(rawRefund)}
    //     hammerRefund is: ${JSON.stringify(hammerRefund)}
    //     queueCancel is: ${JSON.stringify(queueCancel)}

    //     totalRefundPool is: ${JSON.stringify(totalRefundPool)}
    //     I think the issue might be when we have leftover items in the totalRefundPool when a bulk craft is completely cancelled (by individial cancels) for odd items.
    //     We keep the {"Wire": 1} and then lose it on cancellation. Therefore we need to add a check to see if the craft is been completely cancelled.
    //     `)

        // ---------------------------------- this is the end condition we want (all non-multi items are zero, so the multi items = 1 also need to equal 0, move the 1 multi item to rawRefund)
        // finished the single Electronic Circuit within a bulk craft
        // cancelLeftover is now: {"Wire":0}
        // rawRefund is: {"Wire":0,"Copper Plate":2,"Iron Plate":1}
        // hammerRefund is: 2
        // queueCancel is: {"Wire":4}

        // totalRefundPool is: {"Wire":0,"Copper Plate":0,"Iron Plate":0}
        // I think the issue might be when we have leftover items in the totalRefundPool when a bulk craft is completely cancelled (by individial cancels) for odd items.
        // We keep the {"Wire": 1} and then lose it on cancellation. Therefore we need to add a check to see if the craft is been completely cancelled

    const hammer_cost_per_item = tools['Hammer'].corrodeRate;
    hammerRefund = (hammerRefund+1) * hammer_cost_per_item;
    queueCancel[parentName] = (ingredients[parentName].multiplier || 1);

    // lastly we check if the leftover amount has changed, as this is uniquely affected in single-refund-from-bulk processes, specifically and limited to, the tempCount of that leftover item
    let oddCancel = {};

    // initialise all keys if not initialised, and set to zero
    for (let key in originalLeftover) {
        if (!cancelLeftover[key]) {
            cancelLeftover[key] = 0;
        }
    }

    // console.log(`
    //     originalLeftover: ${JSON.stringify(originalLeftover)}
    //     cancelLeftover: ${JSON.stringify(cancelLeftover)}
    //     `)

    if(JSON.stringify(originalLeftover) !== JSON.stringify(cancelLeftover)){
        for (let key in cancelLeftover) {
            oddCancel[key] = cancelLeftover[key];
        }

        for (let key in originalLeftover) {
            if (key in oddCancel) { // Check if the key exists in oddCancel
                oddCancel[key] -= originalLeftover[key];
            } else {
                oddCancel[key] = -originalLeftover[key];
            }
        }
    }

    // console.log(`
    //     originalLeftover: ${JSON.stringify(originalLeftover)}
    //     cancelLeftover: ${JSON.stringify(cancelLeftover)}
    //     oddCancel: ${JSON.stringify(oddCancel)}
    //     `)


    // refund the items, adjust the leftovers and refund the hammer
    console.log("You may be able to cancel the oddCancel parameter entry that goes into craft deductions if you find it can be set in deleteBulkQueueByOne instead!")
    craftDeductions(parentName, rawRefund, cancelLeftover, hammerRefund, true, 1);// oddCancel);

    // delete the items in the queue
    deleteBulkQueueByOne(parentName, groupId, rawRefund, cancelLeftover, hammerRefund, queueCancel, originalLeftover);

}

const smartRefund = (componentArray, cancelSum, cancelLeftover, totalCost, rawRefund, hammerRefund, queueCancel, ores, ingredients) => {
    // when rawRefund goes up, totalRefundPool goes down
    let totalRefundPool = JSON.parse(JSON.stringify(totalCost));

    // console.log(`We've called a new smartRefund loop. The cancelSum is: ${JSON.stringify(cancelSum)}`)

    Object.entries(cancelSum).forEach(([resourceName, amount]) => {
      let refundCountdown = amount;
      while(refundCountdown > 0){
        // console.log(`checking ${resourceName}`)
        if(ores[resourceName] || (ingredients[resourceName] && !ingredients[resourceName].isCraftable)){
          // straight refund
          cancelSum[resourceName] -= amount;
          refundCountdown -= amount;
          rawRefund[resourceName] ? rawRefund[resourceName] += amount : rawRefund[resourceName] = amount;
          totalRefundPool[resourceName] -= amount

        //   console.log(`${resourceName} is raw, so we add this without needing further checks.
        //     cancelSum is now: ${JSON.stringify(cancelSum)}
        //     rawRefund is now: ${JSON.stringify(rawRefund)}
        //     cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
        //     queueCancel is now: ${JSON.stringify(queueCancel)}
        //     hammerRefund is now: ${hammerRefund}
        //     totalRefundPool is now: ${JSON.stringify(totalRefundPool)}
        //     refundCountdown is: ${refundCountdown}
        //     `)
        }
        else if(ingredients[resourceName]){
            // console.log(`${resourceName} is an intermediary, so we need to check if we used it directly`)
            // this is an intermediary we need to covert back to it's raw item
            const multiplier = ingredients[resourceName].multiplier || 1;
            const subItems = JSON.parse(JSON.stringify(ingredients[resourceName].cost));

            // check if this ingredient was used directly
            if(componentArray.includes(resourceName)){
                // check if we need to break this down further
                if(!rawRefund[resourceName]){
                    rawRefund[resourceName] = 0
                }
                if(totalRefundPool[resourceName] && (rawRefund[resourceName] + multiplier) <= totalRefundPool[resourceName]){
                    console.log(`rawRefund[${resourceName}] is: ${rawRefund[resourceName]} and the totalRefundPool is greater, at: ${totalRefundPool[resourceName]}`)
                    if(multiplier > 1){
                        // We directly used this intermediary, but must be careful as this has a multiplier
                        cancelSum[resourceName] -= multiplier;
                        rawRefund[resourceName] += multiplier;
                        totalRefundPool[resourceName] -= multiplier;
                        refundCountdown -= multiplier;
                        // we dont refund in the queue as this was a direct refund, no?
                        // hammerRefund++;
                        // queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier;
                        
                        // check if we've refunded by the resource by too much (through the multiplier) if so, we add this as a leftover item and correct the refundCountdown
                        if(cancelSum[resourceName] < 0){
                            cancelLeftover[resourceName] += cancelSum[resourceName]
                            refundCountdown -= cancelSum[resourceName]
                        }
                        // console.log(`We directly used this intermediary, but must be careful as this has a multiplier:
                        //     cancelSum is now: ${JSON.stringify(cancelSum)}
                        //     rawRefund is now: ${JSON.stringify(rawRefund)}
                        //     cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
                        //     queueCancel is now: ${JSON.stringify(queueCancel)}
                        //     hammerRefund is now: ${hammerRefund}
                        //     totalRefundPool is now: ${JSON.stringify(totalRefundPool)}
                        //     refundCountdown is: ${refundCountdown}
                        //     `)
                    }
                    else{
                        // We used this intermediary directly. It had no multiplier, so it should be straight-forward
                        cancelSum[resourceName]--;
                        rawRefund[resourceName]++;
                        totalRefundPool[resourceName]--;
                        // we dont refund in the queue as this was a direct refund, no?
                        // hammerRefund++
                        // queueCancel[resourceName] ? queueCancel[resourceName]++ : queueCancel[resourceName] = 1
                        refundCountdown--

                        // console.log(`We used this intermediary directly. It had no multiplier, so it should be straight-forward:
                        //     cancelSum is now: ${JSON.stringify(cancelSum)}
                        //     rawRefund is now: ${JSON.stringify(rawRefund)}
                        //     cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
                        //     queueCancel is now: ${JSON.stringify(queueCancel)}
                        //     hammerRefund is now: ${hammerRefund}
                        //     totalRefundPool is now: ${JSON.stringify(totalRefundPool)}
                        //     refundCountdown is: ${refundCountdown}
                        //     `)
                    }
                } 
                // we DO need to break this down further
                else {
                    // pre-emptively add the hammerRefund and queueCancel as we then dig deeper
                    hammerRefund++
                    queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier;

                    // console.log(`rawRefund[${resourceName}] is: ${rawRefund[resourceName]} but the totalRefundPool[resourceName] is less than ${resourceName}'s multiplier: (${totalRefundPool[resourceName]} < ${multiplier}), so we must dig deeper.
                    //     We go to subItems of ${resourceName}, which is: ${JSON.stringify(subItems)}
                    //     Prior to this, we pre-emptively amend the hammerRefund (now ${hammerRefund}) and queueCancel (now ${JSON.stringify(queueCancel)})
                    //     `)
                    
                    const [newTotalRefundPool, newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = smartRefund(componentArray, subItems, cancelLeftover, totalRefundPool, rawRefund, hammerRefund, queueCancel, ores, ingredients)

                    cancelLeftover = newCancelLeftover;
                    rawRefund = newRawRefund;
                    hammerRefund = newHammerRefund;
                    queueCancel = newQueueCancel;
                    totalRefundPool = newTotalRefundPool;

                    cancelSum[resourceName] -= multiplier;
                    refundCountdown -= multiplier;
                }
                // now we double check if refundCountdown has gone negative -- if it has, we tweak the rawRefund, cancelLeftovers, hammerRefund and queueCancel
                if(refundCountdown < 0){
                    //console.log(`Our refundCountdown for ${resourceName} is negative (its: ${refundCountdown}), so we need to correct for this.`)
                    cancelSum[resourceName] -= refundCountdown;
                    cancelLeftover[resourceName] ? cancelLeftover[resourceName] -= refundCountdown : cancelLeftover[resourceName] = -refundCountdown;

                    // rawRefund: we need to decrease this, but we need to know HOW to decrease it, directly, indirectly -- HOW indirectly? 
                    // We're basing it on what already exists in rawRefund
                    if(rawRefund[resourceName] && rawRefund[resourceName] >= multiplier){
                        rawRefund[resourceName] -= multiplier;
                        //totalRefundPool[resourceName] += multiplier;
                    }
                    else {
                        for (const subItemName of Object.keys(subItems)) {
                            const subItemNameMultipler = ingredients[subItemName].multiplier || 1;
                            if (rawRefund[subItemName]) {
                                rawRefund[subItemName] -= subItemNameMultipler;
                                // if (totalRefundPool[subItemName]) {
                                //     totalRefundPool[subItemName]++;
                                // } else {
                                //     totalRefundPool[subItemName] = 1;
                                // }
                            }
                        }
                    }

                    hammerRefund--
                    queueCancel[resourceName] -= multiplier;
                    refundCountdown = 0;

                    // console.log(`correcting for our over-refund:
                    //     cancelSum: ${JSON.stringify(cancelSum)}     // this is what we've got left to cancel         
                    //     rawRefund: ${JSON.stringify(rawRefund)}
                    //     cancelLeftover: ${JSON.stringify(cancelLeftover)}
                    //     hammerRefund: ${JSON.stringify(hammerRefund)}
                    //     queueCancel: ${JSON.stringify(queueCancel)}
                    //     totalRefundPool: ${JSON.stringify(totalRefundPool)} // I DON'T KNOW IF THIS IS CORRECT, SO CHECK THIS

                    //     `)
                }
            }
            // we did not use the ingredient directly AND its not in our component list, so we know it needs to be broken down further
            else{
                // pre-emptively add the hammerRefund and queueCancel as we then dig deeper
                hammerRefund++
                queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier;

                // console.log(`We never used ${resourceName}] directly, so we must dig deeper.
                //     We go to subItems of ${resourceName}, which is: ${JSON.stringify(subItems)}
                //     Prior to this, we pre-emptively amend the hammerRefund (now ${hammerRefund}) and queueCancel (now ${JSON.stringify(queueCancel)})
                //     `)

                // break this down further
                const [newTotalRefundPool, newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = smartRefund(componentArray, subItems, cancelLeftover, totalRefundPool, rawRefund, hammerRefund, queueCancel, ores, ingredients)

                cancelLeftover = newCancelLeftover;
                rawRefund = newRawRefund;
                hammerRefund = newHammerRefund;
                queueCancel = newQueueCancel;
                totalRefundPool = newTotalRefundPool;

                cancelSum[resourceName] -= multiplier;
                hammerRefund++
                queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier;
                refundCountdown -= multiplier;

            }
        }
        else{
          console.error(`soemthing went wrong`);
          return false;
        }
      }
      //console.log(`We've completed the smartRefund loop for ${resourceName}. The cancelSum for this loop ends as: ${JSON.stringify(cancelSum)}`)
    })

    // console.log(`smartRefund returns:
    //     cancelSum: ${JSON.stringify(cancelSum)}
    //     cancelLeftover: ${JSON.stringify(cancelLeftover)}
    //     rawRefund: ${JSON.stringify(rawRefund)}
    //     hammerRefund: ${JSON.stringify(hammerRefund)}
    //     queueCancel: ${JSON.stringify(queueCancel)}
    //     totalRefundPool is now: ${JSON.stringify(totalRefundPool)}
    //     `)

    // we do a final check of leftovers, in the event that we have accrued enough to add this back into the pool (this happens when two odd-multiplier items are refunded, e.g. 2x green chips)
    Object.entries(cancelLeftover).forEach(([resourceName, amount]) => {
        if(ingredients[resourceName] && ingredients[resourceName].multiplier > 1 && ingredients[resourceName].multiplier <= amount){
            //const multiplier = ingredients[resourceName].multiplier
            const [newTotalRefundPool, newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = reverseLeftover(componentArray, cancelLeftover, totalRefundPool, rawRefund, hammerRefund, queueCancel, ores, ingredients);
            cancelLeftover = newCancelLeftover;
            rawRefund = newRawRefund;
            hammerRefund = newHammerRefund;
            queueCancel = newQueueCancel;
            totalRefundPool = newTotalRefundPool;
        }
    })

    return [totalRefundPool, cancelLeftover, rawRefund, hammerRefund, queueCancel]
}

const reverseLeftover = (componentArray, cancelLeftover, totalRefundPool, rawRefund, hammerRefund, queueCancel, ores, ingredients) => {
    // we've increased the cancelLefotver, so we now need to check if this has increased the leftover to the point of stacking this in the cancelQueue
    // console.log(`
    //     #
    //     #
    //     #
    //     We need to adjust the leftover as it has accrued to a full item
    //     cancelLeftover: ${JSON.stringify(cancelLeftover)}      
    //     rawRefund: ${JSON.stringify(rawRefund)}
    //     hammerRefund: ${JSON.stringify(hammerRefund)}
    //     queueCancel: ${JSON.stringify(queueCancel)}
    //     `)

    let cancelSum = cancelLeftover;
    const [newTotalRefundPool, newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = smartRefund(componentArray, cancelSum, {}, totalRefundPool, rawRefund, hammerRefund, queueCancel, ores, ingredients)

    cancelLeftover = newCancelLeftover;
    rawRefund = newRawRefund;
    hammerRefund = newHammerRefund; // we do not change the hammer refund in this reversal
    queueCancel = newQueueCancel;
    totalRefundPool = newTotalRefundPool;

    // console.log(`
    //     #
    //     #
    //     #
    //     We've adjusted the leftover as it has accrued to a full item, we get:
    //     cancelLeftover: ${JSON.stringify(cancelLeftover)}      
    //     rawRefund: ${JSON.stringify(rawRefund)}
    //     hammerRefund: ${JSON.stringify(hammerRefund)}
    //     queueCancel: ${JSON.stringify(queueCancel)}
    //     `)
    
    return [totalRefundPool, cancelLeftover, rawRefund, hammerRefund, queueCancel]
}

export default singleBulkRefundExt;