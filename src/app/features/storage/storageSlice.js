import { createSlice } from '@reduxjs/toolkit';
import { cheat } from '../../../config';

const initialState = {
  Ores: 30 + cheat,
  Ingredients: 50 + cheat,
  Machines: 20 + cheat,
  Error: 69,
};

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    setStorageValue: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    bulkSetStorage: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setStorageValue, bulkSetStorage } = storageSlice.actions;
export default storageSlice.reducer;