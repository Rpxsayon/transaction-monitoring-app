import { jsx as _jsx } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { checkAuth } from '../authSlice';
import { Navigate, Outlet } from 'react-router-dom';
export function ProtectedRoute() {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(Outlet, {});
}
