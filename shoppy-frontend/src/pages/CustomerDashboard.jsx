import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaListAlt } from 'react-icons/fa';

const ProductCard = ({ product, addToCart }) => (
    <div className="card h-full flex flex-col justify-between">
        <div>
            <img src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} alt={product.name} className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
            <p className="text-2xl font-bold text-indigo-600 mb-2">${product.price}</p>
            <p className="text-sm text-gray-500 mb-4">{product.description}</p>
        </div>
        <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-500'}`}>
                Stock: {product.stock}
            </span>
            <button 
                onClick={() => addToCart(product.id, 1)} 
                className="btn-primary px-3 py-1 text-sm"
                disabled={product.stock === 0}
            >
                Add to Cart
            </button>
        </div>
    </div>
);

const CartDisplay = () => {
    const { cart, loading, checkout } = useCart();

    const handleCheckout = async () => {
        await checkout();
    };

    return (
        <div className="card sticky top-20">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-600">
                <FaShoppingCart className="mr-2" /> Your Cart
            </h2>
            {loading ? (
                <p>Loading cart...</p>
            ) : cart.items && cart.items.length > 0 ? (
                <>
                    <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                        {cart.items.map((item, index) => (
                            <li key={index} className="flex justify-between border-b pb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="text-xl font-bold pt-4 border-t">
                        Total: ${cart.total ? cart.total.toFixed(2) : '0.00'}
                    </div>
                    <button 
                        onClick={handleCheckout}
                        className="btn-primary w-full mt-4 bg-green-600 hover:bg-green-700"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Checkout Cart'}
                    </button>
                </>
            ) : (
                <p className="text-gray-500">Your cart is empty.</p>
            )}
        </div>
    );
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/customer/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) return <p className="p-4">Loading orders...</p>;
    
    return (
        <div className="mt-8 card">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-600">
                <FaListAlt className="mr-2" /> Order History
            </h2>
            {orders.length === 0 ? (
                <p>You have no previous orders.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="border p-4 rounded-lg bg-gray-50">
                            <div className="flex justify-between font-semibold mb-2">
                                <span>Order #{order.id}</span>
                                <span className={`p-1 text-xs rounded ${order.status === 'Delivered' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Total: ${order.totalAmount}</p>
                            <p className="text-xs text-gray-500">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <h4 className="font-medium mt-2">Items:</h4>
                            <ul className="list-disc list-inside text-sm">
                                {order.items.map(item => (
                                    <li key={item.id}>
                                        {/* Fallback check for product name if not included in BE model include */}
                                        {item.product?.name || 'Item Detail Missing'} ({item.quantity} units @ ${item.priceAtPurchase})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CustomerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Shop</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Product List (3 columns) */}
                <div className="lg:col-span-3">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Products</h2>
                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length === 0 ? (
                        <p>No products currently in stock that are visible for purchase.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} addToCart={addToCart} />
                            ))}
                        </div>
                    )}
                    
                    {/* Order History Section */}
                    <OrderHistory />
                </div>
                
                {/* Cart Sidebar (1 column) */}
                <div className="lg:col-span-1">
                    <CartDisplay />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;