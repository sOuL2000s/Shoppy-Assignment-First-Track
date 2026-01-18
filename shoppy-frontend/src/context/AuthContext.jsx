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
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            // Basic check if token is present, better done with token expiration check
            if (userData.accessToken) {
                 setUser(userData);
            } else {
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post("/auth/login", { email, password });
        const userData = response.data;
        
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        navigate(userData.role === 'seller' ? '/seller/dashboard' : '/customer/dashboard');
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate('/login');
    };

    const value = { user, isLoading, isAuthenticated: !!user, role: user?.role, login, logout };

    if (isLoading) return <div className="text-center p-10">Loading...</div>;
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};