import React, { useState } from 'react';
import './App.css';
import OreSection from './Components/OreSection';
import Inventory from './Components/Inventory';
import Research from './Components/Research';
import TestMode from './Components/TestMode';
import Messages from './Components/Messages';
import AudioPlayer from './Components/AudioPlayer';
import StatusSection from './Components/StatusSection';
import RepairTools from './Components/RepairTools';

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
    "Uranium Ore": { count: 0, canHandMine: false, unlocked: testMode }
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

  // Tools
  const [tools, setTools] = useState ({
    Axe: { durability: 100, corrodeRate: 0.25, cost: {"Stone": 2}, unlocked: true},
    Pickaxe: { durability: 100, corrodeRate: 0.5, cost: {"Wood": 5},unlocked: true},
    Hammer: { durability: 100, corrodeRate: 1.5, cost: {"Wood": 5, "Stone": 5},unlocked: testMode}
  })

  // Messages & sound
  const [messages, setMessages] = useState([])
  const [playAudio, setPlayAudio] = useState(false); // State to trigger audio playback


  // Function to add alerts for the player
  const onAlert = (message) => {
    const id = Date.now(); // Unique identifier for the message
    setMessages(prevMessages => [...prevMessages, { id, text: message }]);
    setPlayAudio(true); // Trigger audio playback

    // Remove the message after 5 seconds
    setTimeout(() => {
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
    }, 5000);
    setTimeout(() => {
      setPlayAudio(false);
    }, 100);
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
    const toolName = oreName === 'Wood' ? 'Axe' : 'Pickaxe';
    
    setTools(prevTools => {
      const tool = prevTools[toolName];
      if (!tool || tool.durability <= 0) {
          onAlert(`Your ${toolName} is broken. You cannot mine ${oreName}.`);
          return prevTools;
      }

      const updatedDurability = tool.durability - tool.corrodeRate;

      // Update the tool's durability
      return {
          ...prevTools,
          [toolName]: {
              ...tool,
              durability: Math.max(0, updatedDurability)
          }
      };
    });

    // Increment the ore count only if the tool had durability
    setOres(prevOres => {
      const tool = tools[toolName];
      if (tool.durability > 0) {
          return {
              ...prevOres,
              [oreName]: {
                  ...prevOres[oreName],
                  count: prevOres[oreName].count + 1
              }
          };
      }
      return prevOres;
  });
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
      onAlert("Not enough resources to unlock this item.");
    }
  };

  // Function for crafting
  const onCraft = (ingredientName) => {
    const toolName = 'Hammer';
    const ingredient = ingredients[ingredientName];

    if (!ingredient || !ingredient.cost) return;

    const hasEnoughResources = Object.entries(ingredient.cost).every(
      ([resourceName, amountRequired]) => {
        const resource = ores[resourceName] || ingredients[resourceName];
        return resource?.count >= amountRequired;
      }
    );

    if (!hasEnoughResources) {
      onAlert(`Not enough resources to craft ${ingredientName}`);
      return;
    }

    // Proceed with crafting if there are enough resources
    setTools(prevTools => {
        const tool = prevTools[toolName];
        if (!tool || tool.durability <= 0) {
            onAlert(`Your ${toolName} is broken. You cannot craft ${ingredientName}.`);
            return prevTools;
        }

        const updatedDurability = tool.durability - tool.corrodeRate;

        // Update the tool's durability
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

    // Increment the crafted ingredient count
    updatedIngredients[ingredientName].count += 1;

    // Increment the idleCount if the ingredient is a machine
    if (ingredient.isMachine) {
      updatedIngredients[ingredientName].idleCount += 1;
    }

    setOres(updatedOres);
    setIngredients(updatedIngredients);
  };

  // Tools function
  const useTool = (toolName) => {
    setTools(prevTools => {
        const tool = prevTools[toolName];
        if (!tool || tool.durability <= 0) {
            onAlert(`You need to repair your ${toolName}.`);
            return prevTools;
        }

        const updatedDurability = tool.durability - tool.corrodeRate;

        return {
            ...prevTools,
            [toolName]: {
                ...tool,
                durability: Math.max(0, updatedDurability)
            }
        };
    });
  };

  const onRepair = (toolName) => {
    const tool = tools[toolName]
    const requiredResources = tool.cost;

    // Check if enough resources are available
    const hasEnoughResources = Object.entries(requiredResources).every(([resourceName, amountRequired]) => {
      return (ores[resourceName]?.count || 0) >= amountRequired;
    });

    if (!hasEnoughResources) {
      onAlert(`Not enough resources to repair ${toolName}`);
      return;
    }

    // Deduct the resources from the ores state
    const updatedOres = { ...ores };
    Object.entries(requiredResources).forEach(([resourceName, amountRequired]) => {
      if (updatedOres[resourceName]) {
        updatedOres[resourceName].count -= amountRequired;
      }
    });

    // Restore the tool's durability to 100%
    const updatedTools = {
      ...tools,
      [toolName]: {
        ...tools[toolName],
        durability: 100,
      },
    };

    // Update the state
    setOres(updatedOres);
    setTools(updatedTools);
    }


  return (
    <>
      <div className="App" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Alert Section */}
            <div className='alerts'>
              <Messages messages={messages} />
              <AudioPlayer play={playAudio} />
            </div>

            {/* Status Section */}
            <div className='section'>
              <StatusSection tools={tools} />
            </div>

            {/* Ore Patch Section */}
            <div className='section'>
              <OreSection ores={ores} onIncrement={onIncrement} useTool={useTool} />
            </div>

            {/* Furnaces Section
            <div className='section'>
              <Furnaces />
            </div> */}

            {/* Inventory Section */}
            <div className='section'>
              <Inventory ores={ores} ingredients={ingredients} onCraft={onCraft} useTool={useTool} />
            </div>

            <div className='section'>
              {testMode ? (
                < TestMode ores={ores} ingredients={ingredients} onCheat={onCheat} />
              ) : (
                <Research ores={ores} ingredients={ingredients} onUnlock={onUnlock} researchItems={researchItems} />
              )}
              <RepairTools tools={tools} onRepair={onRepair} />
            </div>
          </div>
      </div>
    </>
  );
}

export default App;
