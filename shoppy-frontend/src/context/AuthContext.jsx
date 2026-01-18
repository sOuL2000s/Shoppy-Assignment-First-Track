import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        let initialUser = null;

        if (storedUser) {
            const userData = JSON.parse(storedUser);
            // CRITICAL FIX: Ensure both accessToken and role are present when loading from storage
            if (userData.accessToken && userData.role) { 
                 initialUser = userData;
            } else {
                // If token or role is missing/invalid in storage, clear it
                localStorage.removeItem('user');
            }
        }
        
        // Set both states atomically after reading storage
        setUser(initialUser);
        setIsLoading(false);
        
    }, []);

    const login = async (email, password) => {
        const response = await axios.post("/auth/login", { email, password });
        
        // FIX: Extract user data correctly from the nested 'data' field provided by the backend's successResponse wrapper
        const userData = response.data.data; 

        if (!userData || !userData.role) {
            throw new Error("Login data corrupted: role missing.");
        }

        const loginData = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            accessToken: userData.accessToken
        };
        
        localStorage.setItem("user", JSON.stringify(loginData));
        setUser(loginData);

        // Navigate based on the newly set role
        navigate(loginData.role === 'seller' ? '/seller/dashboard' : '/customer/dashboard');
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate('/login');
    };

    const value = { 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        role: user?.role, 
        login, 
        logout 
    };

    if (isLoading) return <div className="text-center p-10">Loading...</div>;
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};