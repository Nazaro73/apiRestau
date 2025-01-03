
const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Order = sequelize.define('Order', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'en cours',
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    
});

module.exports = Order;