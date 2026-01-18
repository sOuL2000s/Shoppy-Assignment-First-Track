import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // <-- Add CartProvider import here
import Header from './components/shared/Header';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard';

const App = () => {
    return (
        <Router>
            {/* 1. AuthProvider must be the highest level context consumer */}
            <AuthProvider> 
                {/* 2. CartProvider depends on AuthProvider, so it must be nested inside */}
                <CartProvider> 
                    <Header />
                    <main className="container mx-auto p-4 pt-20 min-h-screen bg-gray-50">
                        <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify-otp" element={<OtpVerification />} />

                        <Route path="/customer/dashboard" element={
                            <ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>
                        } />

                        <Route path="/seller/dashboard" element={
                            <ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>
                        } />

                        <Route path="*" element={<h1 className="text-xl">404 Not Found</h1>} />
                        </Routes>
                    </main>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;