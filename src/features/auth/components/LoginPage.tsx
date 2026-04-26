import React, { SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { TrendingUp, Mail, Lock, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '../authSlice';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4
            bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200
            dark:from-gray-900 dark:via-gray-800 dark:to-black
            transition-colors duration-500">

            <Card className="w-full max-w-md p-8 rounded-2xl shadow-2xl
                bg-white/80 backdrop-blur-md
                dark:bg-gray-900/80 dark:border-gray-700
                animate-fade-in">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 
                        p-4 rounded-2xl mb-4 shadow-lg animate-bounce-slow">
                        <TrendingUp className="h-8 w-8 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                        Sign in to Transaction Monitoring System
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative group">
                            <Mail
                                className="absolute left-3 top-1/2 -translate-y-1/2 
                                h-5 w-5 text-gray-400 
                                group-focus-within:text-blue-500 transition"
                            />

                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-11 focus:ring-2 focus:ring-blue-500 
                                    dark:bg-gray-800 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative group">
                            <Lock
                                className="absolute left-3 top-1/2 -translate-y-1/2 
                                h-5 w-5 text-gray-400 
                                group-focus-within:text-blue-500 transition"
                            />

                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-11 focus:ring-2 focus:ring-blue-500 
                                    dark:bg-gray-800 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/40 
                            text-red-600 dark:text-red-400 
                            px-4 py-2 rounded-md text-sm animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Button */}
                    <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600
                            hover:from-blue-700 hover:to-indigo-700
                            text-white font-semibold rounded-lg
                            transition-all duration-300 transform hover:scale-[1.02]"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use any email and password to login
                    </p>
                </div>
            </Card>
        </div>
    )
}