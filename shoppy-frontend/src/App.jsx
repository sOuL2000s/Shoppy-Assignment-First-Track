// shoppy-frontend\src\App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import Header from './components/shared/Header';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import OtpVerification from './pages/OtpVerification'; // Removed import
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard';

const App = () => {
    return (
        <Router>
            <AuthProvider> 
                <CartProvider> 
                    <Header />
                    {/* Increased top padding to account for fixed header, set cleaner background */}
                    <main className="container mx-auto px-4 sm:px-6 pt-24 min-h-screen bg-gray-50">
                        <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        {/* Route removed */}

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