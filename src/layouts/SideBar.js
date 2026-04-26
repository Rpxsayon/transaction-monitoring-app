import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ListFilter } from 'lucide-react';
export default function SideBar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/transactions', label: 'Transactions', icon: ListFilter },
    ];
    return (_jsxs(_Fragment, { children: [_jsx("aside", { className: `
    fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r
    transform transition-transform duration-200
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0
    top-16 lg:top-0
  `, children: _jsx("nav", { className: "p-4 space-y-2", children: menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (_jsxs(Link, { to: item.path, onClick: () => setSidebarOpen(false), className: `
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  ${isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-100'}
                `, children: [_jsx(Icon, { className: "h-5 w-5" }), item.label] }, item.path));
                    }) }) }), sidebarOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-20 lg:hidden top-16", onClick: () => setSidebarOpen(false) }))] }));
}
