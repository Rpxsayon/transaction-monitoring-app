import { LoginPage } from '@/features/auth';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '@/features/transactions/components/DashboardPage';
import { TransactionListPage } from '@/features/transactions/components/TransactionListPage';


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
                    }, {
                        path: '/transactions',
                        element: <TransactionListPage />
                    }
                ]
            },
        ]
    }
]);