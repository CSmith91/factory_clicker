import React, { useState } from 'react';
import Machines from './Machines';
import OreButton from './OreButton';
import wood from './Images/wood.png'
import ironOre from './Images/iron_ore.png'
import copperOre from './Images/copper_ore.png'
import stone from './Images/stone.png'
import coal from './Images/coal.png'
import uraniumOre from './Images/uranium_ore.png'
import crudeOil from './Images/crude_oil.png'

const OreSection = ({ ores, ingredients, tools, setOres, setIngredients, setTools, handleMachineChange, onAlert }) => {

    const [outputCounts, setOutputCounts] = useState({});

    // load image of ingredient
    const getImage  = (oreName) => {
        switch (oreName) {
            case 'Wood':
                return wood;
            case 'Iron Ore':
                return ironOre;
            case 'Copper Ore':
                return copperOre;
            case 'Stone':
                return stone;
            case 'Coal':
                return coal;
            case 'Crude Oil':
                return crudeOil;
            case 'Uranium Ore':
                return uraniumOre;
            default:
                return null
        }
    }

    // Function to update the output count
    const updateOutputCount = (oreName, manOrMachine) => {
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

        // Increment the ore count only if the tool had durability
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
        if (currentCount > 0) {
            // Update ingredient
            const itemName = oreName;
            setOres(prevIngs => ({
                ...prevIngs,
                [itemName]: {
                    ...prevIngs[itemName],
                    count: prevIngs[itemName].count + currentCount
                }
            }));

            // Reset output count
            setOutputCounts(prevCounts => ({
                ...prevCounts,
                [itemName]: 0
            }));
        }
    };

    return (
        <>
            <div>
                <h2>Resource Patches</h2>
                <h6>|  |  |  collapsable icons  |  |  |</h6>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked)
                    .map(([oreName, oreData]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{oreName}</h3>
                            <div key={oreName+"ImgDiv"} className="imgdiv" onClick={() => handleBank(oreName)} >
                                {getImage(oreName) && (
                                    <>
                                        <img src={getImage(oreName)} alt={`${oreName} Img`} />
                                        <span className="img-number">{outputCounts[oreName] || 0}</span> {/* Update this number dynamically as needed */}
                                    </>
                                )}
                            </div>
                            {oreData.canHandMine ? (
                                <OreButton key={oreName} oreName={oreName} updateOutputCount={updateOutputCount}/> 
                                ) : (<></>)}
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
                                handleMachineChange={handleMachineChange} 
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

export default OreSection;