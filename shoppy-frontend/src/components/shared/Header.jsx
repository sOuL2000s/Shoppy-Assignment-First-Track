import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { cart } = useCart();
    
    const cartItemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-2xl font-bold text-indigo-600">Shoppy</Link>
                <nav className="flex space-x-6 items-center">
                    {isAuthenticated ? (
                        <>
                            {/* Safe check for role access */}
                            {user?.role === 'customer' && (
                                <>
                                    <Link to="/customer/dashboard" className="text-gray-700 hover:text-indigo-600">
                                        Shop
                                    </Link>
                                    <div className="relative">
                                        <span className="text-gray-700 hover:text-indigo-600 cursor-pointer flex items-center">
                                            <FaShoppingCart className="mr-1" /> Cart ({cartItemCount})
                                        </span>
                                    </div>
                                </>
                            )}
                            {user?.role === 'seller' && (
                                <Link to="/seller/dashboard" className="text-gray-700 hover:text-indigo-600">
                                    Inventory
                                </Link>
                            )}
                            
                            {/* Safe check for user email access */}
                            <span className="text-sm text-gray-500 hidden md:block">
                                Welcome, {user?.email} 
                            </span>
                            <button onClick={logout} className="btn-primary bg-red-600 hover:bg-red-700 text-sm flex items-center">
                                <FaSignOutAlt className="mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                            <Link to="/signup" className="btn-primary">Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;