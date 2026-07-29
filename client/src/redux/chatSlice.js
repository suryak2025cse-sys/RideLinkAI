import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isChatDrawerOpen: false,
  activeRecipient: {
    name: 'Surya K (Driver)',
    phone: '+91 9025953166',
    rideId: null
  },
  messages: [
    { id: '1', sender: 'driver', text: 'Hello! I will arrive at the pickup spot at 09:30 AM.', time: '09:20 AM' }
  ],
  isOtherTyping: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChatDrawer: (state, action) => {
      state.isChatDrawerOpen = action.payload !== undefined ? action.payload : !state.isChatDrawerOpen;
    },
    setActiveRecipient: (state, action) => {
      state.activeRecipient = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setOtherTyping: (state, action) => {
      state.isOtherTyping = action.payload;
    }
  }
});

export const { toggleChatDrawer, setActiveRecipient, addMessage, setMessages, setOtherTyping } = chatSlice.actions;
export default chatSlice.reducer;
