import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      try {
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));
        sessionStorage.setItem('token', action.payload.token);
      } catch (e) {}
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        sessionStorage.setItem('user', JSON.stringify(state.user));
      } catch (e) {}
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } catch (e) {}
    }
  }
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
