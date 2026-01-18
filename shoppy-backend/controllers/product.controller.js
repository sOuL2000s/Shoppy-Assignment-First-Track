// shoppy-backend/controllers/product.controller.js

const db = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const Product = db.product;

exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, imageUrl } = req.body;
        const product = await Product.create({
            name, description, price, stock, imageUrl, sellerId: req.userId
        });
        successResponse(res, product, 'Product added to stock successfully.', 201);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        // Only return products where stock > 0
        const products = await Product.findAll({
            where: { stock: { [db.Sequelize.Op.gt]: 0 } },
            attributes: ['id', 'name', 'price', 'description', 'stock', 'imageUrl', 'sellerId']
        });
        successResponse(res, products, 'Products retrieved.');
    } catch (error) {
        next(error);
    }
};

// FIX/NEW: New Controller Function: Get products for a specific seller
exports.getSellerProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            where: { sellerId: req.userId }, // Crucial server-side filtering
            attributes: ['id', 'name', 'price', 'description', 'stock', 'imageUrl', 'sellerId'],
            order: [['createdAt', 'DESC']]
        });
        successResponse(res, products, 'Seller products retrieved.');
    } catch (error) {
        next(error);
    }
};

exports.updateStock = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const { stock, price, name, description, imageUrl } = req.body;

        const [updated] = await Product.update({
            stock, price, name, description, imageUrl
        }, {
            where: { id: productId, sellerId: req.userId }
        });

        if (updated === 0) {
            return errorResponse(res, 'Product not found or unauthorized to update.', 404);
        }

        const product = await Product.findByPk(productId);
        successResponse(res, product, 'Product updated successfully.');
    } catch (error) {
        next(error);
    }
};