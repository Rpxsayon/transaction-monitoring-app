import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import { logout } from '@/features/auth';
import SideBar from './SideBar';
export default function DashboardLayout() {
    const dispatch = useAppDispatch();
    const { user, loginTime } = useAppSelector(state => state.auth);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col \n            bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100\n            dark:from-gray-950 dark:via-gray-900 dark:to-black\n            transition-colors duration-500", children: [_jsx(Header, { username: user?.name, loginTime: loginTime, sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen, onLogOut: handleLogout }), _jsxs("div", { className: "flex flex-1 relative", children: [_jsx(SideBar, { sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen }), _jsx("main", { className: "flex-1 overflow-auto p-4 lg:p-6\n                    transition-all duration-300", children: _jsx("div", { className: "rounded-2xl p-4 lg:p-6\n                        bg-white/70 backdrop-blur-md shadow-lg\n                        dark:bg-gray-900/70 dark:border dark:border-gray-800\n                        animate-fade-in", children: _jsx(Outlet, {}) }) })] }), _jsxs("footer", { className: "bg-white/70 backdrop-blur-md border-t\n                dark:bg-gray-900/70 dark:border-gray-800\n                py-4 text-center text-sm text-gray-600 dark:text-gray-400\n                transition-colors duration-300", children: ["\u00A9 ", new Date().getFullYear(), " Transaction Monitoring System"] })] }));
}
