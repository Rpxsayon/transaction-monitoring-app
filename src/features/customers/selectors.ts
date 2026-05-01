import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";


export const selectCustomers = (state: RootState) => state.customers.customers;

export const selectCustomerFilters = (state: RootState) => ({
    searchTerm: state.customers.searchTerm,
    statusFilter: state.customers.statusFilter,
    accountTypeFilter: state.customers.accountTypeFilter,
});

export const selectCustomerCurrentPage = (state: RootState) => state.customers.currentPage;
export const selectCustomerItemsPerPage = (state: RootState) => state.customers.itemsPerPage;

export const selectFilteredCustomers = createSelector(
    [selectCustomers, selectCustomerFilters],
    (customer, filters) => {
        return customer.filter(customer => {
            const matchesSearch =
                customer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                customer.accountNumber.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const matchesStatus = filters.statusFilter === 'all' || customer.status === filters.statusFilter;
            const matchesAccountType = filters.accountTypeFilter === 'all' || customer.accountType === filters.accountTypeFilter;

            return matchesSearch && matchesStatus && matchesAccountType;
        })
    }
);

export const selectPaginatedCustomers = createSelector(
    [selectFilteredCustomers, selectCustomerCurrentPage, selectCustomerItemsPerPage],
    (filteredCustomers, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCustomers.slice(startIndex, endIndex);
    }
);

export const selectCustomerTotalPages = createSelector(
    [selectFilteredCustomers, selectCustomerItemsPerPage],
    (filteredCustomers, itemsPerPage) => {
        return Math.ceil(filteredCustomers.length / itemsPerPage);
    }
);

