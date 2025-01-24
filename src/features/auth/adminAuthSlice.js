import { createSlice } from '@reduxjs/toolkit';
import { adminLogin, adminLogout } from './authActions';

// Try to get initial state from localStorage
const getInitialState = () => {
  try {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const accessToken = localStorage.getItem('adminToken');
    return {
      admin,
      accessToken,
      isLoading: false,
      isAuthenticated: !!(admin && accessToken),
      error: null
    };
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return {
      admin: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null
    };
  }
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload.admin;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        console.log('Admin login fulfilled:', action.payload);
        state.isLoading = false;
        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        console.error('Admin login rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
        state.admin = null;
        state.accessToken = null;
      })
      // Admin Logout
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.accessToken = null;
        state.error = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, setAdmin } = adminAuthSlice.actions;
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectAdminAuth = (state) => state.adminAuth;
export default adminAuthSlice.reducer;
