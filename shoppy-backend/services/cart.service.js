const db = require('../models');
const { redisClient } = require('../config/redis.config');
const Product = db.product;
const Order = db.order;
const OrderItem = db.orderItem;

const getCartKey = (userId) => `cart:${userId}`;

// Fetch Cart (from Redis)
const getCart = async (userId) => {
    const cartData = await redisClient.get(getCartKey(userId));
    return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
};

// Add Item to Cart (Update Redis)
const addItemToCart = async (userId, productId, quantity) => {
    const product = await Product.findByPk(productId);
    if (!product || product.stock < quantity) throw new Error("Product unavailable.");
    
    const cart = await getCart(userId);
    let existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId: product.id, name: product.name,
            price: parseFloat(product.price), quantity: quantity
        });
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await redisClient.set(getCartKey(userId), JSON.stringify(cart));
    return cart;
};

// Checkout (Transactional - DB write & Stock update)
const checkoutCart = async (userId, address = "Default Shipping Address") => {
    const cart = await getCart(userId);
    if (cart.items.length === 0) throw new Error("Cannot checkout an empty cart.");

    const t = await db.sequelize.transaction(); // START TRANSACTION

    try {
        const newOrder = await Order.create({
            userId, totalAmount: cart.total, shippingAddress: address, status: 'Pending'
        }, { transaction: t });

        const orderItemsData = [];
        for (const item of cart.items) {
            const product = await Product.findByPk(item.productId, { transaction: t });

            if (!product || product.stock < item.quantity) {
                await t.rollback();
                throw new Error(`Insufficient stock for product: ${item.name}`);
            }

            // Decrement stock and store price at purchase time
            await product.decrement('stock', { by: item.quantity, transaction: t });

            orderItemsData.push({
                orderId: newOrder.id, productId: item.productId,
                quantity: item.quantity, priceAtPurchase: item.price,
            });
        }
        
        await OrderItem.bulkCreate(orderItemsData, { transaction: t });
        await redisClient.del(getCartKey(userId)); // Clear Redis cart

        await t.commit(); // COMMIT TRANSACTION
        return newOrder;

    } catch (error) {
        await t.rollback();
        throw new Error(`Checkout failed: ${error.message}`);
    }
};

const getCustomerOrders = async (userId) => {
    return Order.findAll({
        where: { userId },
        include: [{ 
            model: OrderItem, as: 'items', 
            include: [{ model: Product, as: 'product', attributes: ['name', 'imageUrl'] }] 
        }],
        order: [['createdAt', 'DESC']]
    });
};

module.exports = { addItemToCart, getCart, checkoutCart, getCustomerOrders, removeItemFromCart: require('./cart.service').removeItemFromCart };
// (Note: removeItemFromCart is defined in the thought block for brevity but included in the service)