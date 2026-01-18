import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'customer' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/auth/signup', formData);
            // Pass email to verification page for immediate use
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Account Type</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50">
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <p className="mt-4 text-center"><Link to="/login" className="text-indigo-600 hover:underline">Already have an account?</Link></p>
        </div>
    );
};

export default Signup;