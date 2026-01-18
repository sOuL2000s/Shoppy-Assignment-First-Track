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

exports.updateCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        // Use the new service function to set the specific quantity
        const cart = await cartService.setCartItemQuantity(req.userId, productId, quantity);
        successResponse(res, cart, quantity > 0 ? 'Cart quantity updated.' : 'Item removed from cart.');
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
