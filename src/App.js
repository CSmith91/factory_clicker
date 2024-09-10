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
    "Brick": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Stone": 2}, craftTime: 3.2, canBus: true},
    "Iron Plate" : { group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Ore": 1}, craftTime: 3.2, canFurnace: true, canBus: true},
    "Copper Plate": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Copper Ore": 1}, craftTime: 3.2, canBus: true},
    "Steel": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 5}, craftTime: 16, canBus: true},
    "Wire": {group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Copper Plate": 1}, multiplier: 2, isCraftable: true, craftTime: 0.5 },
    "Gear" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 2}, isCraftable: true, craftTime: 0.5 },
    "Electronic Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Wire": 3, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5 }
  })

  const [networks, setNetworks] = useState({
    "Belt Lane": { count: 0, tempCount: 0, max: 4, unlocked: testMode, cost: {"Transport Belt": 50}, craftTime: 1, isNetwork: true, isBelt: true, idleCount: 0},
    "Fast Belt Lane": { count: 0, tempCount: 0, max: 4, unlocked: testMode, cost: {"Fast Transport Belt": 50}, craftTime: 2, isNetwork: true, isBelt: true, idleCount: 0},
    "Express Belt Lane": { count: 0, tempCount: 0, max: 4, unlocked: testMode, cost: {"Express Transport Belt": 50}, craftTime: 3, isNetwork: true, isBelt: true, idleCount: 0},
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
  const checkCraft = (ingredientName) => {
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
        onAlert(`You've reach the max number of lanes for ${ingredientName}.`);
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

    // Check if there are enough resources to craft
    const hasEnoughResources = Object.entries(item.cost).every(
      ([resourceName, amountRequired]) => {
        const resource = ores[resourceName] || ingredients[resourceName];

        // If the resource has an idleCount, check that it's also sufficient
        if (resource?.idleCount !== undefined) {
          return resource.idleCount >= amountRequired;
        }

        // Otherwise, just check the regular count
        return resource?.count >= amountRequired;
      }
    );

    if (!hasEnoughResources) {
      onAlert(`Not enough resources to craft ${ingredientName}`);
    }
    else{
        onCraft(ingredientName, item)
    }
  }

  const onCraft = (itemName, item) => {
      // Update the hammer's durability, if applicable
      if(ingredients[itemName]){
        setTools(prevTools => {
            const toolName = "Hammer"
            const tool = prevTools[toolName];
            const updatedDurability = tool.durability - tool.corrodeRate;
            return {
                ...prevTools,
                [toolName]: {
                    ...tool,
                    durability: Math.max(0, updatedDurability)
                }
            };
        });
      }

      // Deduct the costs from the resources
      const updatedOres = { ...ores };
      const updatedIngredients = { ...ingredients };
      const updatedNetworks = { ...networks};

      Object.entries(item.cost).forEach(([resourceName, amountRequired]) => {
        if (updatedOres[resourceName]) {
            updatedOres[resourceName].count -= amountRequired;
        } else if (updatedIngredients[resourceName]) {
            updatedIngredients[resourceName].count -= amountRequired;
            if(updatedIngredients[resourceName].idleCount){
              updatedIngredients[resourceName].idleCount -= amountRequired
            }
        }
      });

      if(updatedIngredients[itemName]){
        updatedIngredients[itemName].tempCount += (updatedIngredients[itemName].multiplier || 1);
        //console.log(`${itemName}s tempCount is: ${updatedIngredients[itemName].tempCount}`)
      } else if(updatedNetworks[itemName]){
        updatedNetworks[itemName].tempCount += 1;
        //console.log(`${itemName}s tempCount is: ${updatedIngredients[itemName].tempCount}`)
      }
      else{
        console.log("Something went wrong onCraft!")
      }


      addToCraftQueue(itemName, item, updatedIngredients, updatedOres, updatedNetworks)
  };

  const craftPayout = (ingredientName, ingredient) => {
    // check if ingredient -- if not, it's a network item
    if (ingredients[ingredientName]) {
  
      setIngredients(prevIngredients => {
        const currentIngredient = prevIngredients[ingredientName];
        let updatedIngredient = { ...currentIngredient };
        
        // Update count and tempCount
        updatedIngredient.count += (updatedIngredient.multiplier || 1);
        updatedIngredient.tempCount -= (updatedIngredient.multiplier || 1);
    
        // Handle machines
        if (ingredient.isMachine) {
          updatedIngredient.idleCount = Math.min(
            currentIngredient.idleCount + (updatedIngredient.multiplier || 1),
            updatedIngredient.count
          );
        }
    
        // Update ores and ingredients together
        return {
          ...prevIngredients,
          [ingredientName]: updatedIngredient,
        };
      });
  
      // Early-stage unlock check - #myFirstFurnace       
      if (ingredients["Stone Furnace"].count > 0 && !unlockables.smelt1.isVisible) {
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
  


  // queue logic
  const [craftQueue, setCraftQueue] = useState([]); // for delays and queueing
  const [currentCrafting, setCurrentCrafting] = useState(null); // To manage the current crafting item
  const [isAnimating, setIsAnimating] = useState(false); // To manage animation state
  
  const addToCraftQueue = (ingredientName, ingredient, updatedIngredients, updatedOres, updatedNetworks) => {
      // Create a new item object with the parameters
      const newItem = {
      ingredientName,
      ingredient
      };

      // Update the craftQueue state with the new item
      setCraftQueue(prevQueue => [...prevQueue, newItem]);
  };

  useEffect(() => {
      // If there's something in the queue and nothing is currently crafting
      if (craftQueue.length > 0 && !currentCrafting) {
        const [nextItem] = craftQueue; // Get the first item in the queue
        setCurrentCrafting(nextItem); // Set the current item as crafting
        setIsAnimating(true); // Start the animation
  
        const { ingredientName, ingredient } = nextItem;
  
        setTimeout(() => {
          craftPayout(ingredientName, ingredient ); // Process crafting
          setIsAnimating(false); // End the animation
          setCurrentCrafting(null); // Reset current crafting item
  
          // Remove the first item from the queue
          setCraftQueue(prevQueue => prevQueue.slice(1));
        }, ingredient.craftTime * 1000);
      }
    }, [craftQueue, currentCrafting]);
    

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
                craftQueue={craftQueue}
                currentCrafting={currentCrafting}
                isAnimating={isAnimating}
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
