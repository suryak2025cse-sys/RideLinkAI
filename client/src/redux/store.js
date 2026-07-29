import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import rideReducer from './rideSlice';
import safetyReducer from './safetySlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideReducer,
    safety: safetyReducer,
    chat: chatReducer
  }
});
