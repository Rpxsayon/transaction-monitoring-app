import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    selectFilteredTransactions,
    selectTransactions,
    selectCategories,
    selectFilters,
} from '../selectors';
import {
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setCategoryFilter,
    clearFilters,
} from '../transactionSlice';
import type { Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Input } from '../../../app/components/ui/input';
import { Button } from '../../../app/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../../app/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../app/components/ui/table';
import { Badge } from '../../../app/components/ui/badge';
import { Download, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

export function TransactionListPage() {
    const dispatch = useAppDispatch();
    const filteredTransactions = useAppSelector(selectFilteredTransactions);
    const allTransactions = useAppSelector(selectTransactions);
    const categories = useAppSelector(selectCategories);
    const filters = useAppSelector(selectFilters);

    const hasActiveFilters =
        filters.status !== 'all' ||
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

    const getStatusBadge = (status: Transaction['status']) => {
        const variants: Record<Transaction['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline', class: string }> = {
            completed: { variant: 'default', class: 'bg-green-100 text-green-800 hover:bg-green-100' },
            pending: { variant: 'secondary', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            failed: { variant: 'destructive', class: 'bg-red-100 text-red-800 hover:bg-red-100' },
            processing: { variant: 'outline', class: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
        };

        return (
            <Badge variant={variants[status].variant} className={variants[status].class}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Transactions
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Showing {filteredTransactions.length} of {allTransactions.length} transactions
                    </p>
                </div>

                <Button
                    onClick={downloadCSV}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Filters */}
            <Card className="rounded-xl shadow-md bg-white/70 backdrop-blur-md 
            dark:bg-gray-900/70 border border-transparent">

                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                            <Filter className="h-5 w-5 text-blue-500" />
                            Filters
                        </CardTitle>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="gap-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                            h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />

                            <Input
                                placeholder="Search transactions..."
                                value={filters.searchTerm}
                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                className="pl-10 h-11 focus:ring-2 focus:ring-blue-500 
                                dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        {/* Selects */}
                        {[{
                            value: filters.status,
                            action: setStatusFilter,
                            options: ['all', 'completed', 'pending', 'processing', 'failed']
                        }, {
                            value: filters.type,
                            action: setTypeFilter,
                            options: ['all', 'debit', 'credit']
                        }].map((item, i) => (
                            <Select
                                key={i}
                                value={item.value}
                                onValueChange={(value) => dispatch(item.action(value))}
                            >
                                <SelectTrigger className="h-11 dark:bg-gray-800 dark:text-white">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.options.map(opt => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ))}

                        {/* Category */}
                        <Select
                            value={filters.category}
                            onValueChange={(value) => dispatch(setCategoryFilter(value))}
                        >
                            <SelectTrigger className="h-11 dark:bg-gray-800 dark:text-white">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="rounded-xl shadow-md bg-white/70 backdrop-blur-md 
            dark:bg-gray-900/70 overflow-hidden">

                <CardContent className="p-0">
                    <div className="overflow-x-auto">

                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Merchant</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9}
                                            className="text-center py-10 text-gray-500 dark:text-gray-400">
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions.map((txn) => (
                                        <TableRow
                                            key={txn.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                        >
                                            <TableCell className="font-mono text-xs text-blue-600">
                                                {txn.id}
                                            </TableCell>

                                            <TableCell className="text-sm">
                                                {format(new Date(txn.transactionDate), 'MMM dd, yyyy')}
                                                <div className="text-xs text-gray-400">
                                                    {format(new Date(txn.transactionDate), 'HH:mm:ss')}
                                                </div>
                                            </TableCell>

                                            <TableCell>{txn.customerName}</TableCell>
                                            <TableCell>{txn.merchantName}</TableCell>

                                            <TableCell>
                                                <Badge variant="outline" className="dark:border-gray-600">
                                                    {txn.category}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right font-semibold">
                                                <span className={
                                                    txn.type === 'debit'
                                                        ? 'text-red-500'
                                                        : 'text-green-500'
                                                }>
                                                    {txn.type === 'debit' ? '-' : '+'}${txn.amount.toFixed(2)}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={txn.type === 'debit' ? 'destructive' : 'default'}
                                                >
                                                    {txn.type.toUpperCase()}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                {txn.paymentMethod}
                                            </TableCell>

                                            <TableCell>{getStatusBadge(txn.status)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
