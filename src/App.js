import React, { useState } from 'react';
import './App.css';
import OreSection from './Components/OreSection';
import Furnaces from './Components/Furnaces';
import Inventory from './Components/Inventory';
import Research from './Components/Research';

function App() {

   // Initial state for ores with unlocked and canHandMine properties
  const [ores, setOres] = useState({
    Wood: { count: 0, canHandMine: true, unlocked: true },
    Stone: { count: 0, canHandMine: true, unlocked: true },
    "Iron Ore": { count: 0, canHandMine: true, unlocked: true },
    Coal: { count: 0, canHandMine: true, unlocked: false },
    "Copper Ore": { count: 0, canHandMine: true, unlocked: false },
    "Crude Oil": { count: 0, canHandMine: false, unlocked: false },
    Uranium: { count: 0, canHandMine: false, unlocked: false }
  });

  // Research items with their costs
  const researchItems = {
    "Coal": { cost: {"Stone" : 5} },
    "Copper Ore": { cost: { "Iron Ore": 20 } },

  };
  

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
              <Inventory ores={ores} />
            </div>

            <div className='section'>
              <Research ores={ores} onUnlock={onUnlock} researchItems={researchItems} />
            </div>
          </div>
      </div>
    </>
  );
}

export default App;
