import React from 'react'
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ListFilter } from 'lucide-react';


interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (val: boolean) => void;
}


export default function SideBar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/transactions', label: 'Transactions', icon: ListFilter },
    ];


    return (
        <>
            <aside
                className={`
    fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r
    transform transition-transform duration-200
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0
    top-16 lg:top-0
  `}
            >
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'hover:bg-gray-100'}
                `}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            {/* Mobile overlay */}
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden top-16"
                        onClick={() => setSidebarOpen(false)}
                    >

                    </div>
                )
            }
        </>
    )
}
