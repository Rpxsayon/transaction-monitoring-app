import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectTransactions } from '../selectors';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { TrendingUp, DollarSign, Activity, CheckCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
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
        }, {});
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
        }, {});
        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
        }));
    }, [transactions]);
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Dashboard Overview" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-1", children: "Monitor your transaction metrics and trends" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", children: [{
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
                    return (_jsxs(Card, { className: "rounded-xl shadow-md hover:shadow-xl transition-all duration-300\n                            bg-white/70 backdrop-blur-md dark:bg-gray-900/70 border border-transparent hover:border-blue-200", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [_jsx(CardTitle, { className: "text-sm text-gray-600 dark:text-gray-400", children: item.title }), _jsx(Icon, { className: `h-5 w-5 ${item.color}` })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: item.value }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Last 6 months" })] })] }, i));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "dark:text-white", children: "Transaction Volume Trend" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: monthlyData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month", fontSize: 12 }), _jsx(YAxis, { fontSize: 12 }), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "amount", stroke: "#3b82f6", strokeWidth: 2 })] }) }) })] }), _jsxs(Card, { className: "rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "dark:text-white", children: "Monthly Transaction Count" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: monthlyData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month", fontSize: 12 }), _jsx(YAxis, { fontSize: 12 }), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "transactions", fill: "#10b981" }), _jsx(Bar, { dataKey: "completed", fill: "#3b82f6" })] }) }) })] }), _jsxs(Card, { className: "rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "dark:text-white", children: "Status Distribution" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: statusData, dataKey: "value", outerRadius: 90, children: statusData.map((_, i) => (_jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))) }), _jsx(Tooltip, {})] }) }) })] }), _jsxs(Card, { className: "rounded-xl shadow-md dark:bg-gray-900/70 backdrop-blur-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "dark:text-white", children: "Top Categories" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: categoryData, layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number" }), _jsx(YAxis, { dataKey: "category", type: "category", width: 100 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "amount", fill: "#8b5cf6" })] }) }) })] })] })] }));
}
