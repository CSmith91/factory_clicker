import React from "react";
import images from "./Images/images";

const Bus = ({ itemName, lanes, setLanes, networks, setNetworks, ingredients, checkBus, onAlert }) => {

    //console.log(`Lanes are: ${JSON.stringify(lanes[itemName])}`)

    const laneSet = lanes[itemName]

    const checkBelts = (itemName, routeNo, beltType, action) => {

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
      const updatedLanes = {...lanes}
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
          console.log(`Something went wrong looking up Belt Lane!`)
        }
        updatedNetworks[beltName].idleCount -= 1;
        updatedLanes[itemName][routeNo].speed = speed;
        updatedLanes[itemName][routeNo].active = true;
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
          console.log(`Something went wrong looking up Belt Lane!`)
        }
        //console.log(`beltName is ${beltName}`)
        updatedNetworks[beltLane].idleCount += 1;
        updatedLanes[itemName][routeNo].speed = speed;
        updatedLanes[itemName][routeNo].active = false;
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
          console.log(`Something went wrong looking up Belt Lane!`)
        }
        //console.log(`beltName is ${beltName}`)
        updatedNetworks[old].idleCount += 1;
        updatedNetworks[upgrade].idleCount -= 1;
        updatedLanes[itemName][routeNo].speed = speed;
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
              .map((routeNo, index) => {
                // Determine the beltName based on speed
                let beltName = "";
                if (laneSet[routeNo].speed > 4) {
                    beltName = "Express Transport Belt";
                } else if (laneSet[routeNo].speed > 2) {
                    beltName = "Fast Transport Belt";
                } else {
                    beltName = "Transport Belt";
                }
                return (
                <div key={routeNo} className="bus-lane">
                    {!laneSet[routeNo].clear && (
                        <div style={{border: "1px dashed #ccc", padding: "5px", borderRadius: "10px"}}>
                        <p></p>
                        </div>
                    )}
                    {laneSet[routeNo].clear && !laneSet[routeNo].active && (
                        <div className="add-lane">
                          <button
                            onClick={() => checkBelts(itemName, routeNo, beltName, "add")}
                            style={{height: "35px", width: "35px", padding: "5px"}}
                          >+</button>
                        </div>
                    )} 
                    {laneSet[routeNo].active && (
                      <div className="belt-change">
                          <button
                            onClick={() => checkBelts(itemName, routeNo, beltName, "upgrade")}
                            style={{ visibility: laneSet[routeNo].speed < 5 ? 'visible' : 'hidden' }}
                          >
                            ^
                          </button>
                        <img 
                          id={`belt-${itemName}-${routeNo}`}  // Unique ID using itemName and routeNo
                          src={images[beltName]} 
                          alt="belt" />
                        <button
                        onClick={() => checkBelts(itemName, routeNo, beltName, "remove")}
                        >-</button>
                      </div>
                      )}
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