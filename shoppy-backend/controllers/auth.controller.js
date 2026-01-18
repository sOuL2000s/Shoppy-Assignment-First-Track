const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

exports.signup = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        successResponse(res, { email: user.email, role: user.role, message: "Registration successful. Check email for OTP." }, 'User registered.', 201);
    } catch (error) {
        next(error);
    }
};

exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOtp(email, otp);
        successResponse(res, result, 'OTP verified successfully.');
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await authService.loginUser(email, password);
        successResponse(res, data, 'Login successful.');
    } catch (error) {
        next(error);
    }
};