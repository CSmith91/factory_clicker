import React, {useState} from "react";

const Bus = ({ itemName, lanes, setLanes, networks, setNetworks, ingredients, onAlert }) => {

    //console.log(`Lanes are: ${JSON.stringify(lanes[itemName])}`)

    const laneSet = lanes[itemName]

    const checkBelts = (itemName, routeNo, action) => {
      // check we have spare routes
      const beltNames = Object.keys(networks).reverse();  // Get the keys and reverse the order
  
      for (const beltName of beltNames) {
        const belt = networks[beltName];
    
        if (belt.isBelt && belt.idleCount > 0) {  // Check if it's a belt lane and count > 0
          if(action == "add"){
            addBelt(beltName, itemName, routeNo);  // Return the name of the first belt lane with count > 0
            return
          }
          else{
            // do something else
            return
          }
          }
      }
      onAlert(`No spare belt lanes.`)
      return null;  // Return null if no belt lane with count > 0 is found
    } 

    const addBelt = (beltName, itemName, routeNo) => {
      // first we need to deduct the belt 'ingredient'
      const updatedNetworks = {...networks}
      const updatedLanes = {...lanes}
      let speed = 0
      if(beltName == "Belt Lane"){
        speed = ingredients["Transport Belt"].beltSpeed;
      }
      else if(beltName == "Fast Belt Lane"){
        speed = ingredients["Fast Belt"].beltSpeed;
      }
      else{
        speed = ingredients["Express Belt"].beltSpeed;
      }
      updatedNetworks[beltName].idleCount -= 1;
      updatedLanes[itemName][routeNo].speed = speed;

      setNetworks(updatedNetworks);
      setLanes(updatedLanes);
    }
    
      return (
        <>
        {laneSet ? (
            <>
        {laneSet["lane1"].clear ? (
          <div className="bus-div">
            {Object.keys(laneSet)
              .filter(routeNo => laneSet[routeNo].unlocked) // Only show unlocked lanes
              .map((routeNo, index) => (
                <div key={routeNo} className="bus-lane">
                    {laneSet[routeNo].clear ? (
                        <button
                          onClick={() => checkBelts(itemName, routeNo, "add")}
                        >+</button>
                    ) : (
                        <p></p>
                    )}
                </div>
              ))}
          </div>
        ) : (<></>)}
        </>
        ) : (<></>)}
        </>
      );
    };
    
    export default Bus;