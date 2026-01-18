import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, role } = useAuth();

    return (
        <div className="text-center py-20">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Welcome to Shoppy V2</h1>
            <p className="text-xl text-gray-600 mb-8">
                Your next-generation e-commerce platform built on React, Node, Redis, and MySQL.
            </p>
            
            {!isAuthenticated ? (
                <div className="space-x-4">
                    <Link to="/login" className="btn-primary">
                        Login
                    </Link>
                    <Link to="/signup" className="btn-primary bg-green-600 hover:bg-green-700">
                        Register Now
                    </Link>
                </div>
            ) : (
                <div className="mt-8 p-6 bg-indigo-50 border-l-4 border-indigo-500 inline-block rounded-lg shadow-md">
                    {/* Check if role exists before using toUpperCase() */}
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
                        {role ? `You are logged in as a ${role.toUpperCase()}` : 'Welcome Back!'}
                    </h2>
                    <Link 
                        to={role === 'seller' ? '/seller/dashboard' : '/customer/dashboard'}
                        className="text-lg text-indigo-600 hover:text-indigo-800 underline"
                    >
                        Go to your Dashboard &rarr;
                    </Link>
                </div>
            )}

            <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="card text-left">
                    <h3 className="text-xl font-bold mb-2 text-indigo-600">For Customers</h3>
                    <p className="text-gray-600">Browse available products, add items to your high-speed Redis-backed cart, and track your previous orders.</p>
                </div>
                <div className="card text-left">
                    <h3 className="text-xl font-bold mb-2 text-indigo-600">For Sellers</h3>
                    <p className="text-gray-600">Manage your product inventory, update stock levels, and make your items visible to thousands of potential customers.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;