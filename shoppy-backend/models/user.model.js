module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: Sequelize.STRING, unique: true, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false },
        role: {
            type: Sequelize.ENUM('customer', 'seller'),
            allowNull: false,
            defaultValue: 'customer'
        },
        isVerified: { type: Sequelize.BOOLEAN, defaultValue: false }
    });
    return User;
};