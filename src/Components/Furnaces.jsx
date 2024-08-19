import React, { useState } from "react";
import Machines from "./Machines";
import Bus from "./Bus";
import images from './Images/images';

const Furnaces = ({ 
    unlockables, 
    setUnlockables, 
    ores, 
    ingredients,  
    setOres, 
    setIngredients,  
    storage, 
    getStorage, 
    handleMachineChange, 
    networks, 
    setNetworks,               
    lanes,
    setLanes,
    onAlert }) => {

    const [outputCounts, setOutputCounts] = useState({});

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

    // Function to update the output count
    const updateOutputCount = (output, amount) => {
        setOutputCounts(prevCounts => ({
            ...prevCounts,
            [output]: (prevCounts[output] || 0) + amount
        }));
    };

    const handleBank = (oreName) => {
        const outputName = getOutput(oreName);
        if (!outputName) return;
    
        const currentCount = outputCounts[outputName] || 0;
        const ingredient = ingredients[outputName];
        const storageLimit = getStorage(outputName);
    
        if (ingredient.count >= storageLimit) {
            onAlert(`${outputName} is full.`);
        } else {
            const newCount = ingredient.count + currentCount;
    
            if (newCount > storageLimit) {
                const partialAddCount = storageLimit - ingredient.count;
                setUnlockables(prevUnlockables => ({
                    ...prevUnlockables,
                    storage2: { 
                      ...prevUnlockables.storage2,
                      isVisible: true
                    }
                }))
                updateIngredientAndResetOutput(outputName, partialAddCount, currentCount - partialAddCount);
            } else if (currentCount > 0) {
                updateIngredientAndResetOutput(outputName, currentCount, 0);
            }
        }
    };
    
    const updateIngredientAndResetOutput = (itemName, countToAdd, remainingOutputCount) => {
        setIngredients(prevIngs => ({
            ...prevIngs,
            [itemName]: {
                ...prevIngs[itemName],
                count: prevIngs[itemName].count + countToAdd
            }
        }));
    
        setOutputCounts(prevCounts => ({
            ...prevCounts,
            [itemName]: remainingOutputCount
        }));
    };
    

    const getUnlockStatus = (oreName) => {
        if(ingredients[getOutput(oreName)]){
            return ingredients[getOutput(oreName)].unlocked
        }
        else{
            return true
        }
    }

    const isStorageFull = (oreName) => { 
        const limit = outputCounts[oreName] || 0
        if(limit >= getStorage(oreName)){
            return true
        }
        else{
            return false
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
                            <div key={oreName+"ImgDiv"} className={`imgdiv ${isStorageFull(getOutput(oreName)) ? 'red-background' : ''}`} onClick={() => handleBank(oreName)} >
                                {images[getOutput(oreName)] && (
                                    <>
                                        <img src={images[getOutput(oreName)]} alt={`${getOutput(oreName)} Image`} />
                                        <span className="img-number">{outputCounts[getOutput(oreName)] || 0}</span> {/* Update this number dynamically as needed */}
                                    </>
                                )}
                            </div>
                            {unlockables.belts1.unlocked && (
                                <Bus itemName={getOutput(oreName)} lanes={lanes} setLanes={setLanes}/>
                            )}
                            <Machines
                                machineType={"furnace"}
                                ores={ores} 
                                oreName={oreName} 
                                ingredients={ingredients} 
                                setOres={setOres} 
                                setIngredients={setIngredients}
                                storage={storage}
                                getStorage={getStorage}
                                handleMachineChange={handleMachineChange}
                                outputCounts={outputCounts}
                                updateOutputCount={updateOutputCount}
                                onAlert={onAlert} 
                                />
                        </div>
                    ))}
                    {Object.entries(ingredients || {})
                    .filter(([ingredientName, ingredientData]) => getUnlockStatus(ingredientName) && ingredientData?.canFurnace)
                    .map(([ingredientName, _]) => (
                        <div key={ingredientName + "HarvestDiv"}>
                        <h3>{getOutput(ingredientName)}</h3>
                        <div key={ingredientName + "ImgDiv"} className={`imgdiv ${isStorageFull(getOutput(ingredientName)) ? 'red-background' : ''}`} onClick={() => handleBank(ingredientName)} >
                            {images[getOutput(ingredientName)] && (
                            <>
                                <img src={images[getOutput(ingredientName)]} alt={`${getOutput(ingredientName)} Image`} />
                                <span className="img-number">{outputCounts[getOutput(ingredientName)] || 0}</span> {/* Update this number dynamically as needed */}
                            </>
                            )}
                        </div>
                        {unlockables.belts1.unlocked && (
                                <Bus itemName={getOutput(ingredientName)} lanes={lanes} setLanes={setLanes}/>
                            )}
                        <Machines
                            machineType={"furnace"}
                            ores={ores}
                            oreName={ingredientName}
                            ingredients={ingredients}
                            setOres={setOres}
                            setIngredients={setIngredients}
                            storage={storage}
                            getStorage={getStorage}
                            handleMachineChange={handleMachineChange}
                            outputCounts={outputCounts}
                            updateOutputCount={updateOutputCount}
                            onAlert={onAlert}
                        />
                        </div>
                    ))}
        </>
    )
}

export default Furnaces