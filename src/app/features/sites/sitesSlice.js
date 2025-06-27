import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    siteCounts: {},              // Tracks items banked from mining
    pendingMachineOutput: {}     // Tracks what machines are outputting before it's added to storage
};
  
const siteSlice = createSlice({
name: 'sites',
initialState,
reducers: {
    setSiteCount: (state, action) => {
    const { itemName, value } = action.payload;
    state.siteCounts[itemName] = value;
    },
    incrementSiteCount: (state, action) => {
    const { itemName, amount } = action.payload;
    if (!state.siteCounts[itemName]) {
        state.siteCounts[itemName] = 0;
    }
    state.siteCounts[itemName] += amount;
    },
    setPendingOutput: (state, action) => {
    const { itemName, value } = action.payload;
    state.pendingMachineOutput[itemName] = value;
    },
    incrementPendingOutput: (state, action) => {
    const { itemName, amount } = action.payload;
    if (!state.pendingMachineOutput[itemName]) {
        state.pendingMachineOutput[itemName] = 0;
    }
    state.pendingMachineOutput[itemName] += amount;
    },
    clearSiteData: (state) => {
    state.siteCounts = {};
    state.pendingMachineOutput = {};
    }
}
});

export const {
setSiteCount,
incrementSiteCount,
setPendingOutput,
incrementPendingOutput,
clearSiteData
} = siteSlice.actions;

export default siteSlice.reducer;