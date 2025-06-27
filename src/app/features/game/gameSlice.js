import { createSlice } from '@reduxjs/toolkit';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    tickCount: 0,
  },
  reducers: {
    gameTick: (state) => {
      state.tickCount += 1;
    }
  }
});

export const { gameTick } = gameSlice.actions;
export default gameSlice.reducer;