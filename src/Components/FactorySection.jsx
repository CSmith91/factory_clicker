import Tools from "./Tools"
import Networks from "./Networks"
import Expansion from "./Expansion"

const FactorySection = ({ unlockables, expandables, onUnlock, handleBeltUnlock, ores, ingredients, tools, checkCraft, networks, setNetworks, lanes, setLanes }) => {

    return(
        <>
            <h2>Factory</h2>
            {unlockables.belts1.unlocked && (
                <>
                    < Expansion ores={ores} ingredients={ingredients} onUnlock={onUnlock} handleBeltUnlock={handleBeltUnlock} lanes={lanes} setLanes={setLanes} expandables={expandables}  />
                    < Networks checkCraft={checkCraft} networks={networks} setNetworks={setNetworks} />
                </>
            )}

            <Tools tools={tools} />
        </>
    )
}

export default FactorySection