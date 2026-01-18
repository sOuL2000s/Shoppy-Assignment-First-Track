import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { FaPlusSquare, FaEdit, FaStore, FaSave, FaTimes } from 'react-icons/fa';

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
        <div className="card mb-8 shadow-lg border-indigo-100">
            <h3 className="text-2xl font-bold mb-5 flex items-center text-indigo-700">
                <FaPlusSquare className="mr-3 text-indigo-500" /> Stock New Product
            </h3>
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Product Name (Required)" value={formData.name} onChange={handleChange} required className="md:col-span-2 p-3 border rounded-lg" />
                <textarea name="description" placeholder="Description (Optional)" value={formData.description} onChange={handleChange} rows="2" className="md:col-span-2 p-3 border rounded-lg" />
                <input type="number" name="price" placeholder="Price (e.g., 19.99)" value={formData.price} onChange={handleChange} required step="0.01" min="0.01" className="p-3 border rounded-lg" />
                <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} required min="0" className="p-3 border rounded-lg" />
                <input type="text" name="imageUrl" placeholder="Image URL (Optional)" value={formData.imageUrl} onChange={handleChange} className="md:col-span-2 p-3 border rounded-lg" />
                
                <button type="submit" disabled={loading} className="btn-primary md:col-span-2 disabled:opacity-50">
                    {loading ? 'Adding Product...' : 'Add Product to Inventory'}
                </button>
            </form>
        </div>
    );
};

// --- Sub-Component: Product Management/Stock Update (Inline Edit UX) ---
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
            description: product.description || '',
            imageUrl: product.imageUrl || '',
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
        <div className="card overflow-x-auto">
            <h3 className="text-2xl font-bold mb-5 flex items-center text-indigo-700">
                <FaStore className="mr-3 text-indigo-500" /> Current Inventory
            </h3>
             {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Desc</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className={`${editMode === product.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}>
                            {/* Product Name & Description Field */}
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                                {editMode === product.id ? (
                                    <>
                                        <input 
                                            type="text" 
                                            value={editData.name} 
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            className="border p-1 w-full text-base font-semibold mb-1"
                                            aria-label={`Name for ${product.name}`}
                                        />
                                        <textarea 
                                            value={editData.description} 
                                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                                            rows="2"
                                            className="border p-1 w-full text-sm text-gray-600"
                                            aria-label={`Description for ${product.name}`}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{product.description || 'No description'}</p>
                                    </>
                                )}
                            </td>
                            {/* Price Field */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editMode === product.id ? (
                                    <input 
                                        type="number" 
                                        value={editData.price} 
                                        onChange={(e) => setEditData({...editData, price: e.target.value})}
                                        step="0.01" 
                                        min="0.01"
                                        className="border p-1 w-24"
                                        aria-label={`Price for ${product.name}`}
                                    />
                                ) : <span className="font-mono text-gray-800">${parseFloat(product.price).toFixed(2)}</span>}
                            </td>
                            {/* Stock Field */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editMode === product.id ? (
                                    <input 
                                        type="number" 
                                        value={editData.stock} 
                                        onChange={(e) => setEditData({...editData, stock: e.target.value})}
                                        min="0" 
                                        className="border p-1 w-16"
                                        aria-label={`Stock for ${product.name}`}
                                    />
                                ) : (
                                    <span className={`font-bold ${product.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                        {product.stock}
                                    </span>
                                )}
                            </td>
                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                {editMode === product.id ? (
                                    <>
                                    <button 
                                        onClick={() => handleUpdate(product.id)}
                                        className="text-green-600 hover:text-green-800 disabled:opacity-50 transition"
                                        disabled={loadingUpdate}
                                        title="Save Changes"
                                    >
                                        <FaSave className="inline text-lg" />
                                    </button>
                                     <button 
                                        onClick={handleCancelEdit}
                                        className="text-gray-500 hover:text-gray-700 transition"
                                        disabled={loadingUpdate}
                                        title="Cancel Edit"
                                    >
                                        <FaTimes className="inline text-lg" />
                                    </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => handleEditClick(product)}
                                        className="text-indigo-600 hover:text-indigo-900 transition"
                                        title="Edit Product"
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

    const fetchSellerProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/seller/products'); 
            setProducts(response.data.data);
            
        } catch (error) {
            console.error("Failed to fetch seller products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchSellerProducts();
    }, [fetchSellerProducts]);

    if (loading) return <p className="text-center py-10 text-xl text-indigo-600">Loading inventory...</p>;

    return (
        <div className="py-2">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Inventory Management</h1>
            
            <AddProductForm onProductAdded={fetchSellerProducts} />
            
            <ProductManager products={products} fetchProducts={fetchSellerProducts} />
        </div>
    );
};

export default SellerDashboard;