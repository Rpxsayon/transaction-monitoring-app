import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectTransactions } from '../selectors';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { TrendingUp, DollarSign, Activity, CheckCircle } from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import { format, startOfMonth, subMonths } from 'date-fns';

export default function DashboardPage() {
    const transactions = useAppSelector(selectTransactions);

    const stats = useMemo(() => {
        const completed = transactions.filter(t => t.status === 'completed').length;
        const totalAmount = transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);
        const avgAmount = totalAmount / completed;

        return {
            totalTransactions: transactions.length,
            completedTransactions: completed,
            totalAmount,
            avgAmount,
        };
    }, [transactions]);

    const monthlyData = useMemo(() => {
        const months = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(new Date(), 5 - i);
            return {
                month: format(date, 'MMM yyyy'),
                startDate: startOfMonth(date),
            };
        });

        return months.map(({ month, startDate }) => {
            const monthTransactions = transactions.filter(t => {
                const txnDate = new Date(t.transactionDate);
                return txnDate.getMonth() === startDate.getMonth() &&
                    txnDate.getFullYear() === startDate.getFullYear();
            });

            const completed = monthTransactions.filter(t => t.status === 'completed');

            return {
                month,
                transactions: monthTransactions.length,
                amount: completed.reduce((sum, t) => sum + t.amount, 0),
                completed: completed.length,
            };
        });
    }, [transactions]);

    const categoryData = useMemo(() => {
        const categoryCounts = transactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryCounts)
            .map(([category, amount]) => ({
                category,
                amount: parseFloat(amount.toFixed(2)),
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 8);
    }, [transactions]);

    const statusData = useMemo(() => {
        const statusCounts = transactions.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
        }));
    }, [transactions]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard Overview
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Monitor your transaction metrics and trends
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {[{
                    title: "Total Transactions",
                    value: stats.totalTransactions,
                    icon: Activity,
                    color: "text-blue-600"
                }, {
                    title: "Completed",
                    value: stats.completedTransactions,
                    icon: CheckCircle,
                    color: "text-green-600"
                }, {
                    title: "Total Volume",
                    value: `$${stats.totalAmount.toLocaleString()}`,
                    icon: DollarSign,
                    color: "text-purple-600"
                }, {
                    title: "Average Amount",
                    value: `$${stats.avgAmount.toLocaleString()}`,
                    icon: TrendingUp,
                    color: "text-orange-600"
                }].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <Card key={i} className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300
                            bg-white/70 backdrop-blur-md dark:bg-gray-900/70 border border-transparent hover:border-blue-200">

                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.title}
                                </CardTitle>
                                <Icon className={`h-5 w-5 ${item.color}`} />
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {item.value}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Last 6 months
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Line Chart */}
                <Card className="rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="dark:text-white">Transaction Volume Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="dark:text-white">Monthly Transaction Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="transactions" fill="#10b981" />
                                <Bar dataKey="completed" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="dark:text-white">Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={statusData} dataKey="value" outerRadius={90}>
                                    {statusData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Chart */}
                <Card className="rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="dark:text-white">Top Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="category" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}