import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { isAuthenticated, role } = useAuth();
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated || role !== 'customer') {
            setCart({ items: [], total: 0 });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('/customer/cart');
            setCart(response.data.data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // On failure, rely on an empty cart state
            setCart({ items: [], total: 0 });
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, role]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (role !== 'customer') return alert("Only customers can use the cart.");
        setLoading(true);
        try {
            const response = await axios.post('/customer/cart', { productId, quantity });
            setCart(response.data.data);
            alert("Item added successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add item to cart.");
        } finally {
            setLoading(false);
        }
    };
    
    const checkout = async () => {
        if (cart.items.length === 0) {
            alert("Cannot checkout an empty cart.");
            return false;
        }
        setLoading(true);
        try {
            await axios.post('/customer/checkout', { shippingAddress: 'User Default Address' });
            setCart({ items: [], total: 0 }); // Clear cart on success
            alert("Order placed successfully! Check order history.");
            return true;
        } catch (error) {
            alert(error.response?.data?.message || "Checkout failed due to stock or server error.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const value = { cart, loading, fetchCart, addToCart, checkout };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};