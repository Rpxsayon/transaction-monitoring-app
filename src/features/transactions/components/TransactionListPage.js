import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectFilteredTransactions, selectTransactions, selectCategories, selectFilters, } from '../selectors';
import { setSearchTerm, setStatusFilter, setTypeFilter, setCategoryFilter, clearFilters, } from '../transactionSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Input } from '../../../app/components/ui/input';
import { Button } from '../../../app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '../../../app/components/ui/table';
import { Badge } from '../../../app/components/ui/badge';
import { Download, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
export function TransactionListPage() {
    const dispatch = useAppDispatch();
    const filteredTransactions = useAppSelector(selectFilteredTransactions);
    const allTransactions = useAppSelector(selectTransactions);
    const categories = useAppSelector(selectCategories);
    const filters = useAppSelector(selectFilters);
    const hasActiveFilters = filters.status !== 'all' ||
        filters.type !== 'all' ||
        filters.category !== 'all' ||
        filters.searchTerm !== '';
    const handleClearFilters = () => {
        dispatch(clearFilters());
    };
    const downloadCSV = () => {
        const headers = [
            'Transaction ID',
            'Date',
            'Customer Name',
            'Merchant',
            'Amount',
            'Currency',
            'Type',
            'Status',
            'Category',
            'Payment Method',
            'Description',
        ];
        const csvData = filteredTransactions.map(txn => [
            txn.id,
            format(new Date(txn.transactionDate), 'yyyy-MM-dd HH:mm:ss'),
            txn.customerName,
            txn.merchantName,
            txn.amount.toFixed(2),
            txn.currency,
            txn.type,
            txn.status,
            txn.category,
            txn.paymentMethod,
            txn.description,
        ]);
        const csv = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };
    const getStatusBadge = (status) => {
        const variants = {
            completed: { variant: 'default', class: 'bg-green-100 text-green-800 hover:bg-green-100' },
            pending: { variant: 'secondary', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            failed: { variant: 'destructive', class: 'bg-red-100 text-red-800 hover:bg-red-100' },
            processing: { variant: 'outline', class: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
        };
        return (_jsx(Badge, { variant: variants[status].variant, className: variants[status].class, children: status.charAt(0).toUpperCase() + status.slice(1) }));
    };
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Transactions" }), _jsxs("p", { className: "text-gray-500 dark:text-gray-400 mt-1", children: ["Showing ", filteredTransactions.length, " of ", allTransactions.length, " transactions"] })] }), _jsxs(Button, { onClick: downloadCSV, className: "gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 \n                hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition", children: [_jsx(Download, { className: "h-4 w-4" }), "Export CSV"] })] }), _jsxs(Card, { className: "rounded-xl shadow-md bg-white/70 backdrop-blur-md \n            dark:bg-gray-900/70 border border-transparent", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-gray-800 dark:text-white", children: [_jsx(Filter, { className: "h-5 w-5 text-blue-500" }), "Filters"] }), hasActiveFilters && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: handleClearFilters, className: "gap-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30", children: [_jsx(X, { className: "h-4 w-4" }), "Clear"] }))] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 \n                            h-4 w-4 text-gray-400 group-focus-within:text-blue-500" }), _jsx(Input, { placeholder: "Search transactions...", value: filters.searchTerm, onChange: (e) => dispatch(setSearchTerm(e.target.value)), className: "pl-10 h-11 focus:ring-2 focus:ring-blue-500 \n                                dark:bg-gray-800 dark:text-white" })] }), [{
                                        value: filters.status,
                                        action: setStatusFilter,
                                        options: ['all', 'completed', 'pending', 'processing', 'failed']
                                    }, {
                                        value: filters.type,
                                        action: setTypeFilter,
                                        options: ['all', 'debit', 'credit']
                                    }].map((item, i) => (_jsxs(Select, { value: item.value, onValueChange: (value) => dispatch(item.action(value)), children: [_jsx(SelectTrigger, { className: "h-11 dark:bg-gray-800 dark:text-white", children: _jsx(SelectValue, { placeholder: "Select" }) }), _jsx(SelectContent, { children: item.options.map(opt => (_jsx(SelectItem, { value: opt, children: opt.charAt(0).toUpperCase() + opt.slice(1) }, opt))) })] }, i))), _jsxs(Select, { value: filters.category, onValueChange: (value) => dispatch(setCategoryFilter(value)), children: [_jsx(SelectTrigger, { className: "h-11 dark:bg-gray-800 dark:text-white", children: _jsx(SelectValue, { placeholder: "Category" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Categories" }), categories.map(category => (_jsx(SelectItem, { value: category, children: category }, category)))] })] })] }) })] }), _jsx(Card, { className: "rounded-xl shadow-md bg-white/70 backdrop-blur-md \n            dark:bg-gray-900/70 overflow-hidden", children: _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { className: "bg-gray-50 dark:bg-gray-800", children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "ID" }), _jsx(TableHead, { children: "Date" }), _jsx(TableHead, { children: "Customer" }), _jsx(TableHead, { children: "Merchant" }), _jsx(TableHead, { children: "Category" }), _jsx(TableHead, { className: "text-right", children: "Amount" }), _jsx(TableHead, { children: "Type" }), _jsx(TableHead, { children: "Payment" }), _jsx(TableHead, { children: "Status" })] }) }), _jsx(TableBody, { children: filteredTransactions.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, className: "text-center py-10 text-gray-500 dark:text-gray-400", children: "No transactions found" }) })) : (filteredTransactions.map((txn) => (_jsxs(TableRow, { className: "hover:bg-gray-50 dark:hover:bg-gray-800 transition", children: [_jsx(TableCell, { className: "font-mono text-xs text-blue-600", children: txn.id }), _jsxs(TableCell, { className: "text-sm", children: [format(new Date(txn.transactionDate), 'MMM dd, yyyy'), _jsx("div", { className: "text-xs text-gray-400", children: format(new Date(txn.transactionDate), 'HH:mm:ss') })] }), _jsx(TableCell, { children: txn.customerName }), _jsx(TableCell, { children: txn.merchantName }), _jsx(TableCell, { children: _jsx(Badge, { variant: "outline", className: "dark:border-gray-600", children: txn.category }) }), _jsx(TableCell, { className: "text-right font-semibold", children: _jsxs("span", { className: txn.type === 'debit'
                                                        ? 'text-red-500'
                                                        : 'text-green-500', children: [txn.type === 'debit' ? '-' : '+', "$", txn.amount.toFixed(2)] }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: txn.type === 'debit' ? 'destructive' : 'default', children: txn.type.toUpperCase() }) }), _jsx(TableCell, { className: "text-sm text-gray-600 dark:text-gray-400", children: txn.paymentMethod }), _jsx(TableCell, { children: getStatusBadge(txn.status) })] }, txn.id)))) })] }) }) }) })] }));
}
