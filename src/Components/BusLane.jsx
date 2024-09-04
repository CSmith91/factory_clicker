import React, {useEffect} from "react";
import images from "./Images/images";

const BusLane = ({ 
    ores, 
    setOres,
    ingredients,
    setIngredients, 
    siteCounts, 
    setSiteCounts, 
    itemName, 
    beltName, 
    routeNo, 
    laneSet, 
    lanes, 
    setLanes,
    getStorage, 
    changeBelts,
    debug
    }) => {

    const thisLane = lanes[itemName][routeNo]; // {"no":1,"isRunning":false,"active":false,"clear":true,"unlocked":true,"cost":{"Stone":20},"gain":{"Wood":30},"speed":0,"sushiCount":0}

    return (
        <div>
            {debug && (
                <div>
                    <p>{itemName}</p>
                    <p>{beltName}</p>
                    <p>{routeNo}</p>
                    <p>{thisLane.isRunning ? "RUNNING" : "OFF"}</p>
                    <p>{thisLane.active ? "ACTIVE" : "."}</p>
                    <p>Speed: {thisLane.speed}</p>
                    <p>{thisLane.priority === 1 ? "1st" : thisLane.priority === 2 ? "2nd" : `${thisLane.priority}th`}</p>
                    <p>Sushi: {thisLane.sushiCount}</p>
                </div>
            )}
            {!laneSet[routeNo].clear && (
                <div style={{border: "1px dashed #ccc", padding: "5px", borderRadius: "10px"}}>
                <p></p>
                </div>
            )}
            {laneSet[routeNo].clear && !laneSet[routeNo].active && (
                <div className="add-lane">
                    <button
                    onClick={() => changeBelts(itemName, routeNo, beltName, "add")}
                    style={{height: "30px", width: "30px", padding: "5px"}}
                    >+</button>
                </div>
            )} 
            {laneSet[routeNo].active && (
                <div className="belt-change">
                    <button
                    onClick={() => changeBelts(itemName, routeNo, beltName, "upgrade")}
                    style={{ visibility: laneSet[routeNo].speed < 5 ? 'visible' : 'hidden' }}
                    >
                    ^
                    </button>
                <img 
                    id={`belt-${itemName.replace(/\s+/g, '-')}-${routeNo}`}  // Unique ID using itemName and routeNo
                    src={images[beltName]} 
                    alt="belt" />
                <button
                onClick={() => changeBelts(itemName, routeNo, beltName, "remove")}
                >-</button>
                </div>
            )}
        </div>
    )
}

export default BusLane