import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  playAudio: false
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      const id = Date.now();
      state.messages.push({ id, text: action.payload });
      state.playAudio = true;
    },
    removeAlert: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.messages = [];
    },
    stopAudio: (state) => {
      state.playAudio = false;
    }
  }
});

export const { addAlert, removeAlert, clearAlerts, stopAudio } = notificationsSlice.actions;
export default notificationsSlice.reducer;