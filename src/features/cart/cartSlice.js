import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    itemCount: 0,
    items: [],
  },
  reducers: {
    updateCartItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
    resetCart: (state) => {
      state.itemCount = 0;
      state.items = [];
    },
    addToCart: (state, action) => {
      const { id, quantity, product } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, quantity, product });
      }
      state.itemCount += quantity;
    },
  },
});

export const { updateCartItemCount, resetCart, addToCart } = cartSlice.actions;
export default cartSlice.reducer;
