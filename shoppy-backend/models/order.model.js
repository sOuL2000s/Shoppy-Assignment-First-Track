module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        userId: {
            type: Sequelize.INTEGER,
            references: { model: 'Users', key: 'id' },
            allowNull: false
        },
        totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        shippingAddress: { type: Sequelize.STRING },
        status: {
            type: Sequelize.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
            defaultValue: 'Pending'
        }
    });
    return Order;
};