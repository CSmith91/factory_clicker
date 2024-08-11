import React from 'react';
import CraftButton from './CraftButton';

const Inventory = ({ ores, ingredients, onCraft }) => {

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
            <h2>Inventory</h2>
            <h3>Production</h3>
            <div className='p4'>
                {groupedIngredients['p4']?.map(([ingredientName, ingredientData]) => {
                    const costText = Object.entries(ingredientData.cost)
                        .map(([resource, amount]) => `${amount} ${resource}`)
                        .join(', ');

                    return (
                        <div key={"div-" + ingredientName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ingredientData.isCraftable && <CraftButton key={"Craft" + ingredientName} ingredientName={ingredientName} onCraft={onCraft} />}
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                    {ingredientName} ({costText}): {ingredientData.count} {ingredientData.idleCount !== undefined && (
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
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked) // Check only unlocked
                    .map(([oreName, oreData]) => (
                        <li key={oreName}>{oreName}: {oreData.count}</li>
                    ))}
            </ul>
            <div className='i3'>
                {groupedIngredients['i3']?.map(([ingredientName, ingredientData]) => {
                    const costText = Object.entries(ingredientData.cost)
                        .map(([resource, amount]) => `${amount} ${resource}`)
                        .join(', ');

                    return (
                        <div key={"div-" + ingredientName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ingredientData.isCraftable && <CraftButton key={"Craft" + ingredientName} ingredientName={ingredientName} onCraft={onCraft} />}
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                    {ingredientName} ({costText}): {ingredientData.count} {ingredientData.idleCount !== undefined && (
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
                            {ingredientData.isCraftable && <CraftButton key={"Craft" + ingredientName} ingredientName={ingredientName} onCraft={onCraft} />}
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                    {ingredientName} ({costText}): {ingredientData.count} {ingredientData.idleCount !== undefined && (
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
