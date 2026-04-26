
import React from 'react'
import { Button } from '@/app/components/ui/button'
import { format } from 'date-fns';

import {
    Menu,
    X,
    TrendingUp,
    LogOut
} from 'lucide-react';

interface HeaderProps {
    username: string | undefined;
    loginTime: string | null;
    sidebarOpen: boolean;
    setSidebarOpen: (val: boolean) => void;
    onLogOut: () => void;
};

export default function Header({
    username,
    loginTime,
    sidebarOpen,
    setSidebarOpen,
    onLogOut,
}: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                        <h1 className="text-lg font-semibold">Transaction Monitor</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end text-sm">
                        <span className="font-medium text-gray-900">{username}</span>
                        {loginTime && (
                            <span className="text-xs text-gray-500">
                                Login: {format(new Date(loginTime), 'MMM dd, yyyy HH:mm')}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onLogOut}
                        className="gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
