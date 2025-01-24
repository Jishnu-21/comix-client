import axios from 'axios';
import { API_URL } from '../config/api';

// Track pending refresh token requests
let refreshTokenRequest = null;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('accessToken');
    
    // Log request details
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      isAdmin: config.url?.includes('/admin'),
      hasAdminToken: !!adminToken,
      hasUserToken: !!userToken
    });

    if (config.url?.includes('/admin') && adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers['Authorization'] = `Bearer ${userToken}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      success: response.data?.success
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('API Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      isRetry: !!originalRequest?._retry
    });

    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
      console.log(`Rate limited. Retrying after ${retryAfter} seconds`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return api(originalRequest);
    }

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear existing tokens if refresh token is missing
        if (!document.cookie.includes('refreshToken')) {
          console.log('No refresh token found, clearing auth state');
          if (originalRequest.url?.includes('/admin')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            window.location.href = '/admin/login';
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        // Reuse existing refresh token request if one is in progress
        if (!refreshTokenRequest) {
          console.log('Initiating token refresh');
          refreshTokenRequest = api.post('/auth/refresh-token').finally(() => {
            refreshTokenRequest = null;
          });
        }

        const response = await refreshTokenRequest;
        console.log('Token refresh successful');

        const { accessToken } = response.data;

        // Update tokens based on the route type
        if (originalRequest.url?.includes('/admin')) {
          localStorage.setItem('adminToken', accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        } else {
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Handle refresh token failure
        if (originalRequest.url?.includes('/admin')) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          window.location.href = '/admin/login';
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;