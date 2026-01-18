import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials and verification status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Login to Shoppy</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </form>
            <p className="mt-4 text-center"><Link to="/signup" className="text-indigo-600 hover:underline">Need an account? Sign Up</Link></p>
        </div>
    );
};

export default Login;