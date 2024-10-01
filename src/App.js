import React, { useState, useEffect } from 'react';
import './App.css';
import ResourceSection from './Components/ResourceSection';
import Inventory from './Components/Inventory';
import Research from './Components/Research';
import TestMode from './Components/TestMode';
import Messages from './Components/Messages';
import AudioPlayer from './Components/AudioPlayer';
import FactorySection from './Components/FactorySection';
import RepairTools from './Components/RepairTools';
import CompletedResearch from './Components/CompletedResearch';
import Debug from './Components/Debug';

function App() {

  const testMode = true;
  const speedMode = false;
  const [debug, setDebug] = useState(false)

  let cheat = 0;
  // if(testMode){
  //   cheat = 1000
  // }

   // Initial state for ores with unlocked and canHandMine properties
  const [ores, setOres] = useState({
    Wood: { count: 0, tempCount: 0, clicked: 0, harvested: 0, canHandMine: true, unlocked: true, fuelValue: 2, craftTime: 0.5 },
    Stone: { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: true, patch: { number: 1, size: 120000}, canFurnace: true, canDrill: true, canBus: true, craftTime: 1 },
    "Iron Ore": { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: true, patch: { number: 1, size: 350000}, canFurnace: true, canDrill: true, canBus: true, craftTime: 1 },
    Coal: { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: testMode, patch: { number: 1, size: 345000}, canDrill: true, fuelValue: 4, canBus: true, craftTime: 1 },
    "Copper Ore": { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: testMode, patch: { number: 1, size: 340000}, canFurnace: true, canDrill: true, canBus: true, craftTime: 1 },
    "Crude Oil": { count: 0, tempCount: 0, canHandMine: false, unlocked: testMode, craftTime: 1 },
    "Uranium Ore": { count: 0, tempCount: 0, canHandMine: false, unlocked: testMode, canDrill: true, canBus: true, needsAcid: true, craftTime: 2 }
  });

  const [ingredients, setIngredients] = useState({
    "Transport Belt": { group: 'l2', count: 0, tempCount: 0, unlocked: testMode, cost: {"Gear": 1, "Iron Plate": 1}, multiplier: 2, isCraftable: true, craftTime: 0.5, beltSpeed: 1.875},
    "Fast Transport Belt": { group: 'l2', count: 0, tempCount: 0, unlocked: testMode, cost: {"Gear": 5, "Transport Belt": 1}, isCraftable: true, craftTime: 0.5, beltSpeed: 3.75},
    "Express Transport Belt": { group: 'l2', count: 0, tempCount: 0, unlocked: testMode, cost: {"Advanced Transport Belt": 1, "Gear": 10, "Lubricant": 20 }, isCraftable: false, craftTime: 0.5, beltSpeed: 5.625},
    "Burner Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Gear": 1, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, isBurner: true, maxCarry: 1, machineSpeed: 0.6, idleCount: 0},
    "Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Electronic Circuit": 1, "Gear": 1, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 1, machineSpeed: 0.83, idleCount: 0, energy: {"idle": 0.4, "active": 13}},
    "Long Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Inserter": 1, "Gear": 1, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 1, machineSpeed: 1.2, idleCount: 0, energy: {"idle": 0.4, "active": 18}},
    "Fast Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Electronic Circuit": 2,"Inserter": 1, "Iron Plate": 2}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 1, machineSpeed: 2.31, idleCount: 0, energy: {"idle": 0.5, "active": 46}},
    "Stack Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Advanced Circuit": 1, "Electronic Circuit": 15,"Fast Inserter": 1, "Gear": 15}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 2, machineSpeed: 2.31, idleCount: 0, energy: {"idle": 1, "active": 132}},
    "Burner Drill" : { group: 'p3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 3, "Gear": 3, "Stone Furnace": 1}, isCraftable: true, craftTime: 2, isMachine: true, isDrill: true, isBurner: true, machineSpeed: 0.25, idleCount: 0},
    "Electric Drill" : {group: 'p3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Electronic Circuit": 3, "Gear": 5, "Iron Plate": 10}, isCraftable: true, craftTime: 2, isMachine: true, isDrill: true, machineSpeed: 0.5, idleCount: 0, energy: {"idle": 0, "active": 90}},
    "Stone Furnace": { group: 'p4', count: 0, tempCount: 0, unlocked: testMode, cost: {"Stone": 5}, isCraftable: true, craftTime: 0.5, isFuel: false, isMachine: true, isFurnace: true, isBurner: true, machineSpeed: 1, idleCount: 0},
    "Steel Furnace": { group: 'p4', count: 0, tempCount: 0, unlocked: testMode, cost: {"Steel": 6, "Brick": 10}, isCraftable: true, craftTime: 3, isFuel: false, isMachine: true, isFurnace: true, isBurner: true, machineSpeed: 2, idleCount: 0},
    "Electric Furnace": {group: 'p4', count: 0, tempCount: 0, unlocked: testMode, cost: {"Advanced Circuit": 5, "Steel": 10, "Brick": 10}, isCraftable: true, craftTime: 5, isFuel: false, isMachine: true, isFurnace: true, isBurner: false, machineSpeed: 2, idleCount: 0, energy: {"idle": 6, "active": 180}},
    "Brick": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Stone": 2}, isCraftable: false, craftTime: 3.2, canBus: true, isRaw: true},
    "Iron Plate" : { group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Ore": 1}, isCraftable: false, craftTime: 3.2, canFurnace: true, canBus: true, isRaw: true},
    "Copper Plate": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Copper Ore": 1}, isCraftable: false, craftTime: 3.2, canBus: true, isRaw: true},
    "Steel": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 5}, isCraftable: false, craftTime: 16, canBus: true },
    "Plastic": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Coal": 1, "Petroleum": 20}, multiplier: 2, isCraftable: false, craftTime: 1 },
    "Wire": {group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Copper Plate": 1}, multiplier: 2, isCraftable: true, craftTime: 0.5 }, // CHANGE BACK TO 0.5 craftTime
    "Gear" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 2}, isCraftable: true, craftTime: 6.5 }, // CHANGE BACK TO 0.5 craftTime
    "Electronic Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Wire": 3, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5 },
    "Advanced Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Wire": 4, "Electronic Circuit": 2, "Plastic": 2}, isCraftable: true, craftTime: 6 },
    "Elite Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Advanced Circuit": 2}, isCraftable: true, craftTime: 6 },
    "Professional Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Elite Circuit": 2}, isCraftable: true, craftTime: 6 },
    "God Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Professional Circuit": 2, "Gear": 5}, isCraftable: true, craftTime: 6 }
  })

  const [networks, setNetworks] = useState({
    "Belt Lane": { count: 0, tempCount: 0, max: 4, unlocked: testMode, cost: {"Transport Belt": 50}, craftTime: 10, isNetwork: true, isBelt: true, idleCount: 0},
    "Fast Belt Lane": { count: 0, tempCount: 0, max: 4, unlocked: testMode, cost: {"Fast Transport Belt": 50}, craftTime: 20, isNetwork: true, isBelt: true, idleCount: 0},
    "Express Belt Lane": { count: 0, tempCount: 0, max: 4, unlocked: testMode, cost: {"Express Transport Belt": 50}, craftTime: 30, isNetwork: true, isBelt: true, idleCount: 0},
  })

  const basicBus = {
    lane1: { no: 1, isRunning: false, active: false, clear: testMode, unlocked: true, cost: {"Stone": 20}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
    lane2: { no: 2, isRunning: false, active: false, clear: testMode, unlocked: true, cost: {"Stone": 25}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
    lane3: { no: 3, isRunning: false, active: false, clear: testMode, unlocked: testMode, cost: {"Stone": 30}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
    lane4: { no: 4, isRunning: false, active: false, clear: testMode, unlocked: testMode, cost: {"Stone": 35}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
    lane5: { no: 5, isRunning: false, active: false, clear: testMode, unlocked: testMode, cost: {"Brick": 20}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
    lane6: { no: 6, isRunning: false, active: false, clear: testMode, unlocked: testMode, cost: {"Brick": 25}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
    lane7: { no: 7, isRunning: false, active: false, clear: testMode, unlocked: testMode, cost: {"Brick": 30}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
    lane8: { no: 8, isRunning: false, active: false, clear: testMode, unlocked: testMode, cost: {"Brick": 35}, gain: {"Wood": 30}, speed: 0, sushiCount:0, priority: 0 },
  }

  const [lanes, setLanes] = useState({})

  const createLanes = () => {
    const itemsWithProperties = {};

    // Checking ores for canBus properties
    for (const [key, value] of Object.entries(ores)) {
      if (value.canBus) {
        itemsWithProperties[key] = { ...basicBus };
      }
    }

    // Checking ingredients for canBus properties properties
    for (const [key, value] of Object.entries(ingredients)) {
      if (value.canBus) {
        itemsWithProperties[key] = { ...basicBus };
      }
    }

    setLanes(itemsWithProperties);
  };

  React.useEffect(() => {
    createLanes();
  }, []);

  const [storage, setStorage] = useState({
    Ores: 30 + cheat,
    Ingredients: 50 + cheat,
    Machines: 20 + cheat,
    Error: 69
  })

  const getStorage = (oreName) => {
    if(ores[oreName]){
        return storage["Ores"]
    }
    else if(ingredients[oreName]?.isMachine && !ingredients[oreName]?.isInserter){
        return storage["Machines"]
    }
    else if(networks[oreName]){
        return networks[oreName].max;
    }
    else if (ingredients[oreName]){
        return storage["Ingredients"]
    }
    else{
      return storage["Error"]
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
      desc: 'The \'tutorial\' is ending. Make couple of iron plates and you\'ll see things starting to open up. Remember, you can remove furnaces from one output and redeploy them onto others.'
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
      title: 'Better Pickaxe', 
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
      desc: 'This resource will open a lot of (electronic) doors...' // unlocks copper ore, plate and wire
    },
    inserters1: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Copper Ore": 30 }, 
      title: 'Burner Inserters', 
      desc: 'Our most basic inserter - add resources to your drills and furnaces automatically.'
    },
    wire1: { 
      isVisible: false, // make visible after 5 clicks
      unlocked: testMode, 
      cost: { "Copper Plate": 5 }, 
      title: 'Copper Wire', 
      desc: 'We can pass electricity through this.'
    },
    chip1: { 
      isVisible: false, // make visible after 25 clicks
      unlocked: testMode, 
      cost: { "Wire": 20 }, 
      title: 'Green Chips', 
      desc: 'Unlock the power of the computer chip!'
    },
    // the above have all unlock results set
    boiler: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Iron Plate": 30 }, 
      title: 'Boilers, Pipes and Steam Engines', 
      desc: 'Big machines are coming - are you ready?'
    },
    drill2: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Electronic Circuit": 5 }, 
      title: 'Electric Drills', 
      desc: 'Faster than burner drills and don\'t require fuel.'
    },
    // the above all have isVisible conditions set
    water: { 
      isVisible: false, // make visible when boiler is unlocked
      unlocked: testMode, 
      cost: { "Stone": 40 }, 
      title: 'Pump water', 
      desc: 'We need water for our boilers...'
    },
    inserters2: { 
      isVisible: false, 
      unlocked: testMode, 
      cost: { "Copper Ore": 30 }, 
      title: 'Electric Inserters', 
      desc: 'The standard inserter. You will grow to love them.'
    },
    redPack: { 
      isVisible: true, 
      unlocked: testMode, 
      cost: { "Red Science": 1 }, 
      title: 'Advanced Research', 
      desc: 'End of Stage 1. Opens the door to ALL automation.'
    },
  });

  // Base expansion
  const [expandables, setExpandables] = useState({
    beltLanes1: { 
      isVisible: true,
      unlocked: false, 
      cost: { "Splitter": 30 },
      title: 'Larger Bus', 
      desc: 'Increase the belt lane limit for your factory.'
    }
  })

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
    Axe: { durability: 100, corrodeRate: 0.5, cost: {"Stone": 2}, unlocked: true},
    Pickaxe: { durability: 100, corrodeRate: 1, cost: {"Wood": 5}, unlocked: true},
    Hammer: { durability: 100, corrodeRate: 1.5, cost: {"Wood": 5, "Stone": 5}, unlocked: testMode}
  })

  // Messages, sound & VFX
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
    const requiredItems = unlockables[itemName] ? unlockables[itemName].cost : expandables[itemName]?.cost
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
        if(unlockables[itemName]){
          setUnlockables(prevUnlockables => ({
              ...prevUnlockables,
              [itemName]: { ...prevUnlockables[itemName], unlocked: true }
          }));
        }
        else{
          setExpandables(prevUnlockables => ({
            ...prevUnlockables,
            [itemName]: { ...prevUnlockables[itemName], unlocked: true }
          }));
        }

        // events following unlock
        if(unlockables[itemName]){
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
              break;
            case 'pick2':
              setOres(prevOres => ({
                ...prevOres,
                Stone: { ...prevOres.Stone, craftTime: 0.5 },
                "Iron Ore": { ...prevOres["Iron Ore"], craftTime: 0.5 },
                Coal: { ...prevOres.Coal, craftTime: 0.5 },
                "Copper Ore": { ...prevOres["Copper Ore"], craftTime: 0.5 }
              }));
              break;
            case 'axe2':
              setOres(prevOres => ({
                ...prevOres,
                Wood: { ...prevOres.Wood, craftTime: 0.25 }
              }));
              break;
            case 'coal1':
              setOres(prevIngredients => ({
                ...prevIngredients,
                "Coal": {
                  ...prevIngredients["Coal"],
                  unlocked: true 
                }
              }));
                break
            case 'belts1':
              setIngredients(prevIngredients => ({
                ...prevIngredients,
                "Transport Belt": {
                  ...prevIngredients["Transport Belt"],
                  unlocked: true 
                }
              }));
              setNetworks(prevNetworks => ({
                ...prevNetworks,
                "Belt Lane": {
                  ...prevNetworks["Belt Lane"],
                  unlocked: true
                }
              }));
                break
            case 'copper1':
              setOres(prevIngredients => ({
                ...prevIngredients,
                "Copper Ore": {
                  ...prevIngredients["Copper Ore"],
                  unlocked: true 
                }
              }));
              setIngredients(prevIngredients => ({
                ...prevIngredients,
                "Copper Plate": {
                  ...prevIngredients["Copper Plate"],
                  unlocked: true 
                }
              }));
                break;
            case 'inserters1':
              setIngredients(prevIngredients => ({
                ...prevIngredients,
                "Burner Inserter": {
                  ...prevIngredients["Burner Inserter"],
                  unlocked: true 
                }
              }));
                break;
            case 'wire1':
              setIngredients(prevIngredients => ({
                ...prevIngredients,
                "Wire": {
                  ...prevIngredients["Wire"],
                  unlocked: true 
                }
              }));
                break;
            case 'chip1':
              setIngredients(prevIngredients => ({
                ...prevIngredients,
                "Electronic Circuit": {
                  ...prevIngredients["Electronic Circuit"],
                  unlocked: true 
                }
              }));
                break;
            default:
                break;
            }
        } else{
            switch (itemName) {
              case 'beltLanes1':
                setNetworks(prevNetworks => {
                  const updatedNetworks = {};
              
                  // Iterate through each network item
                  Object.keys(prevNetworks).forEach(networkName => {
                    const networkItem = prevNetworks[networkName];
              
                    // Update the 'max' value by adding 4
                    updatedNetworks[networkName] = {
                      ...networkItem,
                      max: networkItem.max + 4,
                    };
                  });
              
                  return updatedNetworks;
                });
                break;
                default:
                  break;
          }
      }
    } else {
        onAlert("Not enough resources to unlock this item.");
    }
  };

  // Function to expand belt lanes
  const handleBeltUnlock = (busName, laneNumber) =>{

    let canUnlock = true;
    let newOres = JSON.parse(JSON.stringify(ores));
    let newIngredients = JSON.parse(JSON.stringify(ingredients));
    let newLanes = JSON.parse(JSON.stringify(lanes));
    
        // first we check the cost and gains
    const lane = newLanes[busName][laneNumber];
    const cost = lane.cost;
    const gain = lane.gain;

    for (const [item, quantity] of Object.entries(cost)) {
        // Check if the item exists in ores or ingredients and if the user has enough resources
        if ((newOres[item]?.count || 0) < quantity && (newIngredients[item]?.count || 0) < quantity) {
            canUnlock = false;
            break;
        }
    }

    if (canUnlock) {
        // Deduct the required resources from ores or ingredients
        for (const [item, quantity] of Object.entries(cost)) {
            if (newOres[item]?.count >= quantity) {
                newOres[item].count -= quantity;
            } else if (newIngredients[item]?.count >= quantity) {
                newIngredients[item].count -= quantity;
            }
        }
        // Add the gains
        for (const [item, quantity] of Object.entries(gain)) {
          if (newOres[item]) {
              newOres[item].count += quantity;
              if(item === "Wood"){
                newOres[item].harvested += quantity
              }
          } else if (newIngredients[item]) {
              newIngredients[item].count += quantity;
          }
      }      
      
        // we update this lane to be 'clear'
        newLanes[busName][laneNumber].clear = true;

        // Update the states with the new values
        setOres(newOres);
        setIngredients(newIngredients);
        setLanes(newLanes);

    }else {
      onAlert("Not enough resources to unlock this item.");
    }
    
  }

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

  // Function for crafting
  const checkCraft = (ingredientName, bulkCheck) => {
    const toolName = ingredients[ingredientName] ? 'Hammer' : null;
    const items = ingredients[ingredientName] ? ingredients : networks;
    const item = items[ingredientName]
    const totalCount = item.count + item.tempCount

    if (!item || !item.cost) return;

    if(totalCount >= getStorage(ingredientName)){
      if(toolName){
        onAlert(`Storage is full. You cannot craft ${ingredientName}.`);
      }
      else{
        onAlert(`You've reached the max number of lanes for ${ingredientName}.`);
      }
      return; // Exit the function if storage is full
    }

    // Check if the hammer has durability
    if(toolName){
      const tool = tools[toolName];
      if (!tool || tool.durability <= 0) {
          onAlert(`Your ${toolName} is broken. You cannot craft ${ingredientName}.`);
          return; // Exit the function if the tool is broken
      }
    }

    const smartBuild = (ingredientName, outstandingItems, buildList = '', overBuild = {}, costList = {}, undoCheck = {}) => {
      console.log(`checking: ${JSON.stringify(ingredientName)}, which has a cost of ${JSON.stringify(outstandingItems)}`)
      let reduceItems = JSON.parse(JSON.stringify(outstandingItems)); // Make a deep copy of outstandingItems // {"Wire":3,"Iron Plate":1}
      
      // here we build a list of all the things we need. We loop continuously until we get to raw ingredients (or get a 'no'), and builds this list along the way
      for (const [resourceName, amountRequired] of Object.entries(reduceItems)) {
        const resource = ores[resourceName] || ingredients[resourceName];
        const setTempVal = ores[resourceName] ? setOres : setIngredients;
        const multiplier = resource.multiplier || 1;
        let reduceCount = amountRequired;
        let availableCount = resource.isMachine ?  resource.idleCount : resource.count;
        let floatingCount = resource.tempCount < 0 ? resource.tempCount : 0;
        let fullCount = availableCount + floatingCount;

        console.log(`
          availableCount is: ${availableCount}
          floatingCount is: ${floatingCount}
          fullCount is: ${fullCount}
          reduceCount: ${reduceCount}
          amountRequired: ${amountRequired}
          `)

        while(reduceCount > 0){
          // Check if we have this ingredient directly, in full
          if (fullCount >= amountRequired) {
            // Reduce the reduceCount
            reduceCount = 0;
            // Remove the item from reduceItems
            reduceItems[resourceName] -= amountRequired;
            if (costList[resourceName]) {
              // If the resource already exists, increment the amount
              costList[resourceName] += amountRequired;
            } else {
              // Otherwise, add the new resource with its amount
              costList[resourceName] = amountRequired ;
            }
            console.log(`We have ${resourceName} in full, so we can reduce the reduceCount of ${resourceName} to ${reduceCount}. ReduceItems is now: ${JSON.stringify(reduceItems)}`);
            setTempVal(prevIngredients => ({
              ...prevIngredients,
              [resourceName]: {
                ...prevIngredients[resourceName],
                tempCount: prevIngredients[resourceName].tempCount - amountRequired
              }
            }));
            // Update undoCheck
            undoCheck[resourceName] = (undoCheck[resourceName] || 0) + amountRequired;
        
            // Decrease fullCount accordingly
            fullCount -= amountRequired;

            console.log(`undoCheck is now: ${JSON.stringify(undoCheck)}`);
          }
          // Check if we have this ingredient directly, in part
          else if (fullCount >= 1) {
            // Reduce the reduceCount
            reduceCount -= fullCount;
            reduceItems[resourceName] -= fullCount;
            costList[resourceName] = (costList[resourceName] || 0) + fullCount;
            undoCheck[resourceName] = (undoCheck[resourceName] || 0) + fullCount;

            console.log(`We have ${fullCount} ${resourceName}(s), so we can reduce the reduceCount of ${resourceName} to ${reduceCount}. ReduceItems is now: ${JSON.stringify(reduceItems)}`);
            
            setTempVal(prevIngredients => ({
              ...prevIngredients,
              [resourceName]: {
                ...prevIngredients[resourceName],
                tempCount: prevIngredients[resourceName].tempCount--
              }
            }));

            console.log(`undoCheck is now: ${JSON.stringify(undoCheck)}`);
            // update fullCount
            fullCount = 0;
          } 
          // if we don't have (any more of) the resource directly, check if we can craft it instead         
          else if(!resource.isCraftable || ores[resourceName]){
            console.log(`We can't craft ${resourceName}, which we need, so we must stop`);
            return [false, false, false, undoCheck]; // Return an array indicating failure
          }
          // now check if we can do a smart craft of this item
          else{
            buildList = `${resourceName}-`+buildList
            console.log(`We don't have ${resourceName}, so buildList is now: ${JSON.stringify(buildList)}`);

            // Make a deep copy of resource.cost to avoid mutation
            const newCost = JSON.parse(JSON.stringify(resource.cost));
            console.log(`Cost for ${resourceName} is: ${JSON.stringify(newCost)}`);

            // Recursive call to smartBuild for the current resource
            const [newBuildList, newOverBuild, newCostList, newUndoCheck] = smartBuild(resourceName, newCost, buildList, overBuild, costList, undoCheck)
            
            // If we failed to craft, return false
            if (!newBuildList) return [false, false, false, undoCheck];

            // Otherwise, update the lists
            buildList = newBuildList;
            overBuild = newOverBuild;
            costList = newCostList;
            undoCheck = newUndoCheck;
        
            // otherwise, we've got enough for 1 of the item, so we reduce the reducer
            reduceCount -= multiplier;
            reduceItems[resourceName] -= multiplier;

            console.log(`We've wrangled ${multiplier} ${resourceName}, so we can reduce the reduceCount to ${reduceCount}. ReduceItems is now: ${JSON.stringify(reduceItems)}`);

            // Decrease fullCount accordingly for subsequent crafting
            fullCount--;

            // if we've wrangled more ingredients that we need, we can increase the tempCount
            if(reduceCount < 0){
              if (overBuild[resourceName]) {
                // If the resource already exists, increment the amount
                overBuild[resourceName] += -reduceCount;
              } else {
                // Otherwise, add the new resource with its amount
                overBuild[resourceName] = -reduceCount ;
              }
            }
          }
        }
      }
      // Return after all items are processed
      return [buildList, overBuild, costList, undoCheck];
    }

    const cleanBuild = (list, surplus, raw, undo) => {
      let initialList = list;
      let initialSurplus = surplus;
      let leftovers = {};
      let cleanRaw = raw;
      let cleanUndo = undo;

      // Split the initial list into an array for easier manipulation
      console.log(`initialList: ${JSON.stringify(initialList)}`)
      let initialArray = initialList.split('-');

      // console.log(`Our split list is: ${initialArray}
      //   & our surplus is: ${JSON.stringify(initialSurplus)}
      //   & cleanRaw starts as: ${JSON.stringify(cleanRaw)}`)

      // Function to remove items from the back
      const removeFromBack = (array, itemName, countToRemove) => {
        // Iterate from the back of the array
        for (let i = array.length - 1; i >= 0 && countToRemove > 0; i--) {
          if (array[i] === itemName) {
            array.splice(i, 1); // Remove the item
            countToRemove--; // Decrease the counter
          }
        }
        return array;
      }

      // Iterate over the items
      for (const [itemName, itemAmount] of Object.entries(initialSurplus)) {
        let multiplier = ingredients[itemName].multiplier || 1; // Default multiplier to 1 if not found
        let timesToRemove = Math.floor(itemAmount / multiplier); // Calculate how many to remove
        let remainder = itemAmount % multiplier; // Calculate leftover (lost) items
        let rawBase = ingredients[itemName].cost
        let setTempVal = ores[itemName] ? setOres : setIngredients;
        // console.log(`Removing ${timesToRemove} instances of ${itemName}`);
        // console.log(`This ${itemName} is equivalent to ${JSON.stringify(rawBase)}`)

        // Remove the item from the initial list starting from the back
        initialArray = removeFromBack(initialArray, itemName, timesToRemove);
        // Reduce the raw cost collection
        for (const [itemName, itemAmount] of Object.entries(rawBase)) {
          cleanRaw[itemName] -= timesToRemove;
          cleanUndo[itemName] -= timesToRemove;
          setTempVal(prevIngredients => ({
            ...prevIngredients,
            [itemName]: {
              ...prevIngredients[itemName],
              tempCount: prevIngredients[itemName].tempCount + timesToRemove
            }
          }));
        }
        // console.log(`cleanRaw is now: ${JSON.stringify(cleanRaw)}`)

        // If there is any remainder, add it to leftovers
        if (remainder > 0) {
          // Add to leftovers, incrementing if the item already exists in leftovers
          if (leftovers[itemName]) {
            leftovers[itemName] += remainder;
          } else {
            leftovers[itemName] = remainder;
          }
        }
      }

      // Join the array back into a string
      let cleanList = initialArray.join('-');

      // console.log(`cleanRaw ends as: ${JSON.stringify(cleanRaw)}`)
      // console.log(`cleanUndo ends as: ${JSON.stringify(cleanUndo)}`)

      return [cleanList, leftovers, cleanRaw, cleanUndo]
    }

    const smartCost = (cleanRawCost) => {
      for (const [itemName, itemAmount] of Object.entries(cleanRawCost)){
        const item = ores[itemName] ? ores[itemName] : ingredients[itemName];
        if(item.count < itemAmount){
          return false
        }
      }
      return true;
    }

    const checkHammer = (cleanList, toolName) => {
      // Count the number of hyphens in the string
      let hyphenCount = (cleanList.match(/-/g) || []).length;

      // Add 1 to the hyphen count (as specified)
      let totalOperations = hyphenCount + 1;

      // Retrieve the tool's corrodeRate and durability
      let corrodeRate = tools[toolName]?.corrodeRate || 0;
      let durability = tools[toolName]?.durability || 0;

      // Calculate how much durability is required for the operation
      let durabilityRequired = corrodeRate * totalOperations;
      let finalCondition = durability - durabilityRequired

      // Check if the tool has enough durability
      if (finalCondition > 0) {
        return finalCondition;  // Return true if the tool has enough durability
      } else {
        return false; // Return false if the tool doesn't have enough durability
      }
    }

    const clearTempCounts = (craftObj) => {
      // e.g. {"Wire":3,"Iron Plate":1}
      Object.entries(craftObj).forEach(([resourceName, resourceAmount]) => {
        const setTempVal = ores[resourceName] ? setOres : setIngredients;
      
        setTempVal(prevState => ({
          ...prevState,
          [resourceName]: {
            ...prevState[resourceName],
            tempCount: prevState[resourceName].tempCount + resourceAmount
          }
        }));
      });
    }

    // now we build our craft list - what we need
    const [craftList, surplusList, rawCost, undoCraft] = smartBuild(ingredientName, item.cost)

    console.log(`craftList: ${JSON.stringify(craftList)}
    surplusList: ${JSON.stringify(surplusList)}
    rawCost: ${JSON.stringify(rawCost)}
    undoCraft: ${JSON.stringify(undoCraft)}`)

    // this should only catch missing RAW items (like plastic). Potential issue with this is that we might be 1 wire short but we have over-crafted 2 wire before cleanBuild kicks in
    if(craftList === false){
      onAlert(`Not enough resources to craft ${ingredientName}.`)
      clearTempCounts(undoCraft)
      return
    }

    // where we may have built multiples, see if we have enough to reduce the craftList
    const [cleanList, leftover, cleanRawCost, cleanUndo] = cleanBuild(craftList, surplusList, rawCost, undoCraft)

    console.log(`cleanList: ${JSON.stringify(cleanList)}
    leftover: ${JSON.stringify(leftover)}
    cleanRawCost: ${JSON.stringify(cleanRawCost)}
    cleanUndo: ${JSON.stringify(cleanUndo)}`)

    // check we have enough raw ingredients
    const canAfford = smartCost(cleanRawCost)
    if(!canAfford){
      onAlert(`Not enough resources to craft ${ingredientName}.`)
      clearTempCounts(cleanUndo)
      return
    }

    // check our hammer can craft all these items without breaking
    const hammerDeteriation = checkHammer(cleanList, toolName)

    if(!hammerDeteriation){
      onAlert(`Your hammer will break before crafting ${ingredientName}. Either repair it or craft more intermediary ingredients.`)
      clearTempCounts(cleanUndo)
      return
    }

    // we setup a group ID for this craft. Items that require specific children will get a specific ID
    const groupId = `${cleanList}${ingredientName}--${Date.now() + Math.random()}`;

    console.log(`groupId is: ${JSON.stringify(groupId)}
                leftover: ${JSON.stringify(leftover)}
                cleanRawCost: ${JSON.stringify(cleanRawCost)}`)

    // almost there, we now clear the tempCounts for all the ingredients we reserved for this:
    clearTempCounts(cleanRawCost)

    // we've built up a groupId and array for our craft execution order
    // if this was a 5x craft, we feed this info here:
    if(bulkCheck){
      return [true, groupId]
    }
    else{
      onCraft(ingredientName, groupId, cleanRawCost, leftover, hammerDeteriation, false);  // Pass groupId to ensure grouping
    }
  };

  const onCraft = (itemName, groupId, totalCost, leftover, hammerCost, bulk) => {

    console.log(`onCraft
    itemName is: ${JSON.stringify(itemName)}
    groupId is: ${JSON.stringify(groupId)}
    totalCost is: ${JSON.stringify(totalCost)}
    leftover is: ${JSON.stringify(leftover)}
    hammer goes down to: ${JSON.stringify(hammerCost)}
    bulk: ${JSON.stringify(bulk)}`)

    // Update the hammer's durability, if applicable
    if(ingredients[itemName]){
      setTools(prevTools => {
          const toolName = "Hammer"
          const tool = prevTools[toolName];
          const updatedDurability = hammerCost;
          return {
              ...prevTools,
              [toolName]: {
                  ...tool,
                  durability: Math.max(0, updatedDurability)
              }
          };
      });
    }

    // Deduct all the raw items
    setOres(prevOres => {
      const updatedOres = { ...prevOres };
      Object.entries(totalCost).forEach(([resourceName, amountRequired]) => {
        if (updatedOres[resourceName]) {
          updatedOres[resourceName].count -= amountRequired;
        }
      });
      return updatedOres;
    });

    setIngredients(prevIngredients => {
      const updatedIngredients = { ...prevIngredients };
      Object.entries(totalCost).forEach(([resourceName, amountRequired]) => {
        if (updatedIngredients[resourceName]) {
          updatedIngredients[resourceName].count -= amountRequired;
          if (updatedIngredients[resourceName].idleCount) {
            updatedIngredients[resourceName].idleCount -= amountRequired;
          }
        }
      });
      return updatedIngredients;
    });

    const multiplier = ingredients[itemName].multiplier || 1;

    // Reserve storage space for the item we're crafting, as well as any leftovers
    setIngredients(prevIngredients => {
      const updatedIngredients = { ...prevIngredients };
    
      // Increment the tempCount for itemName
      updatedIngredients[itemName] = {
        ...updatedIngredients[itemName],
        tempCount: updatedIngredients[itemName].tempCount + multiplier
      };
    
      // Iterate through the leftover object and increment the tempCount for each resource
      Object.entries(leftover).forEach(([resourceName, amount]) => {
        if (updatedIngredients[resourceName]) {
          updatedIngredients[resourceName] = {
            ...updatedIngredients[resourceName],
            tempCount: updatedIngredients[resourceName].tempCount + amount
          };
        }
      });
    
      return updatedIngredients;
    });

    setNetworks(prevNetworks => {
      const updatedNetworks = { ...prevNetworks };
      if (updatedNetworks[itemName]) {
        updatedNetworks[itemName].tempCount += 1;
      }
      return updatedNetworks;
    });

    // now we've done the deductions, we setup the items for queuing, including adding 'child' labels
    const item = ingredients[itemName] || networks[itemName];

    // we now send the instructions to onCraft
    const buildCraftArray = (groupId) => {
      // Split by '--' to remove the timestamp part
      const splitParts = groupId.split('--');
      
      // The first part before '--' is the list of resources
      const resourceString = splitParts[0];
      
      // Split the resource string by '-' to get individual items
      const splitGroup = resourceString.split('-').filter(Boolean); // Filter to remove empty items if any

      const craftArray = [];

      // Iterate through the split array
      for (let i = 0; i < splitGroup.length; i++) {
        const resourceName = splitGroup[i];

        // Check if resourceName exists in ingredients
        if (ingredients[resourceName]) {
          const multiplier = ingredients[resourceName].multiplier || 1;

          if (i === splitGroup.length - 1) {
            // For the last item, don't add 'child'
            craftArray.push([resourceName, ingredients[resourceName], multiplier, null, groupId, leftover, totalCost, hammerCost]);
          } else {
            // For all other items, add 'child'
            craftArray.push([resourceName, ingredients[resourceName], multiplier, 'child', groupId, leftover, totalCost, hammerCost]);
          }
        }
      }

      return craftArray;
    };

    const craftArray = buildCraftArray(groupId, leftover, totalCost, hammerCost);


    // if this is a single craft, we can just add straight to queue, otherwise we need to process the craft order
    if(bulk){
      return {craftArray}
    }
    // note: child items dont get crafted, but are passed to addToCraftQueue to denote which items are being crafted as intermediaries
    craftArray.forEach(craftItem => {
      const [itemName, item, multiplier, child, groupId, leftover, totalCost, hammerCost] = craftItem
      addToCraftQueue(itemName, item, multiplier, child, groupId, leftover, totalCost, hammerCost)
    })
    
  };

  // ###### QUEUE LOGIC
  // ###### QUEUE LOGIC
  // ###### QUEUE LOGIC

  const [craftQueue, setCraftQueue] = useState([]); // for delays and queueing
  const [currentCrafting, setCurrentCrafting] = useState(null); // To manage the current crafting item
  const [isAnimating, setIsAnimating] = useState(false); // To manage animation state
  
  const addToCraftQueue = (ingredientName, ingredient, multiplier, parentIngredientName = null, groupId, leftover, totalCost, hammerCost) => {
    setCraftQueue(prevQueue => {
      // Get the last item in the queue
      const lastItem = prevQueue[prevQueue.length - 1];
  
      // Check if the last item matches the new one (both ingredient and parent must match)
      if (
        lastItem &&
        lastItem.ingredientName === ingredientName &&
        lastItem.parentIngredientName === parentIngredientName
      ) {
        // If the last item matches, stack it by increasing the queue count
        return prevQueue.map((item, index) => {
          if (index === prevQueue.length - 1) {
            return { ...item, queue: item.queue + 1 };
          }
          return item;
        });
      } else {
        // Otherwise, add the new item as a separate entry
        const newItem = {
          ingredientName,
          ingredient,
          multiplier,
          parentIngredientName, // Track the parent ingredient
          groupId,
          leftover,
          id: Date.now() + Math.random(), // Generate a unique ID for each craft item
          queue: 1 // Start with the specified multiplier
        };
        return [...prevQueue, newItem];
      }
    });
  };

  useEffect(() => {
    // this catches the event when a queue is manually cancelled by the user, so we need to reinitialise
    if(!craftQueue){
      setCraftQueue([])
    }
    // If there's something in the queue and nothing is currently crafting
    else if (craftQueue.length > 0 && !currentCrafting) {
      const [nextItem] = craftQueue; // Get the first item in the queue
      setCurrentCrafting(nextItem); // Set the current item as crafting
      setIsAnimating(true); // Start the animation

      const { ingredientName, ingredient } = nextItem;

      setTimeout(() => {
        // Decrease the count of the first item or remove it if count becomes 1
        setCraftQueue(prevQueue => {
          if(!prevQueue){
            setCraftQueue([])
          }
          else if(!prevQueue[0]){
            // the only available item in the queue was cancelled - setCurrentlyCrafting to null and remove the animation
            setIsAnimating(false);
            setCurrentCrafting(null);
          }
          else if (prevQueue[0].queue > 1) {
            if(prevQueue[0].parentIngredientName !== 'child'){
              craftPayout(ingredientName, prevQueue[0].leftover); // Process crafting
            }
            // If there are more than 1 in the queue, reduce the count
            setIsAnimating(false); // End the animation
            setCurrentCrafting(null); // Reset current crafting item
            return prevQueue.map((item, index) => {
              if (index === 0) {
                return { ...item, queue: item.queue - 1 };
              }
              return item;
            });
          } else {
            if(prevQueue[0].parentIngredientName !== 'child'){
              craftPayout(ingredientName, prevQueue[0].leftover); // Process crafting
            }
            // If there's only 1 left, remove the item after crafting completes
            setIsAnimating(false); // End the animation
            setCurrentCrafting(null); // Reset current crafting item
            return prevQueue.slice(1);
          }
        });
      }, ingredient.craftTime * 1000);
    }
  }, [craftQueue, currentCrafting]);

  const craftPayout = (ingredientName, leftover) => {
    // check if ingredient -- if not, it's a network item
    if (ingredients[ingredientName]) {
  
      setIngredients(prevIngredients => {
        const updatedIngredients = { ...prevIngredients };
      
        // Handle the main ingredient's update
        const currentIngredient = updatedIngredients[ingredientName];
        let updatedIngredient = { ...currentIngredient };
      
        // Update count and tempCount
        updatedIngredient.count += (updatedIngredient.multiplier || 1);
        updatedIngredient.tempCount -= (updatedIngredient.multiplier || 1);
      
        // Handle machines
        if (currentIngredient.isMachine) {
          updatedIngredient.idleCount = Math.min(
            currentIngredient.idleCount + (updatedIngredient.multiplier || 1),
            updatedIngredient.count
          );
        }
      
        // Update the ingredientName entry
        updatedIngredients[ingredientName] = updatedIngredient;
      
        return updatedIngredients;
      });

      if (leftover) {
        // Iterate through leftover object
        Object.keys(leftover).forEach((item) => {
          setIngredients((prevIngredients) => {
            // Check if the item exists in ingredients
            if (prevIngredients[item]) {
              return {
                ...prevIngredients,
                [item]: {
                  ...prevIngredients[item],
                  // Increase the count by leftover amount
                  count: prevIngredients[item].count + leftover[item],
                  // Decrease the tempCount by the leftover amount
                  tempCount: prevIngredients[item].tempCount - leftover[item],
                }
              };
            }
            return prevIngredients; // Return unchanged if the item doesn't exist
          });
        });
      }
  
      // Early-stage unlock check - #myFirstFurnace       
      if (ingredients["Stone Furnace"].count === 0 && !unlockables.smelt1.isVisible) {
        setUnlockables(prevUnlockables => ({
          ...prevUnlockables,
          smelt1: {
            ...prevUnlockables.smelt1,
            isVisible: true
          }
        }));
        
        setIngredients(prevIngredients => ({
          ...prevIngredients,
          Brick: {
            ...prevIngredients.Brick,
            unlocked: true
          }
        }));
      }
    } 
    // Handle network items
    else {
      setNetworks(prevNetworks => ({
        ...prevNetworks,
        [ingredientName]: {
          ...prevNetworks[ingredientName],
          count: prevNetworks[ingredientName].count + 1,
          idleCount: prevNetworks[ingredientName].idleCount + 1,
          tempCount: prevNetworks[ingredientName].tempCount - 1,
        }
      }));
    }
  };

  // ###### CANCEL LOGIC
  // ###### CANCEL LOGIC
  // ###### CANCEL LOGIC

  const cancelCraft = (groupId) => {

    // Initialize an empty cancelList
    let cancelList = [];

    // Filter the craftQueue to find all items that belong to the same groupId
    const groupItems = craftQueue.filter(item => item.groupId === groupId);

    // Find the parent item (where parentIngredientName is null)
    const parentItem = groupItems.find(item => !item.parentIngredientName);

    // Collect the ingredient names and queue numbers of all items in the same group
    cancelList = groupItems.map(item => {
      return {
        ingredientName: item.ingredientName,
        queue: item.queue,
        isChild: item.parentIngredientName ? true : false // Check if it's a child or not
      };
    });

    if (!parentItem) {
      console.error('No parent ingredient found.');
    }

    // Cancel logic -- unlike factorio, if intermediary items have already been crafted, they still get canelled and refunded.
    // This is because crafting intermdiary items creates negative counts and positive tempCounts, which out. To convert cancelled-yet-crafted items to keep
    // would require re-programming the storage limit and craft behaviours which present work.
    const cancelledParent = ingredients[parentItem.ingredientName]
    let cancelArray = []
    Object.entries(cancelledParent.cost).forEach(([itemName, amount]) => { 
      cancelArray.push({itemName: itemName, amount: amount})
    })

    // refund the costs
    refundGroup(parentItem.ingredientName, cancelArray, groupId.split('--')[0])

    // remove the parent item (and any child items) from the queue
    deleteQueue(groupId.split('--')[0], groupId)
  }

  const refundGroup = (parentName, itemsArray, groupName) => {
    // this function takes the parent item that's being cancelled, alongside the array of items that are being crafted to make the parent item and the group name
    // console.log(`
    //   parentItem = ${JSON.stringify(parentName)} //  parentItem = "Burner Drill"
    //   itemsArray = ${JSON.stringify(itemsArray)} // itemsArray = [{"itemName":"Iron Plate","amount":3},{"itemName":"Gear","amount":3},{"itemName":"Stone Furnace","amount":1}]
    //   groupName = ${JSON.stringify(groupName)} // groupName = "Gear-Gear-Gear-Stone Furnace-Burner Drill"
    //   `)

    // we have a group, e.g. Gear-Gear-Gear-Stone Furnace-Burner Drill. We split the group by '-' and add it to a new array and reduce the array
    const toRefundList = groupName.split('-');

    // check with this is a direct craft. If it is, we can do a straight refund
    if(toRefundList.length === 1){
      refundToRaw(toRefundList[0], true);
      itemsArray.splice(0, 1)
    }
    else{
      // Iterate through toRefundList and update itemsArray
      toRefundList.forEach(item => {
        // Call refundRaw function
        if(item !== parentName){
          refundToRaw(item);
        }

      // Find the item in itemsArray
      const itemIndex = itemsArray.findIndex(i => i.itemName === item);
        const multiplier = ores[item] ? ores[item].multiplier || 1 : ingredients[item].multiplier || 1
        // If item exists, decrement its amount
        if (itemIndex !== -1) {
          itemsArray[itemIndex].amount -= multiplier;

          // If amount reaches 0, remove the item from itemsArray
          if (itemsArray[itemIndex].amount === 0) {
            itemsArray.splice(itemIndex, 1);
          }
        }
      });
    }
    
    // we may now have a remainder of items that where used to craft the item that we used directly, these are what remain in itemArray
    itemsArray.forEach(item => {
      reverseRawCost(item.itemName, item.amount);
    });

    // now we reverse the parent (remove the tempCount)
    reverseParent(parentName)
  }

  // fully refunds an ingredient
  const refundToRaw = (itemName, direct) => {
    const cancelledItem = ingredients[itemName] ? ingredients[itemName] : ores[itemName];
    const multiplier = cancelledItem.multiplier || 1;
    if (!cancelledItem) return; // If the item is not found, return early

    // Create copies of ores and ingredients to modify them
    const updatedOres = { ...ores };
    const updatedIngredients = { ...ingredients };

    // Refund the cost of the cancelled item
    Object.entries(cancelledItem.cost).forEach(([resourceName, amountRequired]) => {
      // If it's an ore, refund the ore count
      if (updatedOres[resourceName]) {
        updatedOres[resourceName].count += amountRequired;
      }
      // If it's an ingredient, refund the ingredient count
      else if (updatedIngredients[resourceName]) {
        updatedIngredients[resourceName].count += amountRequired;
      }
    });

    // Reduce the tempCount of the cancelled item
    if (updatedIngredients[itemName]) {
      if(!direct){
        updatedIngredients[itemName].count = updatedIngredients[itemName].count + multiplier;
      }
      updatedIngredients[itemName].tempCount = updatedIngredients[itemName].tempCount - multiplier;
    }

    // Update the state with the refunded resources and reduced tempCount
    setOres(updatedOres);
    setIngredients(updatedIngredients);
  };

  const reverseRawCost = (itemName, amount) => {
    const allItems = ores[itemName] ? ores : ingredients
    const setItems = allItems === ores ? setOres : setIngredients
    const cancelledItem = allItems[itemName]
    const multiplier = cancelledItem.multiplier || 1;
    if (!cancelledItem) return; // If the item is not found, return early

    // Create copies of ores and ingredients to modify them
    const updatedItems = { ...allItems };

    // Reduce the tempCount of the cancelled item
    if(amount < 0){
      updatedItems[itemName].count = updatedItems[itemName].count + amount;
    }
    else{
      updatedItems[itemName].count = updatedItems[itemName].count + amount * multiplier;
    }

    // Update the state with the refunded resources and reduced count
    setItems(updatedItems);
  }

  // refunds the parent item only -- adjusts the count/tempCount
  const reverseParent = (itemName) => {
    const ingredient = ingredients[itemName]
    const multiplier = ingredient.multiplier || 1;
    if (!ingredient) return; // If the item is not found, return early

    // Create copy of ingredients to modify it
    const updatedIngredients = { ...ingredients };

    // Reduce the tempCount of the cancelled item
    updatedIngredients[itemName].tempCount = Math.max(0, updatedIngredients[itemName].tempCount - multiplier);

    // Update the state with the refunded resources and reduced tempCount
    setIngredients(updatedIngredients);
  };

  const deleteQueue = (groupName, groupId) => {
    // remove the clicked item from the queue by id
    setCraftQueue((prevQueue) => {
      // console.log(`
      //   prevQueue: ${JSON.stringify(prevQueue)}
      //   groupName: ${groupName}
      //   groupId: ${groupId}
      //   `)

      // Split the groupName by '-' to get the list of ingredients to remove
      const toRemoveList = groupName.split('-');

      // Count the occurrences of each item in the groupName
    const removeCounts = toRemoveList.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    // Iterate through the queue and update the items
    return prevQueue.map((item) => {
      // Check if the item is part of the group and matches the groupId
      if (item.groupId === groupId && removeCounts[item.ingredientName]) {
        // Determine how many to remove based on the count in groupName
        const removeCount = removeCounts[item.ingredientName];
        const updatedQueue = item.queue - removeCount;

        // If the updated queue count is greater than 0, update the item
        if (updatedQueue > 0) {
          return { ...item, queue: updatedQueue };
        }
        // If the queue reaches 0 or less, remove the item by returning null
        else {
          return null;
        }
      }

      // Return all other items as they are
      return item;
    })
    .filter(Boolean); // Remove null entries (items that were removed)
  });
};

  // ###### BULK CRAFT LOGIC
  // ###### BULK CRAFT LOGIC  
  // ###### BULK CRAFT LOGIC

  const bulkCheck = (ingredientName) => {

    let totalCrafts = 5; // Attempt to craft 5x
    let allCrafts = {};  // Collect all craft groups by groupId
  
    for (let i = 0; i < totalCrafts; i++) {
      // Call checkCraft to trigger crafting logic and deductions
      const result = checkCraft(ingredientName, true); // This triggers onCraft
  
      if (!result) {
        // Exit if onCraft returned no result (e.g., tool broke or resources ran out)
        break;
      }

      // Extract the craftArray from the result
      const groupId = result[1]
      const craftArray = result[2];

      // Initialize the groupId in allCrafts if not already present
      if (!allCrafts[groupId]) {
        allCrafts[groupId] = []; // Create an empty array to store all crafts for this groupId
      }

      // Iterate through the craftArray and call onCraft for each resource
      craftArray.forEach(([resourceName, ingredient, child], index) => {
        const isParent = (index === craftArray.length - 1); // Last item is the parent

        // Call onCraft with child as undefined for the parent (final item)
        const craftResult = onCraft(resourceName, ingredient, groupId, isParent ? undefined : "child", true);
        
        // Append the craft result to the respective group in allCrafts
        allCrafts[groupId].push(craftResult);
      });
    }

    // console.log(`allCrafts: ${JSON.stringify(allCrafts)}`)

    const stackedCrafts = reorderBulk(allCrafts)

    // console.log(`stackedCrafts: ${JSON.stringify(stackedCrafts)}`)

    for (const groupId in stackedCrafts) { // Loop through each groupId in allCrafts
      const resources = stackedCrafts[groupId]; // Get the array of resources under this groupId
      
      // Loop through each resource in the group
      for (const resource of resources) {
        const resourceName = resource.itemName; // Get the item name
        const item = resource.item; // Get the entire resource object as the ingredient
        const child = resource.child ? "child" : false; // Check if the resource is marked as a child
        const multiplier = item.multiplier || 1;
  
        // Add these items to the queue now they've been reordered
        addToCraftQueue(resourceName, item, multiplier, child, groupId)
      }
    }

  };

  const reorderBulk = (allCrafts) => {
    const newAllCrafts = {}; // Object to store the reorganized groups
  
    // Step 1: Extract the order from the first `groupId`
    let firstGroupId = Object.keys(allCrafts)[0] ? Object.keys(allCrafts)[0] : false;
    if(!firstGroupId){
      return;
    }
    let prefixOrder = firstGroupId.split('--')[0].split('-');
  
    // Step 2: Collect and group all items by their prefix
    const groupedItems = {};
    for (const groupId in allCrafts) {
      const prefix = groupId.split('--')[0]; // Extract the prefix
      if (!groupedItems[prefix]) {
        groupedItems[prefix] = [];
      }
      groupedItems[prefix].push(...allCrafts[groupId]);
    }
  
    // Step 3: Iterate through each prefix and re-order based on the first group prefixOrder
    for (const prefix in groupedItems) {
      // Sort items based on the prefixOrder (i.e., Gear -> Stone Furnace -> Burner Drill)
      const sortedItems = groupedItems[prefix].sort((a, b) => {
        const itemAIndex = prefixOrder.indexOf(a.itemName);
        const itemBIndex = prefixOrder.indexOf(b.itemName);
        return itemAIndex - itemBIndex;
      });
  
      // Step 4: Assign a new groupId with the prefix and random number
      const newGroupId = `${prefix}--${Date.now() + Math.random()}`;
      newAllCrafts[newGroupId] = sortedItems;
  
      // Replace the groupId for each item in the sorted list
      sortedItems.forEach((item) => {
        item.groupId = newGroupId;
      });
    }
  
    return newAllCrafts;
  };

  return (
    <>
      <div className="App" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Alert Section */}
            <div className='alerts'>
              {messages.length > 0 && (
                <Messages messages={messages} />
              )}
              <AudioPlayer play={playAudio} />
            </div>

            {/* Debug buttons */}
            <div className='debug'>
              {testMode && (
                <Debug debug={debug} setDebug={setDebug} />
              )}
            </div>

            {/* Factory Section */}
            <div className='section'>
              <FactorySection 
              unlockables={unlockables} 
              expandables={expandables}
              ores={ores} 
              ingredients={ingredients} 
              tools={tools} 
              onUnlock={onUnlock}
              handleBeltUnlock={handleBeltUnlock}
              checkCraft={checkCraft}
              networks={networks} 
              setNetworks={setNetworks}
              lanes={lanes}
              setLanes={setLanes}
               />
            </div>

            < ResourceSection 
              unlockables={unlockables}
              setUnlockables={setUnlockables} 
              ores={ores} 
              ingredients={ingredients} 
              tools={tools} 
              setOres={setOres} 
              setIngredients={setIngredients} 
              storage={storage} 
              getStorage={getStorage} 
              setTools={setTools} 
              networks={networks}
              setNetworks={setNetworks}
              lanes={lanes}
              setLanes={setLanes}
              debug={debug} 
              onAlert={onAlert} />

            {/* Inventory Section */}
            <div className='section'>
              <Inventory 
                unlockables={unlockables} 
                ores={ores} 
                ingredients={ingredients} 
                getStorage={getStorage} 
                checkCraft={checkCraft}
                bulkCheck={bulkCheck}
                craftQueue={craftQueue}
                currentCrafting={currentCrafting}
                isAnimating={isAnimating}
                cancelCraft={cancelCraft}
                debug={debug}
              />
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

              {speedMode && (
              < TestMode ores={ores} ingredients={ingredients} onCheat={onCheat} />
              )}
            </div>
          </div>
      </div>
    </>
  );
}

export default App;
