import { createSlice } from '@reduxjs/toolkit';
import { authService } from './authServices';
import { checkAuthStatus, login, logout, signup, googleLogin, verifyOtp, resendOtp, refreshToken, adminLogin } from './authActions'; // Import adminLogin

const getUserFromLocalStorage = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('accessToken') || null;
};

const initialState = {
  isAuthenticated: !!getUserFromLocalStorage(),
  accessToken: getAccessTokenFromLocalStorage(),
  user: getUserFromLocalStorage(),
  admin: JSON.parse(localStorage.getItem('admin')),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    setAdmin: (state, action) => { // Add setAdmin reducer
      state.admin = action.payload;
      if (action.payload) {
        localStorage.setItem('admin', JSON.stringify(action.payload)); // Store admin in local storage
      } else {
        localStorage.removeItem('admin');
      }
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
      state.admin = null; // Clear admin state
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('admin'); // Clear admin from local storage
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.admin = action.payload.admin;
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
        if (action.payload.accessToken) {
          localStorage.setItem('accessToken', action.payload.accessToken);
        }
        if (action.payload.admin) {
          localStorage.setItem('admin', JSON.stringify(action.payload.admin));
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.admin = null;
        state.error = action.payload;
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        localStorage.removeItem('accessToken');
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = null;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin; // Store admin in state
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('admin', JSON.stringify(action.payload.admin)); // Store admin in local storage
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.admin = null; // Clear admin on error
        localStorage.removeItem('admin'); // Clear admin from local storage
        localStorage.removeItem('accessToken');
      });
  },
});

export const { reset, setUser, setAdmin, updateAccessToken, clearAuthState } = authSlice.actions; // Export setAdmin
export default authSlice.reducer;