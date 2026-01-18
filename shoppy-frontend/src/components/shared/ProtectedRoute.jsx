import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, isLoading } = useAuth();

    if (isLoading) {
        return <div className="text-center p-10 text-xl">Loading authentication state...</div>;
    }

    if (!isAuthenticated) {
        // Not logged in -> redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Logged in but unauthorized role -> redirect to home
        return <Navigate to="/" replace state={{ message: "Access Denied: Insufficient role." }} />;
    }

    return children;
};

export default ProtectedRoute;