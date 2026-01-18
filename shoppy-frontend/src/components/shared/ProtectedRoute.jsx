import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // We rely on isLoading being false when local storage check is done.
    const { isAuthenticated, role, isLoading } = useAuth();

    if (isLoading) {
        // Must show loading state while local storage is being processed
        return <div className="text-center p-10 text-xl">Loading authentication state...</div>;
    }

    if (!isAuthenticated) {
        // Not logged in -> redirect to login
        return <Navigate to="/login" replace />;
    }

    // FIX: If the user is authenticated but somehow the role is missing or hasn't loaded 
    // (though AuthContext tries to prevent this), prevent access immediately.
    if (!role) {
        console.error("Authenticated user has no defined role. Redirecting to home.");
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Logged in but unauthorized role -> redirect to home
        console.warn(`Access Denied. User role: ${role}. Required: ${allowedRoles.join(', ')}`);
        return <Navigate to="/" replace state={{ message: "Access Denied: Insufficient role." }} />;
    }

    return children;
};

export default ProtectedRoute;