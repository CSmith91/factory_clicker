import React, { useState } from 'react';
import Machines from './Machines';
import OreButton from './OreButton';
import images from './Images/images';

const OresAndDrills = ({ setUnlockables, ores, ingredients, tools, setOres, setIngredients, storage, getStorage, setTools, handleMachineChange, onAlert }) => {

    const [outputCounts, setOutputCounts] = useState({});

    // Function to update the output count
    const updateOutputCount = (oreName, manOrMachine) => {

        if(outputCounts[oreName] >= getStorage(oreName)){
            if(manOrMachine === 'manual'){
                onAlert(`Storage is full. You cannot mine ${oreName}.`);
            }
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                storage1: { 
                  ...prevUnlockables.storage1,
                  isVisible: true
                }
            }))
            return; // Exit the function if storage is full
        }

        // Check if the tool is usable before incrementing
        const toolName = oreName === 'Wood' ? 'Axe' : 'Pickaxe';
        const tool = tools[toolName];

        if ((manOrMachine === 'manual' && tool.durability <= 0 ) || !tool) {
            onAlert(`Your ${toolName} is broken. You cannot mine ${oreName}.`);
            return; // Exit the function if the tool is broken
        }

        // If the tool is usable, proceed with incrementing the ore and output count
        onIncrement(oreName, toolName, manOrMachine);

        setOutputCounts(prevCounts => ({
            ...prevCounts,
            [oreName]: (prevCounts[oreName] || 0) + 1
        }));
    };


    // Function to increment the ore count
    const onIncrement = (oreName, toolName, manOrMachine) => {
        
        if(manOrMachine === "manual"){
            // Update the tool's durability
            setTools(prevTools => {
            const tool = prevTools[toolName];
            const updatedDurability = tool.durability - tool.corrodeRate;
            return {
                ...prevTools,
                [toolName]: {
                    ...tool,
                    durability: Math.max(0, updatedDurability)
                }
            };
            });
        }

        // Increment the ore count only if the tool had durability or machine-mined
        setOres(prevOres => {
            const tool = tools[toolName];
            if (tool.durability > 0 || !manOrMachine === 'manual') {
                // update patch, if applicable
                const updatedPatch = prevOres[oreName].patch
                ? { ...prevOres[oreName].patch, size: prevOres[oreName].patch.size - 1 }
                : undefined;
                //update harvest, if applicable
                const updatedHarvest = prevOres[oreName].harvested !== undefined
                ? prevOres[oreName].harvested + 1
                : undefined;

                return {
                    ...prevOres,
                    [oreName]: {
                        ...prevOres[oreName],
                        harvested: updatedHarvest,
                        patch: updatedPatch
                    }
                };
            }
            return prevOres;
        });
    };

    const handleBank = (oreName) => {
        const currentCount = outputCounts[oreName] || 0;
        const ore = ores[oreName];
        const storageLimit = getStorage(oreName);
    
        if (ore.count >= storageLimit) {
            onAlert(`${oreName} is full.`);
        } else {
            const newCount = ore.count + currentCount;
    
            if (newCount > storageLimit) {
                const partialAddCount = storageLimit - ore.count;
                updateOreAndOutputCounts(oreName, partialAddCount, currentCount - partialAddCount);
            } else if (currentCount > 0) {
                updateOreAndOutputCounts(oreName, currentCount, 0);
            }
        }
    };
    
    const updateOreAndOutputCounts = (oreName, oreCountToAdd, remainingOutputCount) => {
        setOres(prevOres => ({
            ...prevOres,
            [oreName]: {
                ...prevOres[oreName],
                count: prevOres[oreName].count + oreCountToAdd
            }
        }));
    
        setOutputCounts(prevCounts => ({
            ...prevCounts,
            [oreName]: remainingOutputCount
        }));
    };

    const isStorageFull = (oreName) => { 
        const limit = outputCounts[oreName] || 0
        if(limit >= getStorage(oreName)){
            return true
        }
        else{
            return false
        }
    }

    

    return (
        <>
            <div>
                <h2>Resource Patches</h2>
                {/* <h6>|  |  |  collapsable icons  |  |  |</h6> */}
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked)
                    .map(([oreName, oreData]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{oreName}</h3>
                            <div key={oreName+"Div"} className={'oreDiv'}>
                                {oreData.canHandMine ? (
                                    <div style={{marginTop: '-3px'}} >
                                        <OreButton key={oreName} ores={ores} oreName={oreName} outputCounts={outputCounts} updateOutputCount={updateOutputCount} getStorage={getStorage} /> 
                                    </div>
                                ) : (<></>)}
                                <div key={oreName+"ImgDiv"} className={`imgdiv ${isStorageFull(oreName) ? 'red-background' : ''}`} onClick={() => handleBank(oreName)} >
                                {images[oreName] && (
                                    <>
                                        <img src={images[oreName]} alt={`${oreName} Img`} />
                                        <span className="img-number">{outputCounts[oreName] || 0}</span> {/* Update this number dynamically as needed */}
                                    </>
                                )}
                                </div>

                            </div>
                            {oreData.patch !== undefined ? (
                                <p>{oreName} patch remaining: {oreData.patch.size}</p> 
                            ) : (
                                <p>{oreName} harvested: {oreData.harvested}</p> 
                            )}
                            {/* DRILLS */}
                            {oreData.canDrill ? (
                                <Machines
                                machineType={"drill"} 
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
                                ) : (<></>)}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default OresAndDrills;