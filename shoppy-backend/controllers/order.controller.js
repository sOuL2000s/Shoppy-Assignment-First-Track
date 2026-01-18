const cartService = require('../services/cart.service');
const { successResponse } = require('../utils/response');

exports.getCustomerOrders = async (req, res, next) => {
    try {
        const orders = await cartService.getCustomerOrders(req.userId);
        successResponse(res, orders, 'Previous orders retrieved.');
    } catch (error) {
        next(error);
    }
};