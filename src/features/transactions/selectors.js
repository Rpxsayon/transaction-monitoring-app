import { createSelector } from "@reduxjs/toolkit";
export const selectTransactions = (state) => state.transactions.transactions;
export const selectFilters = (state) => state.transactions.filters;
export const selectFilteredTransactions = createSelector([selectTransactions, selectFilters], (transactions, filters) => {
    return transactions.filter(txn => {
        const matchesSearch = txn.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            txn.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            txn.merchantName.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesStatus = filters.status === 'all' || txn.status === filters.status;
        const matchesType = filters.type === 'all' || txn.type === filters.type;
        const matchesCategory = filters.category === 'all' || txn.category === filters.category;
        return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
});
export const selectCategories = createSelector([selectTransactions], (transactions) => {
    const categories = [...new Set(transactions.map(t => t.category))];
    return categories.sort();
});
