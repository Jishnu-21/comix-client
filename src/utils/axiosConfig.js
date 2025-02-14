import axios from 'axios';
import { API_URL } from '../config/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Try to refresh the token
      const response = await api.post('/auth/refresh-token');
      const { accessToken } = response.data;
      
      // Save new token
      localStorage.setItem('accessToken', accessToken);
      
      // Update the original request with new token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default api;
