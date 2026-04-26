
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import React, { useEffect } from 'react'
import { checkAuth } from '../authSlice';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    useEffect(() => {
        dispatch(checkAuth())
    }, [dispatch]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />;
}
