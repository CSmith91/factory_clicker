import React, { useState } from 'react';
import './App.css';
import ResourceSection from './Components/ResourceSection';
import Inventory from './Components/Inventory';
import Research from './Components/Research';
import TestMode from './Components/TestMode';
import Messages from './Components/Messages';
import AudioPlayer from './Components/AudioPlayer';
import StatusSection from './Components/StatusSection';
import RepairTools from './Components/RepairTools';
import CompletedResearch from './Components/CompletedResearch';
import Craft from './Components/Craft';

function App() {

  const testMode = true

  let cheat = 0;
  if(testMode){
    cheat = 1000
  }

   // Initial state for ores with unlocked and canHandMine properties
  const [ores, setOres] = useState({
    Wood: { count: 0, clicked: 0, harvested: 0, canHandMine: true, unlocked: true, fuelValue: 2, craftTime: 0.5 },
    Stone: { count: 0, clicked: 0, canHandMine: true, unlocked: true, patch: { number: 1, size: 120000}, canFurnace: true, canDrill: true, craftTime: 1 },
    "Iron Ore": { count: 0, clicked: 0, canHandMine: true, unlocked: true, patch: { number: 1, size: 350000}, canFurnace: true, canDrill: true, craftTime: 1 },
    Coal: { count: 0, clicked: 0, canHandMine: true, unlocked: testMode, patch: { number: 1, size: 345000}, canDrill: true, fuelValue: 4, craftTime: 1 },
    "Copper Ore": { count: 0, clicked: 0, canHandMine: true, unlocked: testMode, patch: { number: 1, size: 340000}, canFurnace: true, canDrill: true, craftTime: 1 },
    "Crude Oil": { count: 0, canHandMine: false, unlocked: testMode, craftTime: 1 },
    "Uranium Ore": { count: 0, canHandMine: false, unlocked: testMode, canDrill: true, needsAcid: true, craftTime: 2 }
  });

  const [ingredients, setIngredients] = useState({
    "Burner Drill" : { group: 'p3', count: 0, unlocked: testMode, cost: {"Iron Plate": 3, "Gear": 3, "Stone Furnace": 1}, isCraftable: true, craftTime: 2, isMachine: true, isDrill: true, isBurner: true, machineSpeed: 0.25, idleCount: 0},
    "Electric Drill" : {group: 'p3', count: 0, unlocked: testMode, cost: {"Electronic Circuit": 3, "Gear": 5, "Iron Plate": 10}, isCraftable: true, craftTime: 2, isMachine: true, isDrill: true, machineSpeed: 0.5, idleCount: 0, energy: {"idle": 0, "active": 90}},
    "Stone Furnace": { group: 'p4', count: 0, unlocked: testMode, cost: {"Stone": 5}, isCraftable: true, craftTime: 0.5, isFuel: false, isMachine: true, isFurnace: true, isBurner: true, machineSpeed: 1, idleCount: 0},
    "Steel Furnace": { group: 'p4', count: 0, unlocked: testMode, cost: {"Steel": 6, "Brick": 10}, isCraftable: true, craftTime: 3, isFuel: false, isMachine: true, isFurnace: true, isBurner: true, machineSpeed: 2, idleCount: 0},
    "Electric Furnace": {group: 'p4', count: 0, unlocked: testMode, cost: {"Advanced Circuit": 5, "Steel": 10, "Brick": 10}, isCraftable: true, craftTime: 5, isFuel: false, isMachine: true, isFurnace: true, isBurner: false, machineSpeed: 2, idleCount: 0, energy: {"idle": 6, "active": 180}},
    "Brick": {group: 'i3', count: 0, unlocked: testMode, cost: {"Stone": 2}, craftTime: 3.2},
    "Iron Plate" : { group: 'i3', count: 0, unlocked: testMode, cost: {"Iron Ore": 1}, craftTime: 3.2, canFurnace: true},
    "Copper Plate": {group: 'i3', count: 0, unlocked: testMode, cost: {"Copper Ore": 1}, craftTime: 3.2},
    "Steel": {group: 'i3', count: 0, unlocked: testMode, cost: {"Iron Plate": 5}, craftTime: 16},
    "Gear" : { group: 'i5', count: 0, unlocked: testMode, cost: {"Iron Plate": 2}, isCraftable: true, craftTime: 0.5 }
  })

  const [storage, setStorage] = useState({
    Ores: 30 + cheat,
    Ingredients: 50 + cheat,
    Machines: 20 + cheat
  })

  const getStorage = (oreName) => {
    if(ores[oreName]){
        return storage["Ores"]
    }
    else if(ingredients[oreName]?.isMachine){
        return storage["Machines"]
    }
    else{
        return storage["Ingredients"]
    }
}

  // Research items with their costs
  const [unlockables, setUnlockables] = useState({
    furnace1: { 
      isVisible: true, // Set to true if it should be visible by default
      unlocked: testMode, 
      cost: { "Wood": 5 }, 
      title: 'Stone Furnace', 
      desc: 'You can do something with all that stone and iron, you just need the space...'
    },
    hammer1: { 
      isVisible: false, // Change based on when you want it to appear
      unlocked: testMode, 
      cost: { "Stone": 3 }, 
      title: 'Hammer', 
      desc: 'If we have a hammer, we can craft a stone furnace!'
    },
    smelt1: {
      isVisible: false,
      unlocked: testMode, 
      cost: { "Brick": 3 }, 
      title: 'Furnace Stack', 
      desc: 'We can add our furnace to the brick stack. Adding enough stone (TWO per brick) and fuel, we can make brick.'
    },
    craft1: {
      isVisible: false,
      unlocked: testMode, 
      cost: { "Iron Plate": 2 }, 
      title: 'Gears', 
      desc: 'The tutorial ending. Make couple of iron plates and you\'ll see things starting to open up. Remember, you can remove furnaces from one output and redeploy them onto others.'
    },
    storage1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Wood": 16 }, 
      title: 'Wooden Crates', 
      desc: 'Store more ores and ingredients both at source and in your inventory.'
    },
    storage2: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Iron Plate": 64 }, 
      title: 'Iron Chests', 
      desc: 'Store much more ores and ingredients both at source and in your inventory.'
    },
    axe2: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Wood": 5, "Iron Plate": 4 }, 
      title: 'Long-Handled Axe', 
      desc: 'Chop wood faster with this bad boy.'
    },
    pick2: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Stone": 5, "Iron Plate": 2 }, 
      title: 'Actual Iron Pick', 
      desc: 'Surely there\'s some way to automate this...'
    },
    drill1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Gear": 10 }, 
      title: 'Drills!', 
      desc: 'Getting all that ore out the ground manually is tiresome. This is what we need.'
    },
    coal1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Stone": 50 }, 
      title: 'Black Rock', 
      desc: 'We\'ve cleared so many trees and dug up so much stone now. I wonder what that black colored rock is...'
    },
    belts1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Gear": 30 }, 
      title: 'Transport Belts', 
      desc: 'No more banking! Move goods from mining sites and machines to your inventory automatically.'
    },
    copper1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Stone": 35, "Brick": 15 }, 
      title: 'Copper', 
      desc: 'This resource will open a lot of (electronic) doors...'
    },
    inserters1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Copper Ore": 20 }, 
      title: 'Burner Inserters', 
      desc: 'Our most basic inserter - add resources to your drills and furnaces automatically.'
    },
    bulkPlace1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Iron Plate": 50 }, 
      title: 'Bulk Add', 
      desc: 'For all you arthritus haters! Add resources to machines in bulk.'
    },
    factory1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "redPack": 10 }, 
      title: 'Factories', 
      desc: 'Sounds cool, but how do we even make an automation pack? [You need to code labs & electric being unlocked before]'
    }
  });

  // Function to check if any research is available
  const shouldShowResearch = () => {
    return Object.values(unlockables).some(unlockable => unlockable.isVisible === true && unlockable.unlocked === false);
  };  
  
  // Function to check if any tool has durability less than 100
  const shouldShowRepairTools = () => {
    return Object.values(tools).some(tool => tool.durability < 100);
  };

  // Tools
  const [tools, setTools] = useState ({
    Axe: { durability: 100, corrodeRate: 0.25, cost: {"Stone": 2}, unlocked: true},
    Pickaxe: { durability: 100, corrodeRate: 0.5, cost: {"Wood": 5}, unlocked: true},
    Hammer: { durability: 100, corrodeRate: 1.5, cost: {"Wood": 5, "Stone": 5}, unlocked: testMode}
  })



  // Messages, sound & VFX
  const [messages, setMessages] = useState([])
  const [playAudio, setPlayAudio] = useState(false); // State to trigger audio playback
  //const [isAnimating, setIsAnimating] = useState(false);

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
  const onCheat = (itemName) => {
    if(ores[itemName]){
      setOres(prevOres => ({
        ...prevOres,
        [itemName]: {
          ...prevOres[itemName],
          count: prevOres[itemName].count + 50
        }
      }));
    }
    else{
      setIngredients(prevIngs => ({
        ...prevIngs,
        [itemName]: {
          ...prevIngs[itemName],
          count: prevIngs[itemName].count + 50,
          ...(prevIngs[itemName].idleCount !== undefined && {
            idleCount: prevIngs[itemName].idleCount + 50
          })
        }
      }));
    }
  }

  // Function to unlock research
  const onUnlock = (itemName) => {
    const requiredItems = unlockables[itemName]?.cost;
    if (!requiredItems) return;

    let canUnlock = true;
    let newOres = { ...ores };
    let newIngredients = { ...ingredients };

    for (const [item, quantity] of Object.entries(requiredItems)) {
        // Check if the item exists in ores or ingredients and if the user has enough resources
        if ((newOres[item]?.count || 0) < quantity && (newIngredients[item]?.count || 0) < quantity) {
            canUnlock = false;
            break;
        }
    }

    if (canUnlock) {
        // Deduct the required resources from ores or ingredients
        for (const [item, quantity] of Object.entries(requiredItems)) {
            if (newOres[item]?.count >= quantity) {
                newOres[item].count -= quantity;
            } else if (newIngredients[item]?.count >= quantity) {
                newIngredients[item].count -= quantity;
            }
        }

        // Update the state with the new values
        setOres(newOres);
        setIngredients(newIngredients);
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            [itemName]: { ...prevUnlockables[itemName], unlocked: true }
        }));

        // events following unlock
        switch (itemName) {
          case 'furnace1':
            setIngredients(prevIngredients => ({
              ...prevIngredients,
              "Stone Furnace": {
                ...prevIngredients["Stone Furnace"],
                unlocked: true 
              }
            }));
            setUnlockables(prevUnlockables => ({
              ...prevUnlockables,
              ["hammer1"]: { ...prevUnlockables["hammer1"], isVisible: true }
            }));
            break;
          case 'hammer1':
            setTools(prevTools => ({
              ...prevTools,
              "Hammer": {
                ...prevTools["Hammer"],
                unlocked: true  // Unlock the Hammer
              }
            }));
            break;
          case 'smelt1':
            setIngredients(prevIngredients => ({
              ...prevIngredients,
              "Iron Plate": {
                ...prevIngredients["Iron Plate"],
                unlocked: true 
              }
            }));
            setUnlockables(prevUnlockables => ({
              ...prevUnlockables,
              ["craft1"]: { ...prevUnlockables["craft1"], isVisible: true }
            }));
            break
          case 'craft1':
            setIngredients(prevIngredients => ({
              ...prevIngredients,
              "Gear": {
                ...prevIngredients["Gear"],
                unlocked: true 
              }
            }));
            setUnlockables(prevUnlockables => ({
              ...prevUnlockables,
              ["drill1"]: { ...prevUnlockables["drill1"], isVisible: true }
            }));
            break
          case 'storage1':
            setStorage(prevStorage => ({
              ...prevStorage,
              Ores: prevStorage.Ores + 20,
              Ingredients: prevStorage.Ingredients + 50
            }));
            break;
          case 'storage2':
            setStorage(prevStorage => ({
              ...prevStorage,
              Ores: prevStorage.Ores + 450,
              Ingredients: prevStorage.Ingredients + 900
            }));
            break;
          case 'drill1':
            setIngredients(prevIngredients => ({
              ...prevIngredients,
              "Burner Drill": {
                ...prevIngredients["Burner Drill"],
                unlocked: true 
              }
            }));
            break
          default:
              break;
      }
    } else {
        onAlert("Not enough resources to unlock this item.");
    }
  };

  // Track crafting stats
  const [craftCount, setCraftCount] = useState(0); // purely for unlocking a research item
  const [craftQueue, setCraftQueue] = useState([]); // for delays and queueing

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

  // repair tools
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

  // handle adding and removing machines on site
  const handleMachineChange = (action, machineName) => {
    let stateUpdated = false;

    setIngredients(prevIngredients => {
        const machine = prevIngredients[machineName];
        if (!machine || !machine.isMachine || !machine.unlocked) {
            return prevIngredients;
        }

        if (action === 'increment' && machine.idleCount > 0) {
            stateUpdated = true;
            return {
                ...prevIngredients,
                [machineName]: {
                    ...machine,
                    idleCount: machine.idleCount - 1
                }
            };
        } else if (action === 'decrement' && machine.idleCount !== machine.count) {
            stateUpdated = true;
            return {
                ...prevIngredients,
                [machineName]: {
                    ...machine,
                    idleCount: machine.idleCount + 1
                }
            };
        }
        return prevIngredients;
    });
    //return stateUpdated;

    // Instead of returning stateUpdated directly, use a callback
    // This ensures you are checking after the state update logic
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(stateUpdated);
      }, 0); // Use a timeout to delay resolution until after state update
  });
};

  return (
    <>
      <div className="App" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Alert Section */}
            <div className='alerts'>
              <Messages messages={messages} />
              <AudioPlayer play={playAudio} />
            </div>

            <div className='craftList'>
              <Craft craftQueue={craftQueue} />
            </div>

            {/* Status Section */}
            <div className='section'>
              <StatusSection tools={tools} />
            </div>

            < ResourceSection setUnlockables={setUnlockables} ores={ores} ingredients={ingredients} tools={tools} setOres={setOres} setIngredients={setIngredients} storage={storage} getStorage={getStorage} setTools={setTools} useTool={useTool} handleMachineChange={handleMachineChange} onAlert={onAlert} />

            {/* Inventory Section */}
            <div className='section'>
              <Inventory unlockables={unlockables} setUnlockables={setUnlockables} ores={ores} ingredients={ingredients} tools={tools} setOres={setOres} setIngredients={setIngredients} setTools={setTools} setCraftCount={setCraftCount} getStorage={getStorage} useTool={useTool} onAlert={onAlert}/>
            </div>

            <div className='section'>
              {testMode ? (
                < TestMode ores={ores} ingredients={ingredients} onCheat={onCheat} />
              ) : (
                <>
                {shouldShowResearch() && <Research ores={ores} ingredients={ingredients} onUnlock={onUnlock} unlockables={unlockables} />}
                </>
              )}
              {shouldShowRepairTools() && <RepairTools tools={tools} onRepair={onRepair} />}

              <CompletedResearch unlockables={unlockables}  />
            </div>
          </div>
      </div>
    </>
  );
}

export default App;
