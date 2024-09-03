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
    changeBelts }) => {

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

    const thisLane = lanes[itemName][routeNo]; // {"no":1,"isRunning":false,"active":false,"clear":true,"unlocked":true,"cost":{"Stone":20},"gain":{"Wood":30},"speed":0,"sushiCount":0}
    const item = ores[itemName] ? ores[itemName] : ingredients[itemName]
    const onSiteCount = siteCounts[itemName]
    const totalCount = item.count + item.tempCount

    useEffect(() => {
        if(item.count < getStorage(itemName) && thisLane.active)
          checkLanes(itemName, thisLane)
      },[item, siteCounts[itemName], thisLane])
    
    const checkLanes = (itemName, thisLane) => {
        // first, check if we have any good onSite
        if(onSiteCount > 0){        
            // second, we check if this lane is already running
            if(!thisLane.isRunning){
                // third, check if we have inventory space and nothing is pending
                if(totalCount < getStorage(itemName)){
                    // ready to go!
                    loadLane(itemName, thisLane)
                }
                else{
                    // inventory is full!
                }
            }
            else{
                // lane is already running
                // we could also do a check here for sushi -- any surplus sushi needs to be 'unloaded' - that said, if the code it tight, that shouldnt be necessary 
            }
        }
        else{
            // nothing onSite to move!
        }
    }

    const loadLane = (itemName, thisLane) => {
        const speed = thisLane.speed
        const flashClass = speed >= 5 ? 'flashing-fast' : speed >= 3 ? 'flashing-medium' : 'flashing-slow';
        const beltId = `belt-${itemName.replace(/\s+/g, '-')}-${routeNo}`;
        const laneElement = document.querySelector(`#${beltId}`);    

        if (laneElement) {
            // Determine which class to add based on the speed
            laneElement.classList.add(flashClass);
        }

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
                [routeNo]: {
                  ...prevLanes[itemName][routeNo],
                  sushiCount: prevLanes[itemName][routeNo].sushiCount + 1
                }
              }
            };
        });

        // Increment the tempCount for the item
        setTempCount(itemName, 1); // Assuming a function that handles tempCount increment

    }

    return (
        <div>
            <div>
                <p>{itemName}</p>
                <p>{beltName}</p>
                <p>{routeNo}</p>
                <p>Run: {thisLane.isRunning ? "T" : "F"}</p>
                <p>Active: {thisLane.active ? "T" : "F"}</p>
                <p>Speed: {thisLane.speed}</p>
                <p>Sushi: {thisLane.sushiCount}</p>
            </div>
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