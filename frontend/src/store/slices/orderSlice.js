import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/api';

export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (userId) => {
        const response = await orderService.getUserOrders(userId);
        return response.data;
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (id) => {
        const response = await orderService.getOrder(id);
        return response.data;
    }
);

const initialState = {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer; 