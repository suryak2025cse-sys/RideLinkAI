import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isChatDrawerOpen: false,
  messages: [],
  isOtherTyping: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChatDrawer: (state, action) => {
      state.isChatDrawerOpen = action.payload !== undefined ? action.payload : !state.isChatDrawerOpen;
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

export const { toggleChatDrawer, addMessage, setMessages, setOtherTyping } = chatSlice.actions;
export default chatSlice.reducer;
