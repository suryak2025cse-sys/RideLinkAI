import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const cached = localStorage.getItem('user') || sessionStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
};

const getInitialToken = () => {
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  } catch (e) {
    return null;
  }
};

const initialUser = getInitialUser();
const initialToken = getInitialToken();

const initialState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!(initialUser || initialToken),
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));
        sessionStorage.setItem('token', action.payload.token);
      } catch (e) {}
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem('user', JSON.stringify(state.user));
        sessionStorage.setItem('user', JSON.stringify(state.user));
      } catch (e) {}
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      } catch (e) {}
    }
  }
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
