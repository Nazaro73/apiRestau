const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

// Définir la table pivot OrderPlats
const OrderPlats = sequelize.define('OrderPlats', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Exemple : Quantité de chaque plat dans la commande
    },
});

module.exports = OrderPlats;
