const { errorResponse } = require('../utils/response');

const validateSignup = (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return errorResponse(res, 'Email, password, and role are required fields.', 400);
    }
    if (!['customer', 'seller'].includes(role.toLowerCase())) {
        return errorResponse(res, 'Invalid role specified. Must be customer or seller.', 400);
    }
    if (password.length < 6) {
        return errorResponse(res, 'Password must be at least 6 characters long.', 400);
    }
    next();
};

const validateProduct = (req, res, next) => {
    const { name, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
        return errorResponse(res, 'Product name, price, and stock count are required.', 400);
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return errorResponse(res, 'Price must be a positive number.', 400);
    }
    if (!Number.isInteger(stock) || stock < 0) {
        return errorResponse(res, 'Stock must be a non-negative integer.', 400);
    }
    next();
};

const validateAddToCart = (req, res, next) => {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
        return errorResponse(res, 'Product ID and quantity are required.', 400);
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return errorResponse(res, 'Quantity must be a positive integer.', 400);
    }
    next();
};

module.exports = {
    validateSignup,
    validateProduct,
    validateAddToCart
};