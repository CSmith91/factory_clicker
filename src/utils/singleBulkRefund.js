// testing: bulk craft green chips and individually cancel, check how the queue is cancelled and check refund into inventory is correct
// repeat for red chips
// test bulk crafting green chips with PARTIAL amount of wire, forcing a less conventional bulk craft, then cancel and check results

const singleBulkRefundExt = (parentName, groupId, totalCost, leftover, otherFunctions) => {

    // Use otherFunctions to access functions from App.js
    const { ores, ingredients, tools, craftDeductions, deleteBulkQueueByOne } = otherFunctions;

    // this is what we need to cancel
    let cancelSum = JSON.parse(JSON.stringify(ingredients[parentName].cost));
    let cancelLeftover = leftover;

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
    
    console.log(`----------------------------------
      cancelling a single ${parentName} within a bulk craft
      toCancel: ${JSON.stringify(toCancel)} // note: this is the craft cost PLUS any leftovers
      groupId: ${groupId}
      totalCost: ${JSON.stringify(totalCost)}
      componentArray: ${JSON.stringify(componentArray)}
      `)

    let rawRefund = {};     // we build up an object that details all the items we directly refund -- these are the raw ingredients, bypassing any intermediaries if we crafted THOSE from raw
    let hammerRefund = 0;   // the number of crafts we're undoing and hence undoing the 'wear' done to the hammer tool
    let queueCancel = {};   // we also build up an object that details the items (and their amount) we need to remove from the queue
    //const objectData = { ores, ingredients } // this data set is passed to our smartRefund function, stemming from the original app code
    
    [cancelLeftover, rawRefund, hammerRefund, queueCancel] = smartRefund(componentArray, toCancel, cancelLeftover, totalCost, rawRefund, hammerRefund, queueCancel, ores, ingredients)

    console.log(`----------------------------------
        finished the single ${parentName} within a bulk craft
        cancelLeftover is now: ${JSON.stringify(cancelLeftover)}
        rawRefund is: ${JSON.stringify(rawRefund)}
        hammerRefund is: ${JSON.stringify(hammerRefund)}
        queueCancel is: ${JSON.stringify(queueCancel)}
        `)

    // #########################################################################################################################################################################
    // #########################################################################################################################################################################
    // #########################################################################################################################################################################
    // #########################################################################################################################################################################

    // const smartRefund = (componentArray, cancelSum, cancelLeftover, totalCost, rawRefund = {}, hammerRefund = 0, queueCancel = {}) => {

    //   Object.entries(cancelSum).forEach(([resourceName, amount]) => {
    //     let refundCountdown = amount;
    //     while(refundCountdown > 0){
    //       //console.log(`checking ${resourceName}`)
    //       if(ores[resourceName] || (ingredients[resourceName] && !ingredients[resourceName].isCraftable)){
    //         // straight refund
    //         cancelSum[resourceName] -= amount;
    //         refundCountdown -= amount;
    //         rawRefund[resourceName] ? rawRefund[resourceName] += amount : rawRefund[resourceName] = amount;
    //         // console.log(`${resourceName} is raw, so we add this.
    //         //   cancelSum is now: ${JSON.stringify(cancelSum)}
    //         //   rawRefund is now: ${JSON.stringify(rawRefund)}
    //         //   cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
    //         //   queueCancel is now: ${JSON.stringify(queueCancel)}
    //         //   hammerRefund is now: ${hammerRefund}
    //         //   refundCountdown is: ${refundCountdown}
    //         //   `)
    //       }
    //       else if(ingredients[resourceName]){
    //         // this is an intermediary we need to covert back to it's raw item
    //         const multiplier = ingredients[resourceName].multiplier || 1;
    //         const subItems = JSON.parse(JSON.stringify(ingredients[resourceName].cost));
    //         if(componentArray.includes(resourceName)){
    //           // check if we need to break this down further
    //           if(totalCost[resourceName] && rawRefund[resourceName] < totalCost[resourceName]){
    //             //console.log(`rawRefund[${resourceName}] is: ${rawRefund[resourceName]} and the totalCost[] is greater, at: ${totalCost[resourceName]}`)
    //             if(multiplier > 1){
    //               //console.log(`We are crafting this intermediary, but must be careful as this has a multiplier`)
    //               cancelSum[resourceName] -= multiplier
    //               refundCountdown -= multiplier
    //               hammerRefund++
    //               queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier
    //               if(cancelSum[resourceName] < 0){
    //                 cancelLeftover[resourceName] -= cancelSum[resourceName]
    //                 refundCountdown -= cancelSum[resourceName]
    //               }
    //             }
    //             else{
    //               //console.log(`We are crafting this intermediary with no multiplier`)
    //               cancelSum[resourceName] -= 1
    //               hammerRefund++
    //               queueCancel[resourceName] ? queueCancel[resourceName]++ : queueCancel[resourceName] = 1
    //               refundCountdown--
    //             }
    //           }
    //           else{
    //             //console.log(`rawRefund[${resourceName}] is: ${rawRefund[resourceName]} and the totalCost[resourceName] is less, at: ${totalCost[resourceName]}, so we must dig deeper, to subItems, which is: ${JSON.stringify(subItems)}`)
    //             const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = smartRefund(componentArray, subItems, cancelLeftover, totalCost, rawRefund, hammerRefund, queueCancel)

    //             cancelLeftover = newCancelLeftover;
    //             rawRefund = newRawRefund;
    //             hammerRefund = newHammerRefund;
    //             queueCancel = newQueueCancel;

    //             cancelSum[resourceName] -= multiplier;
    //             hammerRefund++
    //             queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier;
    //             refundCountdown -= multiplier;

    //           }
    //           // now we double check if refundCountdown has gone negative -- if it has, we tweak the rawRefund, cancelLeftovers and queueCancel
    //           if(refundCountdown < 0){
    //             //console.log(`Our refundCountdown is negative, so we need to correct for this`)
    //             cancelSum[resourceName] -= refundCountdown;
    //             cancelLeftover[resourceName] ? cancelLeftover[resourceName] -= refundCountdown : cancelLeftover[resourceName] = -refundCountdown;
    //             refundCountdown = 0;
    //           }

    //           // console.log(`----Reducing ${resourceName}----
    //           //   cancelSum is now: ${JSON.stringify(cancelSum)}
    //           //   rawRefund is now: ${JSON.stringify(rawRefund)}
    //           //   cancelLeftovers is: ${JSON.stringify(cancelLeftover)} // remember, this is independant of queueCancel, it's ascertaining where refunds are to be assigned.
    //           //   queueCancel is now: ${JSON.stringify(queueCancel)}
    //           //   hammerRefund is now: ${hammerRefund}
    //           //   refundCountdown is: ${refundCountdown}
    //           //   `)
    //         }
    //         else{
    //           //console.log(`We didn't use ${resourceName} directly, we made it from other components, so we need to dig deeper.`)
    //           // break this down further
    //           const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = smartRefund(componentArray, subItems, cancelLeftover, totalCost, rawRefund, hammerRefund, queueCancel)

    //           cancelLeftover = newCancelLeftover;
    //           rawRefund = newRawRefund;
    //           hammerRefund = newHammerRefund;
    //           queueCancel = newQueueCancel;

    //           cancelSum[resourceName] -= multiplier;
    //           hammerRefund++
    //           queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier;
    //           refundCountdown -= multiplier;

    //         }
    //       }
    //       else{
    //         console.error(`soemthing went wrong`);
    //         return false;
    //       }
    //     }
    //   })

    // #########################################################################################################################################################################
    // #########################################################################################################################################################################
    // #########################################################################################################################################################################
    // #########################################################################################################################################################################

    //   const cleanBulkRefund = (cancelLeftover, rawRefund, hammerRefund, queueCancel, totalCost, reimburse = null, finalCheck = false) => {
    //     let objectToClean = reimburse ? reimburse : cancelLeftover;
    //     Object.entries(objectToClean).forEach(([resourceName, amount]) => {
    //       const subItem = ingredients[resourceName] ? ingredients[resourceName] : ores[resourceName]
    //       const multiplier = ingredients[resourceName] ? ingredients[resourceName].multiplier || 1 : 1
    //       console.log(`Checking object ${JSON.stringify(objectToClean)}, Multiplier is: ${multiplier} && amount is: ${amount} && finalCheck is ${finalCheck}. If there's a match, we'll initiate cleanBulkRefund`);
    //       if(!finalCheck && amount >= multiplier){
    //         console.log(` ######## cleanBulkRefund ########
    //           We have leftovers (${resourceName}) that can be reduced. We're working on ${JSON.stringify(objectToClean)}. Reimburse is: ${JSON.stringify(reimburse)}
    //           cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
    //           queueCancel is: ${JSON.stringify(queueCancel)}
    //           hammerRefund is: ${hammerRefund}
    //           rawRefund is: ${JSON.stringify(rawRefund)}
    //           totalCost is: ${JSON.stringify(totalCost)}
    //           ------
    //           `)

    //         // reduce cancelLeftover
    //         console.log(`check if "${resourceName}" is in reimburse (and that we're in reimburse!)`)
    //         if(!reimburse){
    //           console.log(`We are on the top layer. cancelLeftover[${resourceName}] is: ${JSON.stringify(cancelLeftover[resourceName])}`)
    //           cancelLeftover[resourceName] -= multiplier;
    //           hammerRefund--
    //           console.log(`cancelLeftover[${resourceName}] is now: ${cancelLeftover[resourceName]} and hammerRefund is: ${hammerRefund}`)
    //         }
    //         else if(reimburse && reimburse[resourceName]){
    //           console.log(`${resourceName} *is* in the reimburse (and we're therefore a level down). reimburse is: ${JSON.stringify(reimburse)}`)
    //           reimburse[resourceName] -= multiplier;
    //           hammerRefund--
    //           console.log(`reimburse is now: ${JSON.stringify(reimburse)} and hammerRefund is: ${hammerRefund}`)
    //         }
    //         else{
    //           console.info(`we're a level down, but the item isn't in reimburse!`)
    //         }


    //         console.log(`Check if we can directly refund ${resourceName} by seeing if it's in both the rawRefund && totalCost`)
    //         if(rawRefund[resourceName] && totalCost[resourceName]){
    //           //  THIS SECTION WORKS FOR RED CHIPS, BUT NOT FOR GREEN. IF REMOVED, WE GET THE OPPOSITE --
    //           console.log(`It is! rawRefund[${resourceName}] is: ${rawRefund[resourceName]}
    //             ObjectToClean is: ${JSON.stringify(objectToClean)} 
    //             cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
    //             queueCancel is: ${JSON.stringify(queueCancel)}
    //             hammerRefund is: ${hammerRefund}
    //             rawRefund is: ${JSON.stringify(rawRefund)}
    //             totalCost is: ${JSON.stringify(totalCost)}
    //             `)
    //           rawRefund[resourceName] -= multiplier; // I think the multiplier here does us a disservice, as we need the multiplier from the ingredient above (wire, in our example)
    //           console.log(`rawRefund[${resourceName}] is now: ${rawRefund[resourceName]}
    //             is this what we want?`)
    //         }
    //         else{
    //           console.log(`We can't refund ${resourceName} directly (it was made from other products), so we need a recursive call. Creating reimburse, we get: ${JSON.stringify(subItem.cost)}`)
    //           const reimburse = JSON.parse(JSON.stringify(subItem.cost));
    //           const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = cleanBulkRefund(cancelLeftover, rawRefund, hammerRefund, queueCancel, totalCost, reimburse);
    //           cancelLeftover = newCancelLeftover;
    //           rawRefund = newRawRefund;
    //           hammerRefund = newHammerRefund;
    //           queueCancel = newQueueCancel;
    //         }

    //         // we need to do a final check to see if we have any leftover. If we do have leftovers, we reduce the refund of the item.cost(s) by one, and deduct one * item.multiplier on the queueCancel 
    //         if(cancelLeftover[resourceName] > 0){
    //           console.log(`On our final check, we still have leftover, which is ${JSON.stringify(cancelLeftover)}}`)
    //           const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = cleanBulkRefund(cancelLeftover, rawRefund, hammerRefund, queueCancel, totalCost, null, true);
    //           cancelLeftover = newCancelLeftover;
    //           rawRefund = newRawRefund;
    //           hammerRefund = newHammerRefund;
    //           queueCancel = newQueueCancel;
    //         }

    //         console.log(`We end with:
    //           cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
    //           queueCancel is: ${JSON.stringify(queueCancel)}
    //           hammerRefund is now: ${hammerRefund}
    //           rawRefund is: ${JSON.stringify(rawRefund)}
    //         ##### end cleanBulkRefund #####`);


    //       }
    //       else if(finalCheck && amount > 0 && amount <= multiplier){
    //         // If we do have leftovers, we reduce the refund of the item.cost(s) by one, and deduct one * item.multiplier on the queueCancel
    //         console.log(` ######## cleanBulkRefund --- finalClean ########
    //           We have leftovers (${resourceName}) that can be reduced. We're working on ${JSON.stringify(objectToClean)}. Reimburse is: ${JSON.stringify(reimburse)}
    //           cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
    //           queueCancel is: ${JSON.stringify(queueCancel)}
    //           hammerRefund is: ${hammerRefund}
    //           rawRefund is: ${JSON.stringify(rawRefund)}
    //           totalCost is: ${JSON.stringify(totalCost)}
    //           ------
    //           `) 
            
    //         // we *need* to make this item an additional time to maintain the remaining craft costs (and hence get the desired leftover) as such, we reduce our queueCancel
    //         if(cancelLeftover[resourceName]){
    //           queueCancel[resourceName] ? queueCancel[resourceName] -= multiplier : queueCancel[resourceName] = -multiplier
    //           console.log(`We've reduced the cancelQueue to: ${JSON.stringify(queueCancel)}. Now we check if we can reduce ${resourceName} from rawRefund by checking `)
    //         }
    //         else{
    //           console.error(`${resourceName} wasnt in cancelQueue...`)
    //         }
    //         if(rawRefund[resourceName] && totalCost[resourceName]){
    //           console.log(`It is! rawRefund[${resourceName}] is: ${rawRefund[resourceName]} Now we check that we have any leftovers`)
    //           rawRefund[resourceName] -= multiplier;
    //           hammerRefund--
    //           console.log(`rawRefund[${resourceName}] is now: ${rawRefund[resourceName]}`)
    //         }
    //         else {
    //           console.log(`We can't refund ${resourceName} directly (it was made from other products), so we need a recursive call. Creating reimburse, we get: ${JSON.stringify(subItem.cost)}`)
    //           const finalReimburse = JSON.parse(JSON.stringify(subItem.cost));
    //           const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = cleanBulkRefund(cancelLeftover, rawRefund, hammerRefund, queueCancel, totalCost, finalReimburse, true);
    //           cancelLeftover = newCancelLeftover;
    //           rawRefund = newRawRefund;
    //           hammerRefund = newHammerRefund;
    //           queueCancel = newQueueCancel;
    //         }

    //         console.log(`We end with:
    //           cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
    //           queueCancel is: ${JSON.stringify(queueCancel)}
    //           hammerRefund is now: ${hammerRefund}
    //           rawRefund is: ${JSON.stringify(rawRefund)}
    //         ##### end cleanBulkRefund #####`);
    //       }
    //       // else if(!finalCheck){
    //       //   console.log(`We've bypassed all the other checks for ${resourceName}, so we jump to a finalCheck`)
    //       //   const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = cleanBulkRefund(cancelLeftover, rawRefund, hammerRefund, queueCancel, totalCost, null, true);
    //       //   cancelLeftover = newCancelLeftover;
    //       //   rawRefund = newRawRefund;
    //       //   hammerRefund = newHammerRefund;
    //       //   queueCancel = newQueueCancel;
    //       // }
    //     })
    //     return [cancelLeftover, rawRefund, hammerRefund, queueCancel]
    //   }

    //   // we lastly neaten up any leftovers
    //   if(cancelLeftover){
    //     const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = cleanBulkRefund(cancelLeftover, rawRefund, hammerRefund, queueCancel, totalCost);
    //     cancelLeftover = newCancelLeftover;
    //     rawRefund = newRawRefund;
    //     hammerRefund = newHammerRefund;
    //     queueCancel = newQueueCancel;
    //   }

    //   return [cancelLeftover, rawRefund, hammerRefund, queueCancel]
    // }

    // #########################################################################################################################################################################
    // #########################################################################################################################################################################
    // #########################################################################################################################################################################
    // #########################################################################################################################################################################

    // let [newLeftover, refund, hammerIterations, queueCancel] = smartRefund(componentArray, cancelSum, cancelLeftover, totalCost)
    // const hammer_cost_per_item = tools['Hammer'].corrodeRate;
    // let hammerRefund = (hammerIterations+1) * hammer_cost_per_item
    // let finalQueueCancel = queueCancel;
    // finalQueueCancel[parentName] = (ingredients[parentName].multiplier || 1);
    

    // console.log(`Our smartRefund is:
    //   newLeftover is: ${JSON.stringify(newLeftover)}
    //   refund is: ${JSON.stringify(refund)}
    //   hammerFix is: ${JSON.stringify(hammerRefund)}
    //   finalQueueCancel is: ${JSON.stringify(finalQueueCancel)}
    //   `)
      
    // const finalLeftoverClean = (newLeftover, refund, finalQueueCancel, topLayer) => {
    //   Object.entries(newLeftover).forEach(([resourceName]) => {
    //     const item = ingredients[resourceName]
    //     const multiplier = ingredients[resourceName].multiplier || 1;
    //     if(finalQueueCancel[resourceName] && topLayer){
    //       finalQueueCancel[resourceName] -= multiplier;
    //     }
    //     if(refund[resourceName]){
    //       refund[resourceName] -= multiplier;
    //     }
    //     else{
    //       const subItems = item.cost;
    //       const [updatedRefund, updatedFinalQueueCancel] = finalLeftoverClean(subItems, refund, finalQueueCancel, false);
    //       refund = updatedRefund;
    //       finalQueueCancel = updatedFinalQueueCancel;
    //     }
    //   })
    //   console.log(`We return refund: ${JSON.stringify(refund)} && finalQueueCancel: ${JSON.stringify(finalQueueCancel)}`)
    //   return [refund, finalQueueCancel]
    // }

    // if (Object.values(newLeftover).some(value => value > 0)) {
    //   console.log(`We had leftovers, so we reduce finalQueueCancel and refund`)
    //   const [newRefund, newFinalQueueCancel] = finalLeftoverClean(newLeftover, refund, finalQueueCancel, true);
    //   refund = newRefund;
    //   finalQueueCancel = newFinalQueueCancel;
    // }

    // console.log(`Our finalLeftoverClean is:
    //   newLeftover is: ${JSON.stringify(newLeftover)}             // {"Wire":0}
    //   refund is: ${JSON.stringify(refund)}                       // {"Copper Plate":2,"Iron Plate":1} <-- previously, this has listed Copper Plate as 1, which is wrong
    //   hammerFix is: ${JSON.stringify(hammerRefund)}              // integer
    //   finalQueueCancel is: ${JSON.stringify(finalQueueCancel)}   // {"Wire":4,"Electronic Circuit":1}
    //   `)

    const hammer_cost_per_item = tools['Hammer'].corrodeRate;
    hammerRefund = hammerRefund * hammer_cost_per_item;
    queueCancel[parentName] = (ingredients[parentName].multiplier || 1);

    // refund the items, adjust the leftovers and refund the hammer
    craftDeductions(parentName, rawRefund, cancelLeftover, hammerRefund, true);

    // delete the items in the queue
    deleteBulkQueueByOne(parentName, groupId, rawRefund, cancelLeftover, hammerRefund, queueCancel);

}

const smartRefund = (componentArray, cancelSum, cancelLeftover, totalCost, rawRefund, hammerRefund, queueCancel, ores, ingredients) => {

    console.log(`We've called a new smartRefund loop. The cancelSum is: ${JSON.stringify(cancelSum)}`)

    Object.entries(cancelSum).forEach(([resourceName, amount]) => {
      let refundCountdown = amount;
      while(refundCountdown > 0){
        console.log(`checking ${resourceName}`)
        if(ores[resourceName] || (ingredients[resourceName] && !ingredients[resourceName].isCraftable)){
          // straight refund
          cancelSum[resourceName] -= amount;
          refundCountdown -= amount;
          rawRefund[resourceName] ? rawRefund[resourceName] += amount : rawRefund[resourceName] = amount;
          console.log(`${resourceName} is raw, so we add this.
            cancelSum is now: ${JSON.stringify(cancelSum)}
            rawRefund is now: ${JSON.stringify(rawRefund)}
            cancelLeftovers is: ${JSON.stringify(cancelLeftover)}
            queueCancel is now: ${JSON.stringify(queueCancel)}
            hammerRefund is now: ${hammerRefund}
            refundCountdown is: ${refundCountdown}
            `)
        }
        else if(ingredients[resourceName]){
            console.log(`${resourceName} is an intermediary, so we need to check if we used it directly`)
            // this is an intermediary we need to covert back to it's raw item
            const multiplier = ingredients[resourceName].multiplier || 1;
            const subItems = JSON.parse(JSON.stringify(ingredients[resourceName].cost));
            if(componentArray.includes(resourceName)){
                // check if we need to break this down further
                if(totalCost[resourceName] && rawRefund[resourceName] < totalCost[resourceName]){
                    console.log(`rawRefund[${resourceName}] is: ${rawRefund[resourceName]} and the totalCost is greater, at: ${totalCost[resourceName]}`)
                    if(multiplier > 1){
                        console.log(`We were crafting this intermediary, but must be careful as this has a multiplier`)
                        cancelSum[resourceName] -= multiplier
                        refundCountdown -= multiplier
                        hammerRefund++
                        queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier
                        if(cancelSum[resourceName] < 0){
                            // i have amended this as we've combined cancelSum and cancelLeftover to toCancel, so now we MAY need to ADD cancel rather than SUBTRACT
                            cancelLeftover[resourceName] += cancelSum[resourceName]
                            refundCountdown -= cancelSum[resourceName]
                        }
                    }
                    else{
                        console.log(`We were crafting this intermediary with no multiplier, so it should be straight-forward`)
                        cancelSum[resourceName] -= 1
                        hammerRefund++
                        queueCancel[resourceName] ? queueCancel[resourceName]++ : queueCancel[resourceName] = 1
                        refundCountdown--
                    }
                } 
                // we DO need to break this down further
                else {
                    console.log(`rawRefund[${resourceName}] is: ${rawRefund[resourceName]} and the totalCost[resourceName] is less, at: ${totalCost[resourceName]}, so we must dig deeper, to subItems of ${resourceName}, which is: ${JSON.stringify(subItems)}`)
                    const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = smartRefund(componentArray, subItems, cancelLeftover, totalCost, rawRefund, hammerRefund, queueCancel, ores, ingredients)

                    cancelLeftover = newCancelLeftover;
                    rawRefund = newRawRefund;
                    hammerRefund = newHammerRefund;
                    queueCancel = newQueueCancel;

                    cancelSum[resourceName] -= multiplier;
                    hammerRefund++
                    queueCancel[resourceName] ? queueCancel[resourceName] += multiplier : queueCancel[resourceName] = multiplier;
                    refundCountdown -= multiplier;
                }
                // now we double check if refundCountdown has gone negative -- if it has, we tweak the rawRefund, cancelLeftovers, hammerRefund and queueCancel
                if(refundCountdown < 0){
                    console.log(`Our refundCountdown for ${resourceName} is negative (its: ${refundCountdown}), so we need to correct for this`)
                    cancelSum[resourceName] -= refundCountdown;
                    cancelLeftover[resourceName] ? cancelLeftover[resourceName] -= refundCountdown : cancelLeftover[resourceName] = -refundCountdown;

                    // rawRefund: we need to decrease this, but we need to know HOW to decrease it, directly, indirectly -- HOW indirectly? 
                    // We're basing it on what already exists in rawRefund
                    if(rawRefund[resourceName]){
                        rawRefund[resourceName] -= multiplier
                    }
                    else{
                        Object.entries(subItems).forEach(([subItemName, subItemAmount]) => {
                            if (rawRefund[subItemName]) {
                                rawRefund[subItemName]--;
                            }
                        });
                    }

                    hammerRefund--
                    queueCancel[resourceName] -= multiplier;
                    refundCountdown = 0;

                    console.log(`correcting for our over-refund:
                        cancelSum: ${JSON.stringify(cancelSum)}     // this is what we've got left to cancel         
                        rawRefund: ${JSON.stringify(rawRefund)}
                        cancelLeftover: ${JSON.stringify(cancelLeftover)}
                        hammerRefund: ${JSON.stringify(hammerRefund)}
                        queueCancel: ${JSON.stringify(queueCancel)}
                        `)
                }
            }
            else{
                console.log(`We didn't use ${resourceName} directly, we made it from other components, so we need to dig deeper.`)
                // break this down further
                const [newCancelLeftover, newRawRefund, newHammerRefund, newQueueCancel] = smartRefund(componentArray, subItems, cancelLeftover, totalCost, rawRefund, hammerRefund, queueCancel, ores, ingredients)

                cancelLeftover = newCancelLeftover;
                rawRefund = newRawRefund;
                hammerRefund = newHammerRefund;
                queueCancel = newQueueCancel;

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
      console.log(`We've completed the smartRefund loop for ${resourceName}. The cancelSum for this loop ends as: ${JSON.stringify(cancelSum)}`)
    })

    console.log(`smartRefund returns:
        cancelLeftover: ${JSON.stringify(cancelLeftover)}
        rawRefund: ${JSON.stringify(rawRefund)}
        hammerRefund: ${JSON.stringify(hammerRefund)}
        queueCancel: ${JSON.stringify(queueCancel)}
        `)
    return [cancelLeftover, rawRefund, hammerRefund, queueCancel]
}

export default singleBulkRefundExt;