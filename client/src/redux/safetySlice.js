import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSOSModalOpen: false,
  isSafetyCheckPopupOpen: false,
  activeSOSAlerts: [],
  safetyEventsLog: []
};

const safetySlice = createSlice({
  name: 'safety',
  initialState,
  reducers: {
    toggleSOSModal: (state, action) => {
      state.isSOSModalOpen = action.payload !== undefined ? action.payload : !state.isSOSModalOpen;
    },
    toggleSafetyCheckPopup: (state, action) => {
      state.isSafetyCheckPopupOpen = action.payload !== undefined ? action.payload : !state.isSafetyCheckPopupOpen;
    },
    setActiveSOSAlerts: (state, action) => {
      state.activeSOSAlerts = action.payload;
    },
    addSafetyLog: (state, action) => {
      state.safetyEventsLog.unshift(action.payload);
    }
  }
});

export const { toggleSOSModal, toggleSafetyCheckPopup, setActiveSOSAlerts, addSafetyLog } = safetySlice.actions;
export default safetySlice.reducer;
