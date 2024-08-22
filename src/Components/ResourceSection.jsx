import OresAndDrills from './OresAndDrills';
import Furnaces from './Furnaces'

const ResourceSection = ({
    unlockables,
    setUnlockables,
    ores,
    ingredients,
    tools,
    setOres,
    setIngredients,
    storage,
    getStorage,
    setTools,
    useTool,
    handleMachineChange,
    networks,
    setNetworks,
    lanes,
    setLanes,
    onAlert
}) => {

    const shouldShowFurnaces = () => {
        return ingredients["Brick"].unlocked
      };

    // useEffect(() => {
    //   checkBus(itemName)
    // }, [onIncrement])

    const updateLaneRunningState = (itemName, lane, isRunning) => {
      setLanes(prevLanes => ({
        ...prevLanes,
        [itemName]: {
          ...prevLanes[itemName],
          [lane]: {
            ...prevLanes[itemName][lane],
            isRunning: isRunning,
          },
        },
      }));
    };
    
    const checkBus = (itemName) => {
      console.log(`Our lanes[itemName] is: ${JSON.stringify(lanes[itemName])}`)
      const targetResource = ores[itemName] ? ores[itemName] : ingredients[itemName]

      // first, we check if there are any resources to move
      // ###################### START HERE

      // second, we check if the target storage has space (including tempCount!)
      if(targetResource.count + targetResource.tempCount <= getStorage(targetResource)){
        // lastly iterate through the bus. Any lanes that are active (and not already running) then trigger the payout
        let bus = lanes[itemName]

        for (let lane in bus) {
          if (bus[lane].active && !bus[lane].isRunning) {
              let speed = bus[lane].speed;      
              turnOnBelt(itemName, lane, speed)
          }
        }
      }
      else{
        // storage is full
      }
    }

    const turnOnBelt = (itemName, lane, speed) => {

      // set the belt lane as running
      updateLaneRunningState(itemName, lane, true);

      // belt payouts are different to machines
      // we have a constant take-take-take of resources at a very high rate
      // and a long delay for the final payout. The belts flash while they are
      // delivering resources but take/stop taking from the bank independantly
      // hence, this function has two timeouts: one for taking and another for 
      // arrival


      // Add a flashing effect to the lane in CSS
      const laneElement = document.querySelector(`#belt-${itemName}-${lane}`);
      
      if (laneElement) {
        // Determine which class to add based on the speed
        let flashClass;
        if (speed >= 5) {
          flashClass = 'flashing-fast';  // Fast belts
        } else if (speed >= 3) {
          flashClass = 'flashing-medium';  // Medium belts
        } else {
          flashClass = 'flashing-slow';  // Slow belts
        }
    
        // Add the corresponding class for flashing
        laneElement.classList.add(flashClass);

        // Arrival after delay
        setTimeout(() => {
          laneElement.classList.remove(flashClass);
          // beltPayout
        }, 50 / speed * 1000);  // Adjust timeout based on the desired duration
      }

      const throughput = 8 * speed
      // loop back to achieve x items / second
      // add tempCount
      setTimeout(() => {
        updateLaneRunningState(itemName, lane, false);
        checkBus(itemName)
      }, 1000 / throughput )
    };

    return (
        <>
            {/* Ore Patch Section */}
            <div className='section'>
              <OresAndDrills 
                unlockables={unlockables}
                setUnlockables={setUnlockables} 
                ores={ores} 
                ingredients={ingredients} 
                tools={tools} 
                setOres={setOres} 
                setIngredients={setIngredients} 
                storage={storage} getStorage={getStorage} 
                setTools={setTools} 
                useTool={useTool} 
                handleMachineChange={handleMachineChange} 
                networks={networks}
                setNetworks={setNetworks}
                checkBus={checkBus}
                lanes={lanes}
                setLanes={setLanes}
                onAlert={onAlert} />
            </div>

            {/* Furnaces Section */}
            {shouldShowFurnaces() && (
              <div className='section'>
                <Furnaces 
                  unlockables={unlockables}
                  ores={ores} 
                  ingredients={ingredients} 
                  setOres={setOres} 
                  setIngredients={setIngredients} 
                  storage={storage} 
                  getStorage={getStorage} 
                  useTool={useTool} 
                  handleMachineChange={handleMachineChange} 
                  networks={networks}
                  setNetworks={setNetworks}
                  checkBus={checkBus}
                  lanes={lanes}
                  setLanes={setLanes}
                  onAlert={onAlert} />
              </div>
            )}
        </>
    )

}

export default ResourceSection