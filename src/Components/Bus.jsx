import React, {useState} from "react";
import images from "./Images/images";

const Bus = ({ itemName, lanes, setLanes, networks, setNetworks, ingredients, checkBus, onAlert }) => {

    //console.log(`Lanes are: ${JSON.stringify(lanes[itemName])}`)

    const laneSet = lanes[itemName]

    const checkBelts = (itemName, routeNo, action) => {
      // check we have spare routes
      const beltNames = Object.keys(networks).reverse();  // Get the keys and reverse the order
  
      for (const beltName of beltNames) {
        const belt = networks[beltName];
    
        if (belt.isBelt && belt.idleCount > 0 && action === "add") {  // Check if it's a belt lane and count > 0
          addBelt(beltName, itemName, routeNo);  // Return the name of the first belt lane with count > 0
          return
        }
        else if(action === "remove"){
          addBelt(beltName, itemName, routeNo, action);  // Return the name of the first belt lane with count > 0
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
      const updatedLanes = {...lanes}
      let speed = 0
      if(!action){
        // adding a chosen belt
        if(beltName == "Belt Lane"){
          speed = ingredients["Transport Belt"].beltSpeed;
        }
        else if(beltName == "Fast Belt Lane"){
          speed = ingredients["Fast Transport Belt"].beltSpeed;
        }
        else{
          speed = ingredients["Express Transport Belt"].beltSpeed;
        }
        updatedNetworks[beltName].idleCount -= 1;
        updatedLanes[itemName][routeNo].speed = speed;
        updatedLanes[itemName][routeNo].active = true;
      }
      else if(action){
        // removing a chosen belt
        updatedNetworks[beltName].idleCount += 1;
        updatedLanes[itemName][routeNo].speed = speed;
        updatedLanes[itemName][routeNo].active = false;
      }

      setNetworks(updatedNetworks);
      setLanes(updatedLanes);
      checkBus(itemName)
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
                    {!laneSet[routeNo].clear && (
                        <div style={{border: "1px dashed #ccc", padding: "5px", borderRadius: "10px"}}>
                        <p></p>
                        </div>
                    )}
                    {laneSet[routeNo].clear && !laneSet[routeNo].active && (
                        <div className="add-lane">
                          <button
                            onClick={() => checkBelts(itemName, routeNo, "add")}
                            style={{height: "35px", width: "35px", padding: "5px"}}
                          >+</button>
                        </div>
                    )} 
                    {laneSet[routeNo].active && (
                      <div className="belt-change">
                        <button>
                          ^
                        </button>
                        <img src={images["Transport Belt"]} alt="belt" />
                        <button
                        onClick={() => checkBelts(itemName, routeNo, "remove")}
                        >-</button>
                      </div>
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