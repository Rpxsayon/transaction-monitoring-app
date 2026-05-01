

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    selectPaginatedCustomers,
    selectFilteredCustomers,
    selectCustomers,
    selectCustomerFilters,
    selectCustomerCurrentPage,
    selectCustomerItemsPerPage,
    selectCustomerTotalPages
} from '../selectors';

import { Customer } from '../custTypes';
import { Badge } from '../../../app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Input } from '../../../app/components/ui/input';
import { Button } from '../../../app/components/ui/button';
import { Search, Filter, X, UserCircle2, TrendingUp, Users, DollarSign } from 'lucide-react';
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
import { format } from 'date-fns';
import {
    setCustomerSearchTerm,
    setCustomerStatusFilter,
    setAccountTypeFilter,
    clearCustomerFilters,
    setCustomerCurrentPage,
    setCustomerItemsPerPage,
} from '../customerSlice';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../../app/components/ui/pagination';
import { useMemo } from 'react';




export default function CustomersPage() {
    const dispatch = useAppDispatch();
    const paginatedCustomers = useAppSelector(selectPaginatedCustomers);
    const filteredCustomers = useAppSelector(selectFilteredCustomers);
    const allCustomers = useAppSelector(selectCustomers);
    const filters = useAppSelector(selectCustomerFilters);
    const currentPage = useAppSelector(selectCustomerCurrentPage);
    const itemsPerPage = useAppSelector(selectCustomerItemsPerPage);
    const totalPages = useAppSelector(selectCustomerTotalPages);


    // showing stats of the customers 
    const stats = useMemo(() => {
        const active = allCustomers.filter(c => c.status === 'active').length;
        const totalBalance = allCustomers.reduce((sum, c) => sum + c.balance, 0);
        const avgBalance = totalBalance / allCustomers.length;
        const highRisk = allCustomers.filter(c => c.riskLevel === 'high').length;
        return { active, totalBalance, avgBalance, highRisk };
    }, [allCustomers]);

    const hasActiveFilters =
        filters.statusFilter !== 'all' ||
        filters.accountTypeFilter !== 'all' ||
        filters.searchTerm !== '';

    const handleClearFilters = () => {
        dispatch(clearCustomerFilters());
    };

    const handlePageChange = (page: number) => {
        dispatch(setCustomerCurrentPage(page));
    };

    const handleItemsPerPageChange = (value: string) => {
        dispatch(setCustomerItemsPerPage(Number(value)));
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const getStatusBadge = (status: Customer['status']) => {
        const variants: Record<Customer['status'], { class: string }> = {
            active: { class: 'bg-green-100 text-green-800 hover:bg-green-100' },
            inactive: { class: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
            suspended: { class: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };
        return (
            <Badge className={variants[status].class}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getRiskBadge = (risk: Customer['riskLevel']) => {
        const variants: Record<Customer['riskLevel'], { class: string }> = {
            low: { class: 'bg-green-100 text-green-800 hover:bg-green-100' },
            medium: { class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            high: { class: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };

        return (
            <Badge className={variants[risk].class}>
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
                <p className="text-gray-500 mt-1">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
                </p>
            </div>

            {/* Stats*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allCustomers.length}</div>
                        <p className="text-xs text-gray-500 mt-1">{stats.active} active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Average Balance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.avgBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Per customer</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">High Risk</CardTitle>
                        <UserCircle2 className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.highRisk}</div>
                        <p className="text-xs text-gray-500 mt-1">Customers flagged</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2">
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, email, account..."
                                value={filters.searchTerm}
                                onChange={(e) => dispatch(setCustomerSearchTerm(e.target.value))}
                                className="pl-10"
                            />
                        </div>

                        <Select value={filters.statusFilter} onValueChange={(value) => dispatch(setCustomerStatusFilter(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.accountTypeFilter} onValueChange={(value) => dispatch(setAccountTypeFilter(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Account Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="savings">Savings</SelectItem>
                                <SelectItem value="checking">Checking</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="25">25 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                                <SelectItem value="100">100 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/*Customers Table */}

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Account Number</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Risk Level</TableHead>
                                    <TableHead>Transactions</TableHead>
                                    <TableHead>Last Activity</TableHead>
                                    <TableHead>Join Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                            No customers found matching your filters
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedCustomers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{customer.name}</div>
                                                    <div className="text-sm text-gray-500">{customer.email}</div>
                                                    <div className="text-xs text-gray-400">{customer.phone}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{customer.accountNumber}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {customer.accountType.charAt(0).toUpperCase() + customer.accountType.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${customer.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(customer.status)}</TableCell>
                                            <TableCell>{getRiskBadge(customer.riskLevel)}</TableCell>
                                            <TableCell className="text-center">{customer.totalTransactions}</TableCell>
                                            <TableCell className="text-sm">
                                                {format(new Date(customer.lastTransaction), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {format(new Date(customer.joinDate), 'MMM dd, yyyy')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === 'ellipsis' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            onClick={() => handlePageChange(page as number)}
                                            isActive={currentPage === page}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}
