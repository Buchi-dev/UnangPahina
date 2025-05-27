import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/api';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (userId) => {
        const response = await cartService.getCart(userId);
        return response.data;
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ userId, item }) => {
        const response = await cartService.addToCart(userId, item);
        return response.data;
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ userId, bookId, quantity }) => {
        const response = await cartService.updateQuantity(userId, bookId, quantity);
        return response.data;
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async ({ userId, bookId }) => {
        await cartService.removeFromCart(userId, bookId);
        return bookId;
    }
);

export const checkoutCart = createAsyncThunk(
    'cart/checkout',
    async (userId) => {
        const response = await cartService.checkout(userId);
        return response.data;
    }
);

const initialState = {
    items: [],
    total: 0,
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.bookId !== action.payload);
                state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Checkout
            .addCase(checkoutCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkoutCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.total = 0;
            })
            .addCase(checkoutCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer; 