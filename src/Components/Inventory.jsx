import React from 'react';
import CraftQueue from './CraftQueue';
import CraftButton from './CraftButton';

const Inventory = ({ 
    unlockables, 
    ores, 
    ingredients, 
    getStorage, 
    checkCraft,
    craftQueue,
    currentCrafting,
    isAnimating
    }) => {

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

    const IngredientList = ({ groupKey, title, unlockCondition, groupedIngredients, unlockables, checkCraft }) => {
        if (!unlockCondition) return null;
    
        return (
            <>
                {title && <h3>{title}</h3>}
                <div className={groupKey}>
                    {groupedIngredients[groupKey]?.map(([ingredientName, ingredientData]) => {
                        const costText = Object.entries(ingredientData.cost)
                            .map(([resource, amount]) => `${amount} ${resource}`)
                            .join(', ');
    
                        return (
                            <div key={`div-${ingredientName}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {ingredientData.isCraftable && unlockables.hammer1.unlocked && (
                                    <CraftButton 
                                        key={`Craft${ingredientName}`} 
                                        ingredientName={ingredientName} 
                                        checkCraft={checkCraft} 
                                    />
                                )}
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                        {ingredientName} {ingredients[ingredientName].multiplier && (`[${ingredients[ingredientName].multiplier}]`)} ({costText}): {ingredientData.count} / {getStorage(ingredientName)} 
                                        {ingredientData.idleCount !== undefined && (
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
            </>
        );
    };


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
            <IngredientList 
            groupKey="l2" 
            title="Logistics"
            unlockCondition={unlockables.belts1.unlocked}
            groupedIngredients={groupedIngredients}
            unlockables={unlockables}
            checkCraft={checkCraft}
        />

            <IngredientList 
            groupKey="l3" 
            unlockCondition={unlockables.inserters1.unlocked}
            groupedIngredients={groupedIngredients}
            unlockables={unlockables}
            checkCraft={checkCraft}
        />

        <IngredientList 
            groupKey="p3" 
            title="Production"
            unlockCondition={unlockables.furnace1.unlocked}
            groupedIngredients={groupedIngredients}
            unlockables={unlockables}
            checkCraft={checkCraft}
        />

        <IngredientList 
            groupKey="p4"
            unlockCondition={unlockables.furnace1.unlocked}
            groupedIngredients={groupedIngredients}
            unlockables={unlockables}
            checkCraft={checkCraft}
        />

        <h3>Intermediate Products</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(ores)
                .filter(([_, oreData]) => oreData.unlocked)
                .map(([oreName, oreData]) => (
                    <li key={oreName}>{oreName}: {oreData.count} / {getStorage(oreName)} </li>
                ))}
        </ul>

        <IngredientList 
            groupKey="i3"
            unlockCondition={true}  // Assuming this section is always visible
            groupedIngredients={groupedIngredients}
            unlockables={unlockables}
            checkCraft={checkCraft}
        />

        <IngredientList 
            groupKey="i5"
            unlockCondition={true}  // Assuming this section is always visible
            groupedIngredients={groupedIngredients}
            unlockables={unlockables}
            checkCraft={checkCraft}
        />
    </div>
    );
};

export default Inventory;
