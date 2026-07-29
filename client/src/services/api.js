import axios from 'axios';

// Live production Render backend URL for RideLink AI
const LIVE_BACKEND_URL = 'https://ridelink-backend-u775.onrender.com/api';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return LIVE_BACKEND_URL;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 6000, // 6-second strict HTTP timeout to prevent stuck loading buttons
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined' && !token.startsWith('mock_')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default API;
