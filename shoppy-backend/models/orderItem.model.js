module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        orderId: {
            type: Sequelize.INTEGER,
            references: { model: 'Orders', key: 'id' },
            allowNull: false
        },
        productId: {
            type: Sequelize.INTEGER,
            references: { model: 'Products', key: 'id' },
            allowNull: false
        },
        quantity: { type: Sequelize.INTEGER, allowNull: false },
        priceAtPurchase: { type: Sequelize.DECIMAL(10, 2), allowNull: false }
    });
    return OrderItem;
};