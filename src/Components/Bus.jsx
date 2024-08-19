import React, {useState} from "react";

const Bus = ({ itemName, lanes, setLanes }) => {

    // console.log(`Lanes are: ${JSON.stringify(lanes)}`)
    
      return (
        <>
        {lanes[itemName] ? (
            <>
        {lanes[itemName]["lane1"].clear ? (
          <div className="bus-div">
            {Object.keys(lanes)
              .filter(laneKey => lanes[laneKey].unlocked) // Only show unlocked lanes
              .map((laneKey, index) => (
                <div key={laneKey} className="bus-lane">
                    {lanes[laneKey].clear ? (
                        <button>+</button>
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