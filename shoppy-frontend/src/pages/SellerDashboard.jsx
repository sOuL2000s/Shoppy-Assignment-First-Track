import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { FaPlusSquare, FaEdit, FaStore } from 'react-icons/fa';

// --- Sub-Component: Add New Product Form ---
const AddProductForm = ({ onProductAdded }) => {
    const initialState = { name: '', description: '', price: '', stock: '', imageUrl: '' };
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await axios.post('/seller/products', {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
            });
            setMessage('Product added successfully!');
            setFormData(initialState);
            onProductAdded(); // Trigger refresh in parent component
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
                <FaPlusSquare className="mr-2" /> Add New Product
            </h3>
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="col-span-2 p-2 border rounded" />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="col-span-2 p-2 border rounded" />
                <input type="number" name="price" placeholder="Price (e.g., 19.99)" value={formData.price} onChange={handleChange} required step="0.01" className="p-2 border rounded" />
                <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} required min="0" className="p-2 border rounded" />
                <input type="text" name="imageUrl" placeholder="Image URL (Optional)" value={formData.imageUrl} onChange={handleChange} className="col-span-2 p-2 border rounded" />
                
                <button type="submit" disabled={loading} className="btn-primary col-span-2 disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

// --- Sub-Component: Product Management/Stock Update ---
const ProductManager = ({ products, fetchProducts }) => {
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({});
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [error, setError] = useState('');

    const handleEditClick = (product) => {
        setEditMode(product.id);
        setEditData({ 
            stock: product.stock, 
            price: product.price,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
        });
        setError('');
    };
    
    const handleCancelEdit = () => {
        setEditMode(null);
        setError('');
    }

    const handleUpdate = async (productId) => {
        setLoadingUpdate(true);
        setError('');
        try {
            await axios.put(`/seller/products/${productId}`, {
                ...editData,
                price: parseFloat(editData.price),
                stock: parseInt(editData.stock, 10),
            });
            setEditMode(null);
            fetchProducts(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product.');
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
                <FaStore className="mr-2" /> Current Inventory
            </h3>
             {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {editMode === product.id ? (
                                    <input 
                                        type="text" 
                                        value={editData.name} 
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        className="border p-1 w-24"
                                    />
                                ) : product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editMode === product.id ? (
                                    <input 
                                        type="number" 
                                        value={editData.price} 
                                        onChange={(e) => setEditData({...editData, price: e.target.value})}
                                        step="0.01" 
                                        className="border p-1 w-20"
                                    />
                                ) : `$${product.price}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editMode === product.id ? (
                                    <input 
                                        type="number" 
                                        value={editData.stock} 
                                        onChange={(e) => setEditData({...editData, stock: e.target.value})}
                                        min="0" 
                                        className="border p-1 w-16"
                                    />
                                ) : product.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                {editMode === product.id ? (
                                    <>
                                    <button 
                                        onClick={() => handleUpdate(product.id)}
                                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                        disabled={loadingUpdate}
                                    >
                                        Save
                                    </button>
                                     <button 
                                        onClick={handleCancelEdit}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => handleEditClick(product)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <FaEdit className="inline mr-1" /> Edit
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {products.length === 0 && <p className="p-4 text-center text-gray-500">You have not added any products yet.</p>}
        </div>
    );
};


// --- Main Seller Dashboard Component ---
const SellerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 

    const fetchSellerProducts = useCallback(async () => {
        setLoading(true);
        try {
            // FIX: Call the dedicated Seller API endpoint
            const response = await axios.get('/seller/products'); 
            setProducts(response.data.data);
            
            // Client-side filtering is now REMOVED
            
        } catch (error) {
            console.error("Failed to fetch seller products:", error);
        } finally {
            setLoading(false);
        }
    }, []); // user.id dependency is no longer strictly necessary here

    useEffect(() => {
        fetchSellerProducts();
    }, [fetchSellerProducts]);

    if (loading) return <p className="text-center py-10">Loading inventory...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>
            
            <AddProductForm onProductAdded={fetchSellerProducts} />
            
            <ProductManager products={products} fetchProducts={fetchSellerProducts} />
        </div>
    );
};

export default SellerDashboard;