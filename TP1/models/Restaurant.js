const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Restaurant = sequelize.define('Restaurant', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING
    },
    adresse : {
        type: DataTypes.STRING
    },
    telephone : {
        type: DataTypes.STRING
    },
    image : {
        type: DataTypes.STRING
    }
    
});

module.exports = Restaurant;
