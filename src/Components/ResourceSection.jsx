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
    
    const checkBus = (itemName) => {
      console.log(`Our lanes[itemName] is: ${JSON.stringify(lanes[itemName])}`)

      // first, we check if there are any resources to move

      // second, we check if the target storage has space

      let bus = lanes[itemName]

      // lastly iterate through the bus. Any lanes that are active then trigger the payout
      for (let lane in bus) {
        if (bus[lane].active) {
            let speed = bus[lane].speed;
        }
      }
      // something like this
      // turnOnBelt(itemName, lane)

    }

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