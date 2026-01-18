import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaSignOutAlt, FaStore, FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu

    const cartItemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    const dashboardPath = user?.role === 'seller' ? '/seller/dashboard' : '/customer/dashboard';

    const NavLink = ({ to, children, icon: Icon, onClick }) => (
        <Link 
            to={to} 
            onClick={onClick}
            className="text-gray-700 hover:text-indigo-600 font-medium flex items-center p-2 rounded-lg transition duration-150 hover:bg-gray-100"
        >
            {Icon && <Icon className="mr-2" />}
            {children}
        </Link>
    );

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-3xl font-extrabold text-indigo-700 tracking-tight">Shoppy</Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <NavLink to={dashboardPath} icon={user?.role === 'seller' ? FaStore : FaUserCircle}>
                                Dashboard
                            </NavLink>
                            {user?.role === 'customer' && (
                                <Link to={dashboardPath} className="relative p-2 rounded-lg text-gray-700 hover:text-indigo-600 transition duration-150">
                                    <FaShoppingCart className="text-xl" aria-label={`Cart with ${cartItemCount} items`} />
                                    {cartItemCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                            <button onClick={logout} className="btn-primary bg-red-600 hover:bg-red-700 text-sm flex items-center">
                                <FaSignOutAlt className="mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <Link to="/signup" className="btn-primary">Sign Up</Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                >
                    {/* Placeholder for a burger icon (e.g., FaBars or FaTimes) */}
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>
            
            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div id="mobile-menu" className="md:hidden bg-white shadow-lg border-t border-gray-100 p-4 space-y-2">
                     {isAuthenticated ? (
                        <>
                            <NavLink to={dashboardPath} icon={user?.role === 'seller' ? FaStore : FaUserCircle} onClick={() => setIsMenuOpen(false)}>
                                Dashboard
                            </NavLink>
                            {user?.role === 'customer' && (
                                <NavLink to={dashboardPath} icon={FaShoppingCart} onClick={() => setIsMenuOpen(false)}>
                                    Cart ({cartItemCount})
                                </NavLink>
                            )}
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left btn-primary bg-red-600 hover:bg-red-700 text-sm flex items-center">
                                <FaSignOutAlt className="mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full text-center">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;