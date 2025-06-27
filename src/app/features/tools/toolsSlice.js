import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Axe: {
    durability: 100,
    corrodeRate: 0.5,
    cost: { Stone: 2 },
    unlocked: true,
  },
  Pickaxe: {
    durability: 100,
    corrodeRate: 1,
    cost: { Wood: 5 },
    unlocked: true,
  },
  Hammer: {
    durability: 100,
    corrodeRate: 1.5,
    cost: { Wood: 5, Stone: 5 },
    unlocked: false, // Set this dynamically later if needed
  },
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    decrementDurability: (state, action) => {
      const { toolName, amount } = action.payload;
      if (state[toolName]) {
        state[toolName].durability = Math.max(
          0,
          state[toolName].durability - amount * state[toolName].corrodeRate
        );
      }
    },
    resetDurability: (state, action) => {
      const { toolName, value = 100 } = action.payload;
      if (state[toolName]) {
        state[toolName].durability = value;
      }
    },
    unlockTool: (state, action) => {
      const { toolName } = action.payload;
      if (state[toolName]) {
        state[toolName].unlocked = true;
      }
    },
  },
});

export const {
  decrementDurability,
  resetDurability,
  unlockTool,
} = toolsSlice.actions;

export default toolsSlice.reducer;
