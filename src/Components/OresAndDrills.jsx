import React, { useState } from 'react';
import Machines from './Machines';
import OreButton from './OreButton';
import Bus from './Bus'
import images from './Images/images';

const OresAndDrills = ({ 
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
    handleMachineChange, 
    networks,
    setNetworks,
    checkBus,
    lanes,
    setLanes,
    onAlert }) => {

    const [outputCounts, setOutputCounts] = useState({});

    // Function to update the output count
    const updateOutputCount = (oreName, manOrMachine) => {

        if(outputCounts[oreName] >= getStorage(oreName)){
            if(manOrMachine === 'manual'){
                onAlert(`Storage is full. You cannot mine ${oreName}.`);
            }
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

        if(ores["Stone"].patch.size === 119988){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                pick2: { 
                    ...prevUnlockables.pick2,
                    isVisible: true
                }
                }));
        }

        if(ores["Wood"].harvested === 20){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                axe2: { 
                    ...prevUnlockables.axe2,
                    isVisible: true
                }
                }));
        }

        if(ores["Wood"].harvested === 30){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                storage1: { 
                    ...prevUnlockables.storage1,
                    isVisible: true
                }
            }));
        }

        if(ores["Iron Ore"].patch.size === 349998){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                drill1: { 
                    ...prevUnlockables.drill1,
                    isVisible: true
                }
                }));
        }

        if(ores["Iron Ore"].patch.size === 349972){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                belts1: { 
                    ...prevUnlockables.belts1,
                    isVisible: true
                }
                }));
        }

        if(ores["Iron Ore"].patch.size === 349955){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                coal1: { 
                    ...prevUnlockables.coal1,
                    isVisible: true
                }
                }));
        }

        if(ores["Iron Ore"].patch.size === 349935){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            storage2: { 
              ...prevUnlockables.storage2,
              isVisible: true
            }
        }))
        }

        if(ores["Wood"].harvested === 45){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                copper1: { 
                    ...prevUnlockables.copper1,
                    isVisible: true
                }
                }));
        }
        
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

        if (!ore) {
            console.error(`Ore ${oreName} not found.`);
            return;
        }
    
        if (ore.count >= storageLimit) {
            onAlert(`${oreName} is full.`);
            return
        }

        const newCount = ore.count + currentCount;

        if (newCount > storageLimit) {
            const partialAddCount = storageLimit - ore.count;
            updateOreAndOutputCounts(oreName, partialAddCount, currentCount - partialAddCount);
        } else if (currentCount > 0) {
            updateOreAndOutputCounts(oreName, currentCount, 0);
        }
        
    };
    
    const updateOreAndOutputCounts = (oreName, oreCountToAdd, remainingOutputCount) => {
        setOres(prevOres => {
            const ore = prevOres[oreName];
            if (!ore) {
                console.error(`Ore ${oreName} not found in state.`);
                return prevOres;
            }

            return {
                ...prevOres,
                [oreName]: {
                    ...ore,
                    count: ore.count + oreCountToAdd
                }
            };
        });

        setOutputCounts(prevCounts => ({
            ...prevCounts,
            [oreName]: remainingOutputCount
        }));
    };

    const isStorageFull = (oreName) => { 
        const currentStorage = outputCounts[oreName] || 0;
        const storageLimit = getStorage(oreName);
    
        if (currentStorage >= storageLimit) {
            return true;
        }
        return false;
    };

    

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
                            {unlockables.belts1.unlocked && (
                                <Bus itemName={oreName} lanes={lanes} setLanes={setLanes} networks={networks} setNetworks={setNetworks} ingredients={ingredients} checkBus={checkBus} onAlert={onAlert} />
                            )}
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