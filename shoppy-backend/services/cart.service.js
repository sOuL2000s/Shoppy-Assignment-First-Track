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

// Add Item to Cart (Update Redis - INCREMENTING)
const addItemToCart = async (userId, productId, quantity) => {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error("Product not found.");
    
    const cart = await getCart(userId);
    let existingItem = cart.items.find(item => item.productId === productId);

    let currentCartQuantity = existingItem ? existingItem.quantity : 0;
    let projectedQuantity = currentCartQuantity + quantity;

    if (projectedQuantity > product.stock) {
        throw new Error(`Insufficient stock. Available stock: ${product.stock}. You currently have ${currentCartQuantity} units in your cart.`);
    }

    if (existingItem) {
        // Use the calculated projected quantity
        existingItem.quantity = projectedQuantity;
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

// FIX: Set Item Quantity (SETTING ABSOLUTE quantity, 0 to remove)
const setCartItemQuantity = async (userId, productId, newQuantity) => {
    const cart = await getCart(userId);
    const existingIndex = cart.items.findIndex(item => item.productId === productId);

    if (newQuantity <= 0) {
        // Remove item
        if (existingIndex !== -1) {
            cart.items.splice(existingIndex, 1);
        }
    } else {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error("Product not found.");

        if (newQuantity > product.stock) {
            throw new Error(`Insufficient stock. Available stock: ${product.stock}.`);
        }

        // Use the price from the database at the time of update
        const price = parseFloat(product.price); 
        
        const itemDetails = {
            productId: product.id, name: product.name,
            price: price, quantity: newQuantity
        };

        if (existingIndex !== -1) {
            cart.items[existingIndex] = itemDetails; // Update quantity
        } else {
            cart.items.push(itemDetails); // Add new item
        }
    }

    // Recalculate total
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

// Clean up module exports
module.exports = { 
    addItemToCart, 
    getCart, 
    checkoutCart, 
    getCustomerOrders,
    setCartItemQuantity // <--- EXPORT NEW FUNCTION
};