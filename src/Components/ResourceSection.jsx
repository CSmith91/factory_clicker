import OresAndDrills from './OresAndDrills';
import Furnaces from './Furnaces'

const ResourceSection = ({
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
    onAlert
}) => {

    const shouldShowFurnaces = () => {
        return ingredients["Brick"].unlocked
      };

    return (
        <>
            {/* Ore Patch Section */}
            <div className='section'>
              <OresAndDrills setUnlockables={setUnlockables} ores={ores} ingredients={ingredients} tools={tools} setOres={setOres} setIngredients={setIngredients} storage={storage} getStorage={getStorage} setTools={setTools} useTool={useTool} handleMachineChange={handleMachineChange} onAlert={onAlert} />
            </div>

            {/* Furnaces Section */}
            {shouldShowFurnaces() && (
              <div className='section'>
                <Furnaces setUnlockables={setUnlockables} ores={ores} ingredients={ingredients} setOres={setOres} setIngredients={setIngredients} storage={storage} getStorage={getStorage} useTool={useTool} handleMachineChange={handleMachineChange} onAlert={onAlert} />
              </div>
            )}
        </>
    )

}

export default ResourceSection