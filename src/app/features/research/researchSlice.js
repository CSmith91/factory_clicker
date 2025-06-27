import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  furnace1: { isVisible: true, unlocked: false, cost: { Wood: 5 }, title: 'Stone Furnace', desc: 'You can do something with all that stone and iron, you just need the space...' },
  hammer1: { isVisible: false, unlocked: false, cost: { Stone: 3 }, title: 'Hammer', desc: 'If we have a hammer, we can craft a stone furnace!' },
  smelt1: { isVisible: false, unlocked: false, cost: { Brick: 3 }, title: 'Furnace Stack', desc: 'We can add our furnace to the brick stack. Adding enough stone (TWO per brick) and fuel, we can make brick.' },
  craft1: { isVisible: false, unlocked: false, cost: { "Iron Plate": 2 }, title: 'Gears', desc: 'The "tutorial" is ending. Make a couple of iron plates and you\'ll see things starting to open up.' },
  storage1: { isVisible: false, unlocked: false, cost: { Wood: 16 }, title: 'Wooden Crates', desc: 'Store more ores and ingredients both at source and in your inventory.' },
  storage2: { isVisible: false, unlocked: false, cost: { "Iron Plate": 64 }, title: 'Iron Chests', desc: 'Store much more ores and ingredients both at source and in your inventory.' },
  axe2: { isVisible: false, unlocked: false, cost: { Wood: 5, "Iron Plate": 4 }, title: 'Long-Handled Axe', desc: 'Chop wood faster with this bad boy.' },
  pick2: { isVisible: false, unlocked: false, cost: { Stone: 5, "Iron Plate": 2 }, title: 'Better Pickaxe', desc: 'Surely there\'s some way to automate this...' },
  drill1: { isVisible: false, unlocked: false, cost: { Gear: 10 }, title: 'Drills!', desc: 'Getting all that ore out the ground manually is tiresome. This is what we need.' },
  coal1: { isVisible: false, unlocked: false, cost: { Stone: 50 }, title: 'Black Rock', desc: 'I wonder what that black colored rock is...' },
  belts1: { isVisible: false, unlocked: false, cost: { Gear: 30 }, title: 'Transport Belts', desc: 'Move goods automatically from mining sites.' },
  copper1: { isVisible: false, unlocked: false, cost: { Stone: 35, Brick: 15 }, title: 'Copper', desc: 'This resource will open a lot of (electronic) doors...' },
  inserters1: { isVisible: false, unlocked: false, cost: { "Copper Ore": 30 }, title: 'Burner Inserters', desc: 'Add resources automatically to drills and furnaces.' },
  wire1: { isVisible: false, unlocked: false, cost: { "Copper Plate": 5 }, title: 'Copper Wire', desc: 'We can pass electricity through this.' },
  chip1: { isVisible: false, unlocked: false, cost: { Wire: 20 }, title: 'Green Chips', desc: 'Unlock the power of the computer chip!' },
  boiler: { isVisible: false, unlocked: false, cost: { "Iron Plate": 30 }, title: 'Boilers, Pipes and Steam Engines', desc: 'Big machines are coming - are you ready?' },
  drill2: { isVisible: false, unlocked: false, cost: { "Electronic Circuit": 5 }, title: 'Electric Drills', desc: 'Faster than burner drills and don\'t require fuel.' },
  water: { isVisible: false, unlocked: false, cost: { Stone: 40 }, title: 'Pump water', desc: 'We need water for our boilers...' },
  inserters2: { isVisible: false, unlocked: false, cost: { "Copper Ore": 30 }, title: 'Electric Inserters', desc: 'The standard inserter. You will grow to love them.' },
  redPack: { isVisible: true, unlocked: false, cost: { "Red Science": 1 }, title: 'Advanced Research', desc: 'End of Stage 1. Opens the door to ALL automation.' }
};

const unlockablesSlice = createSlice({
  name: 'unlockables',
  initialState,
  reducers: {
    unlockItem: (state, action) => {
      const key = action.payload;
      if (state[key]) {
        state[key].unlocked = true;
      }
    },
    setVisibility: (state, action) => {
      const { key, isVisible } = action.payload;
      if (state[key]) {
        state[key].isVisible = isVisible;
      }
    },
  }
});

export const { unlockItem, setVisibility } = unlockablesSlice.actions;
export default unlockablesSlice.reducer;