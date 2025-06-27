import './Sites.css';
import Site from '../../src/Components/Site';

const Sites = () => {

    const maxSites = 9;
    const siteIds = Array.from({ length: maxSites }, (_, i) => i + 1);

    return (
        <div>
            <h2>Sites</h2>
            <div className="inventory-div">
                <div className="sites-navigation">
                    {siteIds.map(id => (
                        <Site key={id} siteId={id} />
                    ))}                 
                </div>
        
                {/* <div className='craftList'>
                    {craftQueue && craftQueue.length > 0 && (
                        <CraftQueue 
                            craftQueue={craftQueue}
                            currentCrafting={currentCrafting}
                            isAnimating={isAnimating}
                            cancelCraft={cancelCraft} 
                            debug={debug} />
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
                )} */}
            </div>
        </div>
    );
};

export default Sites;