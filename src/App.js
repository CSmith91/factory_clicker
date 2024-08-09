import React, { useState } from 'react';
import './App.css';
import OreSection from './Components/OreSection';
import Furnaces from './Components/Furnaces';
import Inventory from './Components/Inventory';
import Research from './Components/Research';
import TestMode from './Components/TestMode'

function App() {

  const testMode = true

   // Initial state for ores with unlocked and canHandMine properties
  const [ores, setOres] = useState({
    Wood: { count: 0, canHandMine: true, unlocked: true, isFuel: true },
    Stone: { count: 0, canHandMine: true, unlocked: true, canFurnace: true },
    "Iron Ore": { count: 0, canHandMine: true, unlocked: true, canFurnace: true },
    Coal: { count: 0, canHandMine: true, unlocked: testMode, isFuel: true },
    "Copper Ore": { count: 0, canHandMine: true, unlocked: testMode, canFurnace: true },
    "Crude Oil": { count: 0, canHandMine: false, unlocked: testMode },
    Uranium: { count: 0, canHandMine: false, unlocked: testMode }
  });

  const [ingredients, setIngredients] = useState({
    "Stone Furnace": { group: 'p4', count: 0, unlocked: testMode, cost: {"Stone": 5}, isCraftable: true, craftTime: 0.5, isFuel: false, isMachine: true, isBurner: true, machineSpeed: 1, idleCount: 0},
    "Gear" : { group: 'i5', count: 0, unlocked: testMode, cost: {"Iron Plate": 2}, isCraftable: true, craftTime: 0.5 }
  })

  // Research items with their costs
  const researchItems = {
    "Coal": { cost: {"Stone" : 5, "Wood": 10} },
    "Copper Ore": { cost: { "Iron Ore": 20 } },

  };

  // TestMode (Cheat Mode)
  const onCheat = (oreName) => {
    setOres(prevOres => ({
      ...prevOres,
      [oreName]: {
        ...prevOres[oreName],
        count: prevOres[oreName].count + 50
      }
    }));

  }

  // Function to increment the ore count
  const onIncrement = (oreName) => {
    setOres(prevOres => ({
      ...prevOres,
      [oreName]: {
        ...prevOres[oreName],
        count: prevOres[oreName].count + 1
      }
    }));
  };

  // Function to unlock ores
  const onUnlock = (oreName) => {

    const requiredItems = researchItems[oreName]?.cost;
    if (!requiredItems) return; // No cost defined for this research item

    let canUnlock = true;
    let newOres = { ...ores };

    // Check if the user has enough resources
    for (const [item, quantity] of Object.entries(requiredItems)) {
      if ((newOres[item]?.count || 0) < quantity) {
        canUnlock = false;
        break;
      }
    }

    if (canUnlock) {
      // Deduct the required resources
      for (const [item, quantity] of Object.entries(requiredItems)) {
        newOres[item].count -= quantity;
      }
      // Unlock the item
      newOres[oreName] = {
        ...newOres[oreName],
        unlocked: true
      };
      setOres(newOres);
    } else {
      alert("Not enough resources to unlock this item.");
    }
  };

  return (
    <>
      <div className="App" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Ore Patch Section */}
            <div className='section'>
              <OreSection ores={ores} onIncrement={onIncrement} />
            </div>

            {/* Furnaces Section
            <div className='section'>
              <Furnaces />
            </div> */}

            {/* Inventory Section */}
            <div className='section'>
              <Inventory ores={ores} ingredients={ingredients} />
            </div>

            <div className='section'>
              {testMode ? (
                < TestMode ores={ores} ingredients={ingredients} onCheat={onCheat} />
              ) : (
                <Research ores={ores} ingredients={ingredients} onUnlock={onUnlock} researchItems={researchItems} />
              )}
            </div>
          </div>
      </div>
    </>
  );
}

export default App;
