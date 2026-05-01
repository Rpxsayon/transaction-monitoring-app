
import { createSlice } from "@reduxjs/toolkit";
import type { Customer } from "./custTypes";
import { generateMockCustomers } from "./mockData";

interface CustomerState {
    customers: Customer[];
    searchTerm: string;
    statusFilter: string;
    accountTypeFilter: string;
    currentPage: number;
    itemsPerPage: number;
}

const initialState: CustomerState = {
    customers: generateMockCustomers(),
    searchTerm: '',
    statusFilter: 'all',
    accountTypeFilter: 'all',
    currentPage: 1,
    itemsPerPage: 10,
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomerSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setCustomerStatusFilter: (state, action) => {
            state.statusFilter = action.payload;
        },
        setAccountTypeFilter: (state, action) => {
            state.accountTypeFilter = action.payload;
        },
        clearCustomerFilters: (state) => {
            state.searchTerm = '';
            state.statusFilter = 'all';
            state.accountTypeFilter = 'all';
            state.currentPage = 1;
        },
        setCustomerCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setCustomerItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
            state.currentPage = 1;
        }
    }
});


export const {
    setCustomerSearchTerm,
    setCustomerStatusFilter,
    setAccountTypeFilter,
    clearCustomerFilters,
    setCustomerCurrentPage,
    setCustomerItemsPerPage,
} = customerSlice.actions;


export default customerSlice.reducer;

