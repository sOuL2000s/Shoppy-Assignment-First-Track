const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

// MODIFIED: This now handles the final registration attempt (checks OTP, saves to DB)
exports.signup = async (req, res, next) => {
    try {
        // The service now expects 'otp' in req.body along with email, password, role
        const user = await authService.registerUser(req.body); 
        successResponse(res, { email: user.email, role: user.role, message: "Registration successful. You can now log in." }, 'User registered and verified.', 201);
    } catch (error) {
        next(error);
    }
};

// NEW FUNCTION: Handles sending the OTP
exports.sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return errorResponse(res, 'Email is required to send OTP.', 400);
        }
        const result = await authService.sendSignupOtp(email);
        successResponse(res, null, result.message, 200);
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