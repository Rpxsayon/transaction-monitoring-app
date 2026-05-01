import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectTransactions } from '../../transactions/selectors';
import { selectCustomers } from '../../customers/selectors';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

export function AnalyticsPage() {
    const transactions = useAppSelector(selectTransactions);
    const customers = useAppSelector(selectCustomers);

    const dailyAnalytics = useMemo(() => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), 29 - i);
            return {
                date: format(date, 'MMM dd'),
                fullDate: startOfDay(date),
                revenue: 0,
                expenses: 0,
                transactions: 0,
            };
        });

        transactions.forEach(txn => {
            const txnDate = startOfDay(new Date(txn.transactionDate));
            const dayData = last30Days.find(
                d => d.fullDate.getTime() === txnDate.getTime()
            );

            if (dayData) {
                dayData.transactions++;
                if (txn.type === 'credit' && txn.status === 'completed') {
                    dayData.revenue += txn.amount;
                } else if (txn.type === 'debit' && txn.status === 'completed') {
                    dayData.expenses += txn.amount;
                }
            }
        });

        return last30Days.map(d => ({
            date: d.date,
            revenue: parseFloat(d.revenue.toFixed(2)),
            expenses: parseFloat(d.expenses.toFixed(2)),
            transactions: d.transactions,
            netIncome: parseFloat((d.revenue - d.expenses).toFixed(2)),
        }));
    }, [transactions]);

    const categoryAnalytics = useMemo(() => {
        const categoryData: Record<string, { total: number; count: number; avg: number }> = {};

        transactions
            .filter(t => t.status === 'completed')
            .forEach(txn => {
                if (!categoryData[txn.category]) {
                    categoryData[txn.category] = { total: 0, count: 0, avg: 0 };
                }
                categoryData[txn.category].total += txn.amount;
                categoryData[txn.category].count++;
            });

        return Object.entries(categoryData)
            .map(([category, data]) => ({
                category,
                total: parseFloat(data.total.toFixed(2)),
                count: data.count,
                avg: parseFloat((data.total / data.count).toFixed(2)),
            }))
            .sort((a, b) => b.total - a.total);
    }, [transactions]);

    const paymentMethodAnalytics = useMemo(() => {
        const methodData: Record<string, number> = {};

        transactions
            .filter(t => t.status === 'completed')
            .forEach(txn => {
                methodData[txn.paymentMethod] = (methodData[txn.paymentMethod] || 0) + 1;
            });

        return Object.entries(methodData)
            .map(([method, count]) => ({
                method,
                count,
                percentage: parseFloat(((count / transactions.length) * 100).toFixed(1)),
            }))
            .sort((a, b) => b.count - a.count);
    }, [transactions]);

    const customerSegmentation = useMemo(() => {
        const segments = {
            low: { range: '< $10k', count: 0, totalBalance: 0 },
            medium: { range: '$10k - $50k', count: 0, totalBalance: 0 },
            high: { range: '$50k - $100k', count: 0, totalBalance: 0 },
            premium: { range: '> $100k', count: 0, totalBalance: 0 },
        };

        customers.forEach(customer => {
            if (customer.balance < 10000) {
                segments.low.count++;
                segments.low.totalBalance += customer.balance;
            } else if (customer.balance < 50000) {
                segments.medium.count++;
                segments.medium.totalBalance += customer.balance;
            } else if (customer.balance < 100000) {
                segments.high.count++;
                segments.high.totalBalance += customer.balance;
            } else {
                segments.premium.count++;
                segments.premium.totalBalance += customer.balance;
            }
        });

        return Object.entries(segments).map(([, data]) => ({
            segment: data.range,
            customers: data.count,
            balance: parseFloat(data.totalBalance.toFixed(2)),
        }));
    }, [customers]);

    const totalRevenue = useMemo(() => {
        return transactions
            .filter(t => t.type === 'credit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions]);

    const totalExpenses = useMemo(() => {
        return transactions
            .filter(t => t.type === 'debit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions]);

    const revenueGrowth = 12.5;
    const expenseGrowth = -8.3;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
                <p className="text-gray-500 mt-1">Deep dive into financial metrics and trends</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">{revenueGrowth}%</span>
                            <span className="text-xs text-gray-500">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">{Math.abs(expenseGrowth)}%</span>
                            <span className="text-xs text-gray-500">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Net Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(totalRevenue - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Profit margin: {((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1)}%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</div>
                        <p className="text-xs text-gray-500 mt-1">Total: {customers.length} customers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue vs Expenses Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue vs Expenses (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={dailyAnalytics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stackId="1"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.6}
                                    name="Revenue ($)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expenses"
                                    stackId="2"
                                    stroke="#ef4444"
                                    fill="#ef4444"
                                    fillOpacity={0.6}
                                    name="Expenses ($)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Daily Net Income */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Net Income Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyAnalytics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="netIncome"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name="Net Income ($)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Performance by Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryAnalytics.slice(0, 6)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" fontSize={12} />
                                <YAxis dataKey="category" type="category" fontSize={12} width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#8b5cf6" name="Total ($)" />
                                <Bar dataKey="avg" fill="#06b6d4" name="Average ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Payment Method Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={paymentMethodAnalytics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="method" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#f59e0b" name="Transactions" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Customer Segmentation */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Customer Segmentation by Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={customerSegmentation}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="segment" fontSize={12} />
                                <YAxis yAxisId="left" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="customers" fill="#3b82f6" name="Number of Customers" />
                                <Bar yAxisId="right" dataKey="balance" fill="#10b981" name="Total Balance ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
