const cartService = require('../services/cart.service');
const { successResponse, errorResponse } = require('../utils/response');

exports.getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.userId);
        successResponse(res, cart, 'Cart retrieved successfully.');
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartService.addItemToCart(req.userId, productId, quantity);
        successResponse(res, cart, 'Item added to cart.');
    } catch (error) {
        next(error);
    }
};

exports.checkout = async (req, res, next) => {
    try {
        const order = await cartService.checkoutCart(req.userId, req.body.shippingAddress);
        successResponse(res, order, 'Checkout successful! Order placed.', 201);
    } catch (error) {
        next(error);
    }
};