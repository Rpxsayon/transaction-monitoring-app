import { LoginPage } from '@/features/auth';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '@/features/transactions/components/DashboardPage';
import { TransactionListPage } from '@/features/transactions/components/TransactionListPage';
import { AnalyticsPage } from '@/features/analytics/components/AnalyticsPage';
import CustomersPage from '@/features/customers/components/CustomersPage';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    // Protected routes
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: '/dashboard',
                        element: <DashboardPage />
                    },
                    {
                        path: '/transactions',
                        element: <TransactionListPage />
                    },
                    {
                        path: '/analytics',
                        element: <AnalyticsPage />

                    },
                    {
                        path: '/customers',
                        element: <CustomersPage />
                    }
                ]
            },
        ]
    }
]);