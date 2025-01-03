const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Plat = sequelize.define('Plat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false, // Assurez que le nom ne soit pas vide
        validate: {
            notEmpty: {
                msg: "Le nom du plat ne peut pas être vide",
            },
        },
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: {
                msg: "Le prix doit être un nombre valide",
            },
            min: {
                args: 0.01,
                msg: "Le prix doit être supérieur à 0",
            },
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true, // La description peut être vide
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true, // L'image peut être vide
        validate: {
            isUrl: {
                msg: "L'image doit être une URL valide",
            },
        },
    },
});

module.exports = Plat;
