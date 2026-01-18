import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaListAlt, FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

const ProductCard = ({ product, addToCart }) => (
    <div className="card h-full flex flex-col justify-between p-4">
        <div>
            <img src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} alt={product.name} className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
            <p className="text-2xl font-bold text-indigo-600 mb-2">${parseFloat(product.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-4 h-12 overflow-hidden">{product.description}</p>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
            <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-500'}`}>
                Stock: {product.stock}
            </span>
            <button 
                onClick={() => addToCart(product.id, 1)} 
                className="btn-primary px-3 py-1 text-sm disabled:opacity-50"
                disabled={product.stock === 0}
            >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    </div>
);

const CartItem = ({ item }) => {
    const { updateCartItemQuantity, loading } = useCart();

    const handleQuantityChange = (delta) => {
        const newQuantity = item.quantity + delta;
        // Use the dedicated update function
        updateCartItemQuantity(item.productId, newQuantity);
    };
    
    const handleRemove = () => {
        // Use the dedicated update function to set to 0
        updateCartItemQuantity(item.productId, 0);
    };
    
    return (
        <li className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex-grow pr-2">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} ea.</p>
            </div>
            <div className="flex items-center space-x-2">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button 
                        onClick={() => handleQuantityChange(-1)} 
                        disabled={loading || item.quantity <= 1}
                        className="p-2 text-indigo-600 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                        aria-label="Decrease quantity"
                    >
                        <FaMinus size={10} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                        onClick={() => handleQuantityChange(1)} 
                        disabled={loading}
                        className="p-2 text-indigo-600 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                        aria-label="Increase quantity"
                    >
                        <FaPlus size={10} />
                    </button>
                </div>
                <button 
                    onClick={handleRemove} 
                    disabled={loading}
                    className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50 transition"
                    aria-label="Remove item from cart"
                >
                    <FaTrashAlt size={14} />
                </button>
            </div>
        </li>
    );
}


const CartDisplay = () => {
    const { cart, loading, checkout } = useCart();

    const handleCheckout = async () => {
        await checkout();
    };

    return (
        <div className="card sticky top-24 h-fit"> {/* Sticky for better UX */}
            <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-700">
                <FaShoppingCart className="mr-3 text-indigo-500" /> Your Cart
            </h2>
            {loading && cart.items.length === 0 ? (
                <p className="text-gray-500">Loading cart...</p>
            ) : cart.items && cart.items.length > 0 ? (
                <>
                    <ul className="space-y-1 mb-4 max-h-80 overflow-y-auto pr-2">
                        {cart.items.map((item, index) => (
                            <CartItem key={index} item={item} />
                        ))}
                    </ul>
                    <div className="text-xl font-extrabold pt-4 border-t border-gray-200 mt-4 flex justify-between">
                        <span>Subtotal:</span>
                        <span>${cart.total ? cart.total.toFixed(2) : '0.00'}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        className="btn-primary w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        disabled={loading || cart.items.length === 0}
                    >
                        {loading ? 'Processing Order...' : 'Proceed to Checkout'}
                    </button>
                </>
            ) : (
                <p className="text-gray-500 pt-2">Your cart is empty. Start shopping!</p>
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

    return (
        <div className="mt-12 card">
            <h2 className="text-2xl font-bold mb-5 flex items-center text-indigo-700">
                <FaListAlt className="mr-3 text-indigo-500" /> Order History
            </h2>
            {loading ? (
                <p className="p-4">Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-gray-500">You have no previous orders.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
                            <div className="flex justify-between font-semibold mb-2">
                                <span>Order <span className="text-indigo-600 font-extrabold">#{order.id}</span></span>
                                <span className={`p-1 text-xs rounded-full font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Total: <span className="font-medium">${parseFloat(order.totalAmount).toFixed(2)}</span></p>
                            <p className="text-xs text-gray-500">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <h4 className="font-medium mt-3 text-gray-700 border-t pt-2">Items Ordered:</h4>
                            <ul className="space-y-1 text-sm mt-1">
                                {order.items.map(item => (
                                    <li key={item.id} className="flex justify-between text-gray-600">
                                        <span>{item.product?.name || 'Item Detail Missing'}</span>
                                        <span className="font-mono">{item.quantity} units @ ${parseFloat(item.priceAtPurchase).toFixed(2)}</span>
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
        <div className="py-2">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Shop Now</h1>
            
            {/* Responsive Grid: 3 columns for products, 1 for cart on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Cart Sidebar (1 column on LG) - Order first on mobile */}
                <div className="lg:col-span-1 order-first lg:order-last"> 
                    <CartDisplay />
                </div>
                
                {/* Product List & History (3 columns on LG) */}
                <div className="lg:col-span-3">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Available Products</h2>
                    {loading ? (
                        <p className="text-xl text-indigo-600">Loading products...</p>
                    ) : products.length === 0 ? (
                        <p className="text-gray-500 p-4 card">No products currently in stock that are visible for purchase.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} addToCart={addToCart} />
                            ))}
                        </div>
                    )}
                    
                    <OrderHistory />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;