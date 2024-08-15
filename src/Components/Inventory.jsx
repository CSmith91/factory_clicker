import React, {useState, useEffect} from 'react';
import CraftQueue from './CraftQueue';
import CraftButton from './CraftButton';

const Inventory = ({ unlockables, setUnlockables, ores, ingredients, tools, setOres, setIngredients, setTools, setCraftCount, getStorage, onAlert }) => {



    // Function for crafting
    const checkCraft = (ingredientName) => {
    const toolName = 'Hammer';
    const ingredient = ingredients[ingredientName];

    if (!ingredient || !ingredient.cost) return;

    if(ingredients[ingredientName].count >= getStorage(ingredientName)){
      onAlert(`Storage is full. You cannot craft ${ingredientName}.`);
      return; // Exit the function if storage is full
    }

    // Check if the hammer has durability
    const tool = tools[toolName];
    if (!tool || tool.durability <= 0) {
        onAlert(`Your ${toolName} is broken. You cannot craft ${ingredientName}.`);
        return; // Exit the function if the tool is broken
    }

    // Check if there are enough resources to craft
    const hasEnoughResources = Object.entries(ingredient.cost).every(
      ([resourceName, amountRequired]) => {
        const resource = ores[resourceName] || ingredients[resourceName];
        return resource?.count >= amountRequired;
      }
    );

    if (!hasEnoughResources) {
      onAlert(`Not enough resources to craft ${ingredientName}`);
    }
    else{
        const craftTime = ingredients[ingredientName].craftTime;
        onCraft(ingredientName, ingredient, craftTime)
    }
    }

    const onCraft = (ingredientName, ingredient, craftTime) => {
        // Update the hammer's durability
        setTools(prevTools => {
            const toolName = "Hammer"
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

        // Deduct the costs from the resources
        const updatedOres = { ...ores };
        const updatedIngredients = { ...ingredients };

        Object.entries(ingredient.cost).forEach(([resourceName, amountRequired]) => {
        if (updatedOres[resourceName]) {
            updatedOres[resourceName].count -= amountRequired;
        } else if (updatedIngredients[resourceName]) {
            updatedIngredients[resourceName].count -= amountRequired;
        }
        });

        addToCraftQueue(ingredientName, ingredient, updatedIngredients, updatedOres)

        //craftPayout(ingredientName, ingredient, updatedIngredients, updatedOres)
    };

    const craftPayout = (ingredientName, ingredient, updatedIngredients, updatedOres) => {

        // Increment the crafted ingredient count
        updatedIngredients[ingredientName].count += 1;

        // Increment the idleCount if the ingredient is a machine
        if (ingredient.isMachine) {
        updatedIngredients[ingredientName].idleCount += 1;
        }

        setOres(updatedOres);
        setIngredients(updatedIngredients);

        // Update craftCount and unlock smelt1 if it’s the first successful craft
        setCraftCount(prevCount => {
        const newCount = prevCount + 1;

        if (newCount === 1) { // Check if this is the first successful craft
            setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            smelt1: { 
                ...prevUnlockables.smelt1,
                isVisible: true
            }
            }));

            setIngredients(prevIngredients => ({
            ...prevIngredients,
            "Brick": {
                ...prevIngredients["Brick"],
                unlocked: true 
            }
            }));
        }

        return newCount;
        });

    }


    // queue logic
    const [craftQueue, setCraftQueue] = useState([]); // for delays and queueing
    const [currentCrafting, setCurrentCrafting] = useState(null); // To manage the current crafting item
    const [isAnimating, setIsAnimating] = useState(false); // To manage animation state
    const addToCraftQueue = (ingredientName, ingredient, updatedIngredients, updatedOres) => {
        // Create a new item object with the parameters
        const newItem = {
        ingredientName,
        ingredient,
        updatedIngredients,
        updatedOres,
        };

        // Update the craftQueue state with the new item
        setCraftQueue(prevQueue => [...prevQueue, newItem]);
    };

    useEffect(() => {
        // If there's something in the queue and nothing is currently crafting
        if (craftQueue.length > 0 && !currentCrafting) {
          const [nextItem] = craftQueue; // Get the first item in the queue
          setCurrentCrafting(nextItem); // Set the current item as crafting
          setIsAnimating(true); // Start the animation
    
          const { ingredientName, ingredient, updatedIngredients, updatedOres } = nextItem;
    
          setTimeout(() => {
            craftPayout(ingredientName, ingredient, updatedIngredients, updatedOres); // Process crafting
            setIsAnimating(false); // End the animation
            setCurrentCrafting(null); // Reset current crafting item
    
            // Remove the first item from the queue
            setCraftQueue(prevQueue => prevQueue.slice(1));
          }, ingredient.craftTime * 1000);
        }
      }, [craftQueue, currentCrafting]);
      

    // Group ingredients by their group property
    const groupedIngredients = Object.entries(ingredients)
    .filter(([_, ingredientData]) => ingredientData.unlocked) // Check only unlocked
    .reduce((groups, [ingredientName, ingredientData]) => {
        // Initialize the group if not already created
        if (!groups[ingredientData.group]) {
            groups[ingredientData.group] = [];
        }
        // Append the ingredient to the correct group
        groups[ingredientData.group].push([ingredientName, ingredientData]);
        return groups;
    }, {});


    return (
        <div>
            <div className='craftList'>
                {/* Render CraftQueue only if craftQueue has items */}
                {craftQueue.length > 0 && (
                    <CraftQueue 
                        craftQueue={craftQueue}
                        currentCrafting={currentCrafting}
                        isAnimating={isAnimating} />
                )}
            </div>

            <h2>Inventory</h2>
            {unlockables.furnace1.unlocked && (
                <>
                    <h3>Production</h3>
                    <div className='p3'>
                        {groupedIngredients['p3']?.map(([ingredientName, ingredientData]) => {
                            const costText = Object.entries(ingredientData.cost)
                                .map(([resource, amount]) => `${amount} ${resource}`)
                                .join(', ');

                            return (
                                <div key={"div-" + ingredientName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {ingredientData.isCraftable && unlockables.hammer1.unlocked && <CraftButton key={"Craft" + ingredientName} ingredientName={ingredientName} checkCraft={checkCraft} />}
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                            {ingredientName} ({costText}): {ingredientData.count} / {getStorage(ingredientName)} {ingredientData.idleCount !== undefined && (
                                                <>
                                                    <br /> Idle Count: {ingredientData.idleCount}
                                                </>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                    <div className='p4'>
                        {groupedIngredients['p4']?.map(([ingredientName, ingredientData]) => {
                            const costText = Object.entries(ingredientData.cost)
                                .map(([resource, amount]) => `${amount} ${resource}`)
                                .join(', ');

                            return (
                                <div key={"div-" + ingredientName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {ingredientData.isCraftable && unlockables.hammer1.unlocked && <CraftButton key={"Craft" + ingredientName} ingredientName={ingredientName} checkCraft={checkCraft} />}
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                            {ingredientName} ({costText}): {ingredientData.count} / {getStorage(ingredientName)} {ingredientData.idleCount !== undefined && (
                                                <>
                                                    <br /> Idle Count: {ingredientData.idleCount}
                                                </>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                    
                    <h3>Intermediate Products</h3>
            </>
            )}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked) // Check only unlocked
                    .map(([oreName, oreData]) => (
                        <li key={oreName}>{oreName}: {oreData.count} / {getStorage(oreName)} </li>
                    ))}
            </ul>
            <div className='i3'>
                {groupedIngredients['i3']?.map(([ingredientName, ingredientData]) => {
                    const costText = Object.entries(ingredientData.cost)
                        .map(([resource, amount]) => `${amount} ${resource}`)
                        .join(', ');

                    return (
                        <div key={"div-" + ingredientName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ingredientData.isCraftable && unlockables.hammer1.unlocked && <CraftButton key={"Craft" + ingredientName} ingredients={ingredients} ingredientName={ingredientName} checkCraft={checkCraft} />}
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                    {ingredientName} ({costText}): {ingredientData.count} / {getStorage(ingredientName)} {ingredientData.idleCount !== undefined && (
                                        <>
                                            <br /> Idle Count: {ingredientData.idleCount}
                                        </>
                                    )}
                                </li>
                            </ul>
                        </div>
                    );
                })}
            </div>
            <div className='i5'>
                {groupedIngredients['i5']?.map(([ingredientName, ingredientData]) => {
                    const costText = Object.entries(ingredientData.cost)
                        .map(([resource, amount]) => `${amount} ${resource}`)
                        .join(', ');

                    return (
                        <div key={"div-" + ingredientName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ingredientData.isCraftable && unlockables.hammer1.unlocked && <CraftButton key={"Craft" + ingredientName} ingredients={ingredients} ingredientName={ingredientName} checkCraft={checkCraft} />}
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                    {ingredientName} ({costText}): {ingredientData.count} / {getStorage(ingredientName)} {ingredientData.idleCount !== undefined && (
                                        <>
                                            <br /> Idle Count: {ingredientData.idleCount}
                                        </>
                                    )}
                                </li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Inventory;
