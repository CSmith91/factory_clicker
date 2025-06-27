import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  debug: false
};

const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    toggleDebug: (state) => {
      state.debug = !state.debug;
    },
    setDebug: (state, action) => {
      state.debug = action.payload;
    }
  }
});

export const { toggleDebug, setDebug } = debugSlice.actions;
export default debugSlice.reducer;