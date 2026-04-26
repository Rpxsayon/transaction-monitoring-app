import { jsx as _jsx } from "react/jsx-runtime";
import { LoginPage } from '@/features/auth';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '@/features/transactions/components/DashboardPage';
import { TransactionListPage } from '@/features/transactions/components/TransactionListPage';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(Navigate, { to: "/login", replace: true })
    },
    {
        path: '/login',
        element: _jsx(LoginPage, {})
    },
    // Protected routes
    {
        element: _jsx(ProtectedRoute, {}),
        children: [
            {
                element: _jsx(DashboardLayout, {}),
                children: [
                    {
                        path: '/dashboard',
                        element: _jsx(DashboardPage, {})
                    }, {
                        path: '/transactions',
                        element: _jsx(TransactionListPage, {})
                    }
                ]
            },
        ]
    }
]);
