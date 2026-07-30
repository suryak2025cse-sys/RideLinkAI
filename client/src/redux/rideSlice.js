import { createSlice } from '@reduxjs/toolkit';

const rideSlice = createSlice({
  name: 'ride',
  initialState: {
    availableRides: [],
    activeRide: null,
    myOfferedRides: [],
    myBookings: [],
    loading: false,
    error: null,
    searchParams: {
      pickupLocation: '',
      destination: '',
      departureTime: '',
      seats: 1,
      womenOnly: false,
      communityType: 'All'
    }
  },
  reducers: {
    setAvailableRides: (state, action) => {
      state.availableRides = action.payload;
    },
    addOfferedRide: (state, action) => {
      state.myOfferedRides.unshift(action.payload);
      state.availableRides.unshift(action.payload);
    },
    removeOfferedRide: (state, action) => {
      state.myOfferedRides = state.myOfferedRides.filter(r => r._id !== action.payload);
      state.availableRides = state.availableRides.filter(r => r._id !== action.payload);
    },
    setActiveRide: (state, action) => {
      state.activeRide = action.payload;
    },
    bookRideSuccess: (state, action) => {
      const { booking, rideId } = action.payload;
      state.myBookings.unshift(booking);
      const rideIndex = state.availableRides.findIndex(r => r._id === rideId);
      if (rideIndex !== -1) {
        state.availableRides[rideIndex].availableSeats = Math.max(
          0, 
          state.availableRides[rideIndex].availableSeats - (booking.seatsRequested || 1)
        );
        state.activeRide = state.availableRides[rideIndex];
      }
    },
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setAvailableRides,
  addOfferedRide,
  removeOfferedRide,
  setActiveRide,
  bookRideSuccess,
  setSearchParams,
  setLoading,
  setError
} = rideSlice.actions;

export default rideSlice.reducer;
