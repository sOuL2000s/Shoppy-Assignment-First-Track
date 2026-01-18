import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, isLoading } = useAuth();

    // CRITICAL FIX: Wait for authentication state to load from localStorage
    if (isLoading) {
        return <div className="text-center p-10 text-xl text-indigo-600">Checking authorization...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        // Logged in but unauthorized role
        return <Navigate to="/" replace state={{ message: "Access Denied: Insufficient role." }} />;
    }

    return children;
};

export default ProtectedRoute;