// shoppy-frontend\src\pages\Signup.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { FaPaperPlane } from 'react-icons/fa';

const Signup = () => {
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        otp: '', 
        role: 'customer' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // For final submission
    const [otpSent, setOtpSent] = useState(false); 
    const [otpLoading, setOtpLoading] = useState(false); // For "Send OTP" button
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSendOtp = async () => {
        if (!formData.email) {
            setError('Please enter a valid email address first.');
            return;
        }
        setOtpLoading(true);
        setError(''); 
        try {
            const response = await axios.post('/auth/send-otp', { email: formData.email });
            setOtpSent(true);
            // Using the error slot to display the success message after sending OTP
            setError(response.data.message || 'OTP sent! Check your email.'); 
        } catch (err) {
            // Error from server (e.g., user already exists, or server misconfig)
            setError(err.response?.data?.message || 'Failed to send OTP. Please check your email and try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (!otpSent) {
            setError('Please send and enter the OTP first.');
            setLoading(false);
            return;
        }
        
        try {
            // Final submission uses the /auth/signup endpoint which now includes verification logic
            const response = await axios.post('/auth/signup', formData); 
            
            alert(response.data.message);
            // Redirect to login after successful registration/verification
            navigate('/login'); 
            
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Check your OTP or input fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Create Account & Verify</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                {/* Email Field with OTP Button */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <div className="flex space-x-2">
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border rounded" 
                            disabled={otpLoading || otpSent}
                        />
                        <button 
                            type="button" 
                            onClick={handleSendOtp} 
                            disabled={otpLoading || otpSent}
                            className={`flex items-center justify-center px-4 py-2 text-white text-sm font-semibold rounded-lg transition duration-200 ease-in-out shadow-md disabled:opacity-50 ${otpSent ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {otpLoading ? 'Sending...' : otpSent ? 'OTP Sent' : <><FaPaperPlane className="mr-1" /> Send OTP</>}
                        </button>
                    </div>
                    {otpSent && <p className="text-xs text-green-600 mt-1">OTP sent. Enter code and complete the form.</p>}
                </div>

                {/* OTP Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">OTP Code (6 digits)</label>
                    <input 
                        type="text" 
                        name="otp"
                        value={formData.otp} 
                        onChange={handleChange} 
                        required 
                        maxLength="6"
                        className="w-full p-2 border text-center text-xl font-mono tracking-widest rounded"
                        disabled={!otpSent}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700">Account Type</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" disabled={loading}>
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                
                <button 
                    type="submit" 
                    // User must have successfully received OTP (otpSent=true) to submit
                    disabled={loading || !otpSent} 
                    className="btn-primary w-full disabled:opacity-50"
                >
                    {loading ? 'Registering...' : 'Complete Registration'}
                </button>
            </form>
            <p className="mt-4 text-center"><Link to="/login" className="text-indigo-600 hover:underline">Already have an account?</Link></p>
        </div>
    );
};

export default Signup;