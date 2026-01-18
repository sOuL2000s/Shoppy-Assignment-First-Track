import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axiosInstance';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromSignup = location.state?.email;

    const [email, setEmail] = useState(emailFromSignup || '');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('/auth/verify-otp', { email, otp });
            setSuccess(response.data.message || 'Verification successful! Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed. Check your OTP or email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-600">Verify Account</h2>
            <p className="text-center text-gray-500 mb-6">
                An OTP has been sent to your email address. Please enter it below.
            </p>

            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Email (must match signup email)</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full p-2 border rounded" 
                        readOnly={!!emailFromSignup}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">OTP Code</label>
                    <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                        maxLength="6"
                        className="w-full p-2 border text-center text-xl font-mono tracking-widest rounded"
                    />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>
        </div>
    );
};

export default OtpVerification;