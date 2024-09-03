import React, { useEffect } from "react";
import BusLane from "./BusLane";

const Bus = ({ itemName, lanes, setLanes, networks, setNetworks, siteCounts, setSiteCounts, ores, ingredients, setOres, setIngredients, getStorage, onAlert }) => {

  //console.log(`Lanes are: ${JSON.stringify(lanes[itemName])}`)

  const laneSet = lanes[itemName]
  const item = ores[itemName] ? ores[itemName] : ingredients[itemName]
  const onSiteCount = siteCounts[itemName]
  const totalCount = item.count + item.tempCount

  const changeBelts = (itemName, routeNo, beltType, action) => {

    if(action === "upgrade"){
      if(beltType === "Fast Transport Belt"){
        let requirement = networks["Express Belt Lane"].idleCount > 0 ? true : false;
        if(requirement){
          addBelt(beltType, itemName, routeNo, action)
        }
        else{
          onAlert(`You need an available express belt lane to upgrade to.`)
        }
      }
      else if(beltType === "Transport Belt"){
        let requirement = networks["Fast Belt Lane"].idleCount > 0 ? true : false;
        if(requirement){
          addBelt(beltType, itemName, routeNo, action)
        }
        else{
          onAlert(`You need an available express belt lane to upgrade to.`)
        }
      }
      else{
        console.log(`Error with belt lane upgrade.`)
      }
      return
    }

    // check we have spare routes
    const beltNames = Object.keys(networks);  // Get the keys and reverse the order

    for (const beltName of beltNames) {
      const belt = networks[beltName];
  
      if (belt.isBelt && belt.idleCount > 0 && action === "add") {  // Check if it's a belt lane and count > 0
        addBelt(beltName, itemName, routeNo, action);  // Return the name of the first belt lane with count > 0
        return
      }
      else if(action === "remove"){
        addBelt(beltType, itemName, routeNo, action);  // Return the name of the first belt lane with count > 0
        return
      }
      // else{
      //   console.log(`Something went wrong on the ${itemName} belt!`)
      //   return 
      // }
    }
    onAlert(`No spare belt lanes.`)
    return null;  // Return null if no belt lane with count > 0 is found
  } 

  const addBelt = (beltName, itemName, routeNo, action) => {
    // first we need to deduct the belt 'ingredient'
    const updatedNetworks = {...networks}
    let speed = 0

    if(action === 'add'){
      // adding a chosen belt
      if(beltName === "Belt Lane"){
        speed = ingredients["Transport Belt"].beltSpeed;
      }
      else if(beltName === "Fast Belt Lane"){
        speed = ingredients["Fast Transport Belt"].beltSpeed;
      }
      else if(beltName === "Express Belt Lane"){
        speed = ingredients["Express Transport Belt"].beltSpeed;
      }
      else{
        console.log('Something went wrong looking up Belt Lane!')
      }
      updatedNetworks[beltName].idleCount -= 1;
      const updatedLanes = { 
        ...lanes, 
        [itemName]: {
            ...lanes[itemName], // Spread the existing lanes for the current itemName
            [routeNo]: {
                ...lanes[itemName][routeNo], // Spread the existing data for the current routeNo
                active: true,
                speed: speed, 
            }
        }
      };
      setLanes(updatedLanes);
    }
    else if(action === 'remove'){
      // removing a chosen belt
      let beltLane = ''
      if(beltName === "Transport Belt"){
        beltLane = "Belt Lane";
      }
      else if(beltName === "Fast Transport Belt"){
        beltLane = "Fast Belt Lane";
      }
      else if(beltName === "Express Transport Belt"){
        beltLane = "Express Belt Lane";
      }
      else{
        console.log('Something went wrong looking up Belt Lane!')
      }
      //console.log(beltName is ${beltName})
      updatedNetworks[beltLane].idleCount += 1;
      const updatedLanes = { 
        ...lanes, 
        [itemName]: {
            ...lanes[itemName], // Spread the existing lanes for the current itemName
            [routeNo]: {
                ...lanes[itemName][routeNo], // Spread the existing data for the current routeNo
                active: false,
                speed: speed, 
            }
        }
      };
      setLanes(updatedLanes);
    }
    else if(action === 'upgrade'){
      let old = ''
      let upgrade = ''
      let newBelt = ''
      if(beltName === "Transport Belt"){
        old = "Belt Lane";
        upgrade = "Fast Belt Lane"
        newBelt = "Fast Transport Belt"
        speed = ingredients["Fast Transport Belt"].beltSpeed;
      }
      else if(beltName === "Fast Transport Belt"){
        old = "Fast Belt Lane";
        upgrade = "Express Belt Lane"
        newBelt = "Express Transport Belt"
        speed = ingredients["Express Transport Belt"].beltSpeed;
      }
      else{
        console.log('Something went wrong looking up Belt Lane!')
      }
      //console.log(beltName is ${beltName})
      updatedNetworks[old].idleCount += 1;
      updatedNetworks[upgrade].idleCount -= 1;
      const updatedLanes = { 
        ...lanes, 
        [itemName]: {
            ...lanes[itemName], // Spread the existing lanes for the current itemName
            [routeNo]: {
                ...lanes[itemName][routeNo], // Spread the existing data for the current routeNo
                active: true,
                speed: speed, 
            }
        }
      };
      setLanes(updatedLanes);
    }
    setNetworks(updatedNetworks);
  }

  // ############# SORT LANE PRIORITY WITHIN ONE BUS

  const sortLanes = (itemName) => {
    // Update the lanes state
    setLanes(prevLanes => {
        // Make sure itemName exists in prevLanes
        if (!prevLanes[itemName]) {
          return prevLanes;
        }

        const updatedLanes = { ...prevLanes };

        // Convert the lanes object to an array of lanes
        const lanesArray = Object.values(updatedLanes[itemName]);

        // Filter out any lanes that are not active
        const activeLanes = lanesArray.filter(lane => lane.active);

        // Sort the lanes by speed (descending), then by lane number (ascending)
        activeLanes.sort((a, b) => {
            if (b.speed !== a.speed) {
                return b.speed - a.speed; // Sort by speed, highest first
            }
            return a.no - b.no; // Sort by lane number, lowest first
        });

        // Assign priorities based on the sorted order
        activeLanes.forEach((lane, index) => {
            lane.priority = index + 1; // Priority starts from 1
        });

        // Set the priority to 0 for all inactive lanes
        lanesArray.forEach(lane => {
          if (!lane.active) {
              lane.priority = 0;
          }
        });

        // Map the updated priorities back to the original lanes object
        lanesArray.forEach(updatedLane => {
          updatedLanes[itemName][`lane${updatedLane.no}`].priority = updatedLane.priority;
        });

        //console.log(`Updated laneSet with priorities for ${itemName}:`, updatedLanes);

        // Return the updated lanes object to update the state
        return updatedLanes;
    });
  };

  useEffect(() => {
    sortLanes(itemName)
  },[networks])

  // ############# CHECK INDIVIDUAL LANES IN THE BUS BASED ON PRIORITY

  // determines if we're changing an ore or an ingredient
  const setTempCount = (itemName, tempCountChange) => {
    const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
    const updateState = oreOrIngredient === 'ore' ? setOres : setIngredients;
    
    updateState(prevState => {
        const updatedItem = {
        ...prevState[itemName],
        tempCount: prevState[itemName].tempCount + tempCountChange
        };
        return {
        ...prevState,
        [itemName]: updatedItem
        };
    });
  };

  const setActualCount = (itemName, countChange) => {
    const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
    const updateState = oreOrIngredient === 'ore' ? setOres : setIngredients;
    
    updateState(prevState => {
        const updatedItem = {
        ...prevState[itemName],
        count: prevState[itemName].count + countChange
        };
        return {
        ...prevState,
        [itemName]: updatedItem
        };
    });
  };

  useEffect(() => {
    if (laneSet) {
        // Convert the lanes object to an array of lanes
        const lanesArray = Object.entries(laneSet).map(([key, lane]) => ({ key, ...lane }));

        // Filter out lanes with priority 0 and sort by priority (ascending)
        const sortedLanes = lanesArray
            .filter(lane => lane.priority > 0)
            .sort((a, b) => a.priority - b.priority);

        // Iterate over the sorted lanes and check conditions
        for (const lane of sortedLanes) {
            if (lane.active && !lane.isRunning) {
                checkLane(lane, lane.key);
                break; // Exit the loop after processing the first valid lane
            }
        }
    }
  }, [item, siteCounts[itemName], networks]);

  const checkLane = (thisLane, laneKey) => {
    // first, check if we have any good onSite
    if(onSiteCount > 0){        
        // second, we check if we have inventory space and nothing is pending
        if(totalCount < getStorage(itemName)){
            // ready to go!
            console.log(`itemName: ${itemName} under lane ${JSON.stringify(thisLane)} is ready to go`)
            loadLane(thisLane, laneKey)
        }
        else{
            // inventory is full!
        }
    }
    else{
        // nothing onSite to move!
    }
  }

  const loadLane = (thisLane, laneKey) => {
    const speed = thisLane.speed
    const flashClass = speed >= 5 ? 'flashing-fast' : speed >= 3 ? 'flashing-medium' : 'flashing-slow';
    const beltId = `belt-${itemName.replace(/\s+/g, '-')}-${laneKey}`;
    const laneElement = document.querySelector(`#${beltId}`);    

    if (laneElement) {
        // Determine which class to add based on the speed
        laneElement.classList.add(flashClass);
    }

    // Set running as true
    setLanes(prevLanes => {
        return {
            ...prevLanes,
            [itemName]: {
            ...prevLanes[itemName],
            [laneKey]: {
                ...prevLanes[itemName][laneKey],
                isRunning: prevLanes[itemName][laneKey].isRunning = true
            }
            }
        };
    });

    // Decrement the onSiteCount
    setSiteCounts(prevCounts => {
        const newCount = Math.max(0, (prevCounts[itemName] || 0) - 1);
        return { ...prevCounts, [itemName]: newCount };
    });

    // Increment the sushiCount for the specific lane
    setLanes(prevLanes => {
        return {
          ...prevLanes,
          [itemName]: {
            ...prevLanes[itemName],
            [laneKey]: {
              ...prevLanes[itemName][laneKey],
              sushiCount: prevLanes[itemName][laneKey].sushiCount + 1
            }
          }
        };
    });

    // Increment the tempCount for the item
    setTempCount(itemName, 1); // Assuming a function that handles tempCount increment

  }
    
  return (
    <>
      {laneSet ? (
        <>
          {laneSet["lane1"].clear ? (
            <div className="bus-div">
              {Object.keys(laneSet)
                .filter(routeNo => laneSet[routeNo].unlocked) // Only show unlocked lanes
                .map((routeNo, index) => {
                  // Determine the beltName based on speed
                  let beltName = "";
                  if (laneSet[routeNo].speed > 4) {
                      beltName = "Express Transport Belt";
                  } else if (laneSet[routeNo].speed > 2) {
                      beltName = "Fast Transport Belt";
                  } else if (laneSet[routeNo].speed > 0){
                      beltName = "Transport Belt";
                  } else{
                      beltName = "No Belt";
                  }
                  return (
                    <div key={routeNo} className="bus-lane">
                        <BusLane    
                          ores={ores} 
                          setOres={setOres} 
                          ingredients={ingredients}   
                          setIngredients={setIngredients}                           
                          siteCounts={siteCounts}
                          setSiteCounts={setSiteCounts}
                          itemName={itemName} 
                          beltName={beltName} 
                          routeNo={routeNo} 
                          laneSet={laneSet} 
                          lanes={lanes} 
                          setLanes={setLanes}
                          getStorage={getStorage}
                          changeBelts={changeBelts} />
                    </div>
                  );
                })}
            </div>
          ) : (<></>)}
        </>
      ) : (<></>)}
    </>
  );
};
    
export default Bus;