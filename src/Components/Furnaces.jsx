import React, { useState } from "react";
import Machines from "./Machines";
import brick from './Images/brick.png'
import ironPlate from './Images/iron_plate.png'
import copperPlate from './Images/copper_plate.png'
import steel from './Images/steel.png'

const Furnaces = ({ setUnlockables, ores, ingredients,  setOres, setIngredients,  storage, getStorage, handleMachineChange, onAlert }) => {

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

    // load image of ingredient
    const getFurnaceImage  = (oreName) => {
        switch (oreName) {
            case 'Stone':
                return brick;
            case 'Iron Ore':
                return ironPlate;
            case 'Copper Ore':
                return copperPlate;
            case 'Iron Plate':
                return steel;
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
                      ...prevUnlockables.storage1,
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

    return(
        <>
        <h2>Furnaces</h2>
        <h6>|  |  |  collapsable icons  |  |  |</h6>
                {Object.entries(ores)
                    .filter(([oreName, oreData]) => getUnlockStatus(oreName) && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <div key={oreName+"ImgDiv"} className="imgdiv" onClick={() => handleBank(oreName)} >
                                {getFurnaceImage(oreName) && (
                                    <>
                                        <img src={getFurnaceImage(oreName)} alt={`${getOutput(oreName)} Image`} />
                                        <span className="img-number">{outputCounts[getOutput(oreName)] || 0} / {getStorage(getOutput(oreName))}</span> {/* Update this number dynamically as needed */}
                                    </>
                                )}
                            </div>
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
                        <div key={ingredientName + "ImgDiv"} className="imgdiv" onClick={() => handleBank(ingredientName)} >
                            {getFurnaceImage(ingredientName) && (
                            <>
                                <img src={getFurnaceImage(ingredientName)} alt={`${getOutput(ingredientName)} Image`} />
                                <span className="img-number">{outputCounts[getOutput(ingredientName)] || 0} / {getStorage(ingredientName)}</span> {/* Update this number dynamically as needed */}
                            </>
                            )}
                        </div>
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