import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [],
  activeRide: null,
  driverLocation: null,
  myRidesHistory: [],
  loading: false
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setActiveRide: (state, action) => {
      state.activeRide = action.payload;
    },
    updateDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
    setMyRidesHistory: (state, action) => {
      state.myRidesHistory = action.payload;
    }
  }
});

export const { setSearchResults, setActiveRide, updateDriverLocation, setMyRidesHistory } = rideSlice.actions;
export default rideSlice.reducer;
