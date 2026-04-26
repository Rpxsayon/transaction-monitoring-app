import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center px-4\n            bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200\n            dark:from-gray-900 dark:via-gray-800 dark:to-black\n            transition-colors duration-500", children: _jsxs(Card, { className: "w-full max-w-md p-8 rounded-2xl shadow-2xl\n                bg-white/80 backdrop-blur-md\n                dark:bg-gray-900/80 dark:border-gray-700\n                animate-fade-in", children: [_jsxs("div", { className: "flex flex-col items-center mb-8", children: [_jsx("div", { className: "bg-gradient-to-tr from-blue-500 to-indigo-600 \n                        p-4 rounded-2xl mb-4 shadow-lg animate-bounce-slow", children: _jsx(TrendingUp, { className: "h-8 w-8 text-white" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Welcome Back" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2 text-center", children: "Sign in to Transaction Monitoring System" })] }), _jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsxs("div", { className: "relative group", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 \n                                h-5 w-5 text-gray-400 \n                                group-focus-within:text-blue-500 transition" }), _jsx(Input, { id: "email", type: "email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), className: "pl-10 h-11 focus:ring-2 focus:ring-blue-500 \n                                    dark:bg-gray-800 dark:text-white", required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsxs("div", { className: "relative group", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 \n                                h-5 w-5 text-gray-400 \n                                group-focus-within:text-blue-500 transition" }), _jsx(Input, { id: "password", type: "password", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), className: "pl-10 h-11 focus:ring-2 focus:ring-blue-500 \n                                    dark:bg-gray-800 dark:text-white", required: true })] })] }), error && (_jsx("div", { className: "bg-red-100 dark:bg-red-900/40 \n                            text-red-600 dark:text-red-400 \n                            px-4 py-2 rounded-md text-sm animate-shake", children: error })), _jsx(Button, { type: "submit", className: "w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600\n                            hover:from-blue-700 hover:to-indigo-700\n                            text-white font-semibold rounded-lg\n                            transition-all duration-300 transform hover:scale-[1.02]", disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Signing in..."] })) : ('Sign In') })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Use any email and password to login" }) })] }) }));
}
