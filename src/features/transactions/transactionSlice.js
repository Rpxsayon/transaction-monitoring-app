import { generateMockTransactions } from './mockData';
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    transactions: generateMockTransactions(),
    filters: {
        searchTerm: '',
        status: 'all',
        type: 'all',
        category: 'all',
    },
    loading: false,
};
const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.filters.searchTerm = action.payload;
        },
        setStatusFilter: (state, action) => {
            state.filters.status = action.payload;
        },
        setTypeFilter: (state, action) => {
            state.filters.type = action.payload;
        },
        setCategoryFilter: (state, action) => {
            state.filters.category = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                searchTerm: '',
                status: 'all',
                type: 'all',
                category: 'all',
            };
        },
    },
});
export const { setSearchTerm, setStatusFilter, setTypeFilter, setCategoryFilter, clearFilters } = transactionSlice.actions;
export default transactionSlice.reducer;
