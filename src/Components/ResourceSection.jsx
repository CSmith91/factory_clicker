import OresAndDrills from './OresAndDrills';
import Furnaces from './Furnaces'
import { useEffect } from 'react';

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
      console.log(`The ${itemName} bus have been checked`)
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
                  setUnlockables={setUnlockables} 
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