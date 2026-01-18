const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require('./user.model')(sequelize, Sequelize);
db.product = require('./product.model')(sequelize, Sequelize);
db.order = require('./order.model')(sequelize, Sequelize);
db.orderItem = require('./orderItem.model')(sequelize, Sequelize);

// Associations
// 1. User Associations
db.user.hasMany(db.product, { foreignKey: 'sellerId', as: 'products' });
db.user.hasMany(db.order, { foreignKey: 'userId', as: 'orders' });

// 2. Product Associations
db.product.belongsTo(db.user, { foreignKey: 'sellerId', as: 'seller' });
db.product.hasMany(db.orderItem, { foreignKey: 'productId', as: 'orderItems' });

// 3. Order Associations (Customer history)
db.order.belongsTo(db.user, { foreignKey: 'userId', as: 'customer' });
db.order.hasMany(db.orderItem, { foreignKey: 'orderId', as: 'items' });

// 4. OrderItem Associations (Junction table)
db.orderItem.belongsTo(db.order, { foreignKey: 'orderId', as: 'order' });
db.orderItem.belongsTo(db.product, { foreignKey: 'productId', as: 'product' });

module.exports = db;