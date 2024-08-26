const Expansion = ({ores, ingredients, onUnlock, handleBeltUnlock, expandables, lanes, setLanes}) => {

    const bus = lanes;

    const renderBus = () => {
        return Object.keys(bus).map(itemName => {
          const lanes = bus[itemName];
          const firstUnlockedUnclearedLaneKey = Object.keys(lanes).find(
            lane => lanes[lane].unlocked && !lanes[lane].clear
          );
      
          // Ensure firstUnlockedUnclearedLaneKey is valid before proceeding
          if (!firstUnlockedUnclearedLaneKey) {
            return null;
          }
      
          const firstUnlockedUnclearedLane = lanes[firstUnlockedUnclearedLaneKey];
          const cost = firstUnlockedUnclearedLane.cost;
          const gain = firstUnlockedUnclearedLane.gain;

          // Check if the corresponding ore or ingredient is unlocked
          const isResourceUnlocked = ores[itemName]?.unlocked || ingredients[itemName]?.unlocked;

          // If the resource is not unlocked, don't render the button
          if (!isResourceUnlocked) {
              return null;
          }
      
          // Check if the user has enough resources to unlock this item
          const canUnlock = Object.entries(cost).every(([item, quantity]) => {
            const oreCount = ores[item]?.count || 0;
            const ingredientCount = ingredients[item]?.count || 0;
            return (oreCount + ingredientCount) >= quantity;
          });
      
          return (
            <div key={itemName+'div'} style={{ margin: '10px' }}>
              <button 
                onClick={() => handleBeltUnlock(itemName, firstUnlockedUnclearedLaneKey)}
                disabled={!canUnlock}
                style={{ padding: '10px', borderRadius: '10px', margin: '5px', backgroundColor: canUnlock ? 'lightgreen' : 'lightcoral' }}>
                
                {itemName}: Clear lane {firstUnlockedUnclearedLane.no || "No available lane"}
                <br />
                {canUnlock ? 
                  `Use ${Object.entries(cost).map(([item, quantity]) => `${quantity} ${item}`).join(', ')}` : 
                  `(Requires ${Object.entries(cost).map(([item, quantity]) => `${quantity} ${item}`).join(', ')})`
                }
                <br />
                Gain: {Object.entries(gain).map(([item, quantity]) => `${quantity} ${item}`).join(', ')}
              </button>
            </div>
          );
        });
      };
    

    return(
        <>
            <h3>Expansion</h3>
            <h4>Belts</h4>
            <div>
                {renderBus()}
            </div>
            {Object.keys(expandables)
            .filter(itemName => !expandables[itemName]?.unlocked) // Filter out already unlocked items
            .map(itemName => {
                const cost = expandables[itemName].cost;

                // Check if the user has enough resources for this unlockable item
                const canUnlock = Object.entries(cost).every(([item, quantity]) => {
                    const oreCount = ores[item]?.count || 0;
                    const ingredientCount = ingredients[item]?.count || 0;
                    return (oreCount + ingredientCount) >= quantity;
                });

                return (
                    <div key={itemName+'div'}>
                        {expandables[itemName].isVisible && (
                        <div key={itemName} style={{ margin: '10px' }}>
                            <button
                                onClick={() => onUnlock(itemName)}
                                disabled={!canUnlock}
                                style={{ padding: '10px', borderRadius: '10px', margin: '5px', backgroundColor: canUnlock ? 'lightgreen' : 'lightcoral' }}>
                                <b>{expandables[itemName].title}</b>
                                <br />
                                {expandables[itemName].desc}
                                <br />
                                {canUnlock ? `Use ${Object.entries(cost).map(([item, quantity]) => `${quantity} ${item}`).join(', ')}` : `(Requires ${Object.entries(cost).map(([item, quantity]) => `${quantity} ${item}`).join(', ')})`}
                            </button>
                        </div>
                        )}
                    </div>
                );
            })}
        </>
    )
}

export default Expansion