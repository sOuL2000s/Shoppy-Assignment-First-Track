module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Product', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.TEXT },
        price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        imageUrl: { type: Sequelize.STRING },
        sellerId: {
            type: Sequelize.INTEGER,
            references: { model: 'Users', key: 'id' },
            allowNull: false
        }
    });
    return Product;
};