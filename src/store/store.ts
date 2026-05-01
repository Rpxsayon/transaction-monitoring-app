import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import transactionReducer from '../features/transactions/transactionSlice';
import customerReducer from '../features/customers/customerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        customers: customerReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 