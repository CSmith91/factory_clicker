import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  craftQueue: [],
  currentCrafting: null,
  isAnimating: false
};

const craftQueueSlice = createSlice({
  name: "craftQueue",
  initialState,
  reducers: {
    addToQueue: (state, action) => {
      const newItem = action.payload;
      const lastItem = state.craftQueue[state.craftQueue.length - 1];
      if (
        lastItem &&
        lastItem.ingredientName === newItem.ingredientName &&
        lastItem.parentIngredientName === newItem.parentIngredientName
      ) {
        lastItem.queue += 1;
      } else {
        state.craftQueue.push(newItem);
      }
    },
    popFromQueue: (state) => {
      state.craftQueue.shift();
    },
    decrementQueue: (state) => {
      if (state.craftQueue.length > 0) {
        state.craftQueue[0].queue -= 1;
      }
    },
    setCurrentCrafting: (state, action) => {
      state.currentCrafting = action.payload;
    },
    setIsAnimating: (state, action) => {
      state.isAnimating = action.payload;
    },
    resetQueue: (state) => {
      state.craftQueue = [];
      state.currentCrafting = null;
      state.isAnimating = false;
    }
  }
});

export const {
  addToQueue,
  popFromQueue,
  decrementQueue,
  setCurrentCrafting,
  setIsAnimating,
  resetQueue
} = craftQueueSlice.actions;

export default craftQueueSlice.reducer;
