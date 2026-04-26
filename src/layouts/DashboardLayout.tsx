import { useAppDispatch, useAppSelector } from '@/store/hooks'
import React, { useState } from 'react'
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
    }

    return (
        <div className="min-h-screen flex flex-col 
            bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100
            dark:from-gray-950 dark:via-gray-900 dark:to-black
            transition-colors duration-500">

            {/* Header */}
            <Header
                username={user?.name}
                loginTime={loginTime}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogOut={handleLogout}
            />

            {/* Body */}
            <div className="flex flex-1 relative">

                {/* Sidebar */}
                <SideBar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6
                    transition-all duration-300">

                    {/* Glass Card Wrapper */}
                    <div className="rounded-2xl p-4 lg:p-6
                        bg-white/70 backdrop-blur-md shadow-lg
                        dark:bg-gray-900/70 dark:border dark:border-gray-800
                        animate-fade-in">

                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white/70 backdrop-blur-md border-t
                dark:bg-gray-900/70 dark:border-gray-800
                py-4 text-center text-sm text-gray-600 dark:text-gray-400
                transition-colors duration-300">

                © {new Date().getFullYear()} Transaction Monitoring System
            </footer>
        </div>
    )
}