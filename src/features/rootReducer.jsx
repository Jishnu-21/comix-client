import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import adminAuthReducer from './auth/adminAuthSlice';
import userReducer from './user/userSlice';
import cartReducer from './cart/cartSlice';

const rootReducer = () => combineReducers({
  auth: authReducer,
  adminAuth: adminAuthReducer,
  user: userReducer,
  cart: cartReducer,
});

export default rootReducer;