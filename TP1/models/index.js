const Sequelize = require('sequelize');
const sequelize = require('./_database');

// Import des modèles

const User = require('./User');
const Restaurant = require('./Restaurant');
const Plat = require('./Plat');
const Order = require('./Order');
const OrderPlats = require('./OrderPlats');



// Définition des relation

Restaurant.hasMany(Plat, { as: 'plats' });
Plat.belongsTo(Restaurant, {
    foreignKey: 'restaurant_id',
    as: 'restaurant'
});

User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders',
    onDelete: 'CASCADE',
});
Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
});

Order.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
});

Restaurant.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
});

Order.belongsToMany(Plat, { through: OrderPlats, foreignKey: 'orderId', otherKey: 'platId' });
Plat.belongsToMany(Order, { through: OrderPlats, foreignKey: 'platId', otherKey: 'orderId' });






sequelize.sync({ force: false }).then(() => {
    console.log("Database & tables created!");
});

module.exports = {
    User,
    Restaurant,
    Plat,
    Order,
    OrderPlats,
    sequelize
};
