import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authServices';

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      // First try to get user from localStorage
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        return { isAuthenticated: false };
      }

      try {
        // Validate token with backend
        const validatedUser = await authService.validateToken(token);
        return { 
          isAuthenticated: true, 
          user: validatedUser,
          accessToken: token 
        };
      } catch (error) {
        // If token validation fails but we have stored user data
        if (storedUser) {
          const user = JSON.parse(storedUser);
          return { 
            isAuthenticated: true, 
            user,
            accessToken: token 
          };
        }
        throw error;
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return rejectWithValue({ isAuthenticated: false, error: error.message });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.adminLogin(credentials);
      // After successful login, redirect to admin dashboard
      window.location.href = '/admin/';
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const adminLogout = createAsyncThunk(
  'auth/adminLogout',
  async () => {
    await authService.adminLogout();
    window.location.href = '/admin/login';
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(otpData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      // Check for specific error conditions
      if (error.response && error.response.status === 403) {
        return rejectWithValue({ message: 'Invalid credentials. Please log in again.' });
      }
      return rejectWithValue({ message: 'Failed to refresh token. Please try again.' });
    }
  }
);