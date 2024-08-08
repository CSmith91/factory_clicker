import React, { useState } from 'react';
import './App.css';
import OreSection from './Components/OreSection';
import Furnaces from './Components/Furnaces';
import Inventory from './Components/Inventory';

function App() {

  // Initial state for ores with canHandMine property
  const [ores, setOres] = useState({
    Wood: { count: 0, canHandMine: true },
    Stone: { count: 0, canHandMine: true },
    "Iron Ore": { count: 0, canHandMine: true },
    Coal: { count: 0, canHandMine: true },
    "Copper Ore": { count: 0, canHandMine: true },
    "Crude Oil": { count: 0, canHandMine: false },
    Uranium: { count: 0, canHandMine: false }
  });

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


  return (
    <>
      <div className="App" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Ore Patch Section */}
            <OreSection ores={ores} onIncrement={onIncrement} />

            {/* Furnaces Section */}
            <Furnaces />

            {/* Inventory Section */}
            <Inventory ores={ores} />
          </div>
      </div>
    </>
  );
}

export default App;
