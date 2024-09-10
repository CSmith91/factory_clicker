import React from "react";
import Machines from "./Machines";
import Bus from "./Bus";
import images from './Images/images';

const Furnaces = ({ 
    unlockables, 
    ores, 
    ingredients,  
    setOres, 
    setIngredients,  
    storage, 
    getStorage, 
    isStorageFull,
    pendingMachineOutput,
    setPendingMachineOutput, 
    handleBank,
    siteCounts,
    setSiteCounts,
    updateSiteCounts,
    networks, 
    setNetworks, 
    checkBelts,              
    lanes,
    setLanes,
    debug,
    onAlert }) => {

    // used for lookups within production (later) as well as headers (here)
    const getOutput = (oreName) => {
        switch (oreName) {
            case 'Stone':
                return 'Brick';
            case 'Iron Ore':
                return 'Iron Plate';
            case 'Copper Ore':
                return 'Copper Plate';
            case 'Iron Plate':
                return 'Steel';
            default:
                return null
        }
    }

    const getUnlockStatus = (oreName) => {
        if(ingredients[getOutput(oreName)]){
            return ingredients[getOutput(oreName)].unlocked
        }
        else{
            return true
        }
    }

    return(
        <>
        <h2>Furnaces</h2>
        {/* <h6>|  |  |  collapsable icons  |  |  |</h6> */}
                {Object.entries(ores)
                    .filter(([oreName, oreData]) => getUnlockStatus(oreName) && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <div key={oreName+"ImgDiv"} className={`imgdiv ${isStorageFull(getOutput(oreName)) ? 'red-background' : ''}`} onClick={() => handleBank(getOutput(oreName))} >
                                {images[getOutput(oreName)] && (
                                    <>
                                        <img src={images[getOutput(oreName)]} alt={`${getOutput(oreName)}`} />
                                        <span className="img-number">{siteCounts[getOutput(oreName)] || 0}</span>
                                    </>
                                )}
                            </div>
                            {unlockables.belts1.unlocked && (
                                <div style={{marginBottom: "15px"}}>
                                    <Bus itemName={getOutput(oreName)} 
                                        lanes={lanes} 
                                        setLanes={setLanes} 
                                        networks={networks} 
                                        setNetworks={setNetworks}                                 
                                        siteCounts={siteCounts}
                                        setSiteCounts={setSiteCounts}
                                        ores={ores} 
                                        ingredients={ingredients} 
                                        setOres={setOres} 
                                        setIngredients={setIngredients} 
                                        getStorage={getStorage}
                                        checkBelts={checkBelts} 
                                        debug={debug} 
                                        onAlert={onAlert}/>
                                </div>
                            )}
                            <Machines
                                unlockables={unlockables}
                                machineType={"furnace"}
                                ores={ores} 
                                oreName={oreName} 
                                ingredients={ingredients} 
                                setOres={setOres} 
                                setIngredients={setIngredients}
                                storage={storage}
                                getStorage={getStorage}
                                pendingMachineOutput={pendingMachineOutput}
                                setPendingMachineOutput={setPendingMachineOutput}
                                siteCounts={siteCounts}
                                updateSiteCounts={updateSiteCounts}
                                onAlert={onAlert} 
                                />
                        </div>
                    ))}
                    {Object.entries(ingredients || {})
                    .filter(([ingredientName, ingredientData]) => getUnlockStatus(ingredientName) && ingredientData?.canFurnace)
                    .map(([ingredientName, _]) => (
                        <div key={ingredientName + "HarvestDiv"}>
                        <h3>{getOutput(ingredientName)}</h3>
                        <div key={ingredientName + "ImgDiv"} className={`imgdiv ${isStorageFull(getOutput(ingredientName)) ? 'red-background' : ''}`} onClick={() => handleBank(getOutput(ingredientName))} >
                            {images[getOutput(ingredientName)] && (
                            <>
                                <img src={images[getOutput(ingredientName)]} alt={`${getOutput(ingredientName)}`} />
                                <span className="img-number">{siteCounts[getOutput(ingredientName)] || 0}</span> {/* Update this number dynamically as needed */}
                            </>
                            )}
                        </div>
                        {unlockables.belts1.unlocked && (
                            <div style={{marginBottom: "15px"}}>
                                <Bus 
                                    itemName={getOutput(ingredientName)} 
                                    lanes={lanes} 
                                    setLanes={setLanes} 
                                    networks={networks} 
                                    setNetworks={setNetworks} 
                                    siteCounts={siteCounts}
                                    setSiteCounts={setSiteCounts}
                                    ores={ores} 
                                    ingredients={ingredients}
                                    setOres={setOres} 
                                    setIngredients={setIngredients} 
                                    getStorage={getStorage}
                                    checkBelts={checkBelts} 
                                    debug={debug} 
                                    onAlert={onAlert}/>
                            </div>
                            )}
                        <Machines
                            unlockables={unlockables}
                            machineType={"furnace"}
                            ores={ores}
                            oreName={ingredientName}
                            ingredients={ingredients}
                            setOres={setOres}
                            setIngredients={setIngredients}
                            storage={storage}
                            getStorage={getStorage}
                            pendingMachineOutput={pendingMachineOutput}
                            setPendingMachineOutput={setPendingMachineOutput}
                            siteCounts={siteCounts}
                            updateSiteCounts={updateSiteCounts}
                            onAlert={onAlert}
                        />
                        </div>
                    ))}
        </>
    )
}

export default Furnaces