import React, { useState } from 'react';
import CraftQueue from './CraftQueue';
import images from './Images/images';

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

    // Determine which menu is visible to the player
    const [activeSection, setActiveSection] = useState('Intermediate Products');

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

    const IngredientList = ({ groupKey, unlockCondition, groupedIngredients, unlockables, checkCraft }) => {
        if (!unlockCondition) return null;
    
        return (
            <div className="ingredient-grid">
                {groupedIngredients[groupKey]?.map(([ingredientName, ingredientData]) => {
                    const isCraftable = ingredientData.isCraftable && unlockables.hammer1.unlocked;
                    const tempData = ingredientData.tempCount;

                    return (
                        <div 
                            key={`div-${ingredientName}`} 
                            className={`ingredient-item ${isCraftable ? 'craftable' : 'uncraftable'}`}
                            onClick={() => isCraftable && checkCraft(ingredientName)}
                        >
                            <img src={`${images[ingredientName]}`} alt={ingredientName} className="ingredient-image" />
                            <div className="ingredient-count">
                                {ingredientData.count} / {getStorage(ingredientName)} {tempData != 0 && `(${tempData})`} 
                                <br />
                                {ingredientData.idleCount > 0 && (`Available: ${ingredientData.idleCount}`)}
                                {ingredientData.idleCount === 0 && ingredientData.count > 0 && (`All in use`)}
                            </div>

                            <div className="ingredient-cost">
                            {Object.entries(ingredientData.cost).map(([costName, costAmount]) => (
                                <div key={`cost-${costName}`} className="cost-item">
                                    {costAmount} {costName}
                                </div>
                            ))}
                        </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const OreList = () => {
        return (
            <div className="ingredient-grid">
            {Object.entries(ores)
                .filter(([_, oreData]) => oreData.unlocked)
                .map(([oreName, oreData]) => {
                    const isCraftable = oreData.isCraftable && unlockables.hammer1.unlocked;
                    const tempData = oreData.tempCount;
                    return(
                        <div
                            key={`div-${oreName}`} 
                            className={`ingredient-item ${isCraftable ? 'craftable' : 'uncraftable'}`}
                            onClick={() => isCraftable && checkCraft(oreName)}
                        >
                            <img src={`${images[oreName]}`} alt={oreName} className="ingredient-image" />
                            <div className="ingredient-count">
                                {oreData.count} / {getStorage(oreName)} {tempData != 0 && `(${tempData})`}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }


    return (
        <div>
            <h2>Inventory</h2>
            <div className="inventory-div">
                <div className="section-navigation">
                    <button onClick={() => setActiveSection('Logistics')} className={activeSection === 'Logistics' ? 'active' : ''}>
                        <img src={`${images['Logistics']}`} alt={'Logistics'} className="menu-image" />
                    </button>
                    <button onClick={() => setActiveSection('Production')} className={activeSection === 'Production' ? 'active' : ''}>
                        <img src={`${images['Production']}`} alt={'Production'} className="menu-image" />
                    </button>
                    <button onClick={() => setActiveSection('Intermediate Products')} className={activeSection === 'Intermediate Products' ? 'active' : ''}>
                        <img src={`${images['Intermediate Products']}`} alt={'Intermediate Products'} className="menu-image" />
                    </button>
                </div>
        
                <div className='craftList'>
                    {craftQueue.length > 0 && (
                        <CraftQueue 
                            craftQueue={craftQueue}
                            currentCrafting={currentCrafting}
                            isAnimating={isAnimating} />
                    )}
                </div>
        
                {activeSection === 'Logistics' && (
                    <>
                        <IngredientList 
                            groupKey="l2" 
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
                    </>
                )}
        
                {activeSection === 'Production' && (
                    <>
                        <IngredientList 
                            groupKey="p3" 
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
                    </>
                )}
        
                {activeSection === 'Intermediate Products' && (
                    <>

                        <OreList />

                        <IngredientList 
                            groupKey="i3"
                            unlockCondition={true}  
                            groupedIngredients={groupedIngredients}
                            unlockables={unlockables}
                            checkCraft={checkCraft}
                        />
        
                        <IngredientList 
                            groupKey="i5"
                            unlockCondition={true}  
                            groupedIngredients={groupedIngredients}
                            unlockables={unlockables}
                            checkCraft={checkCraft}
                        />
                    </>
                )}
            </div>
        </div>
    );
    
};

export default Inventory;
