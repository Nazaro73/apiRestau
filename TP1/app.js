// Configuration de express
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Lecture du fichier .env
require('dotenv').config();

// Lecture du fichier models/index.js afin de lancer la synchronisation de Sequelize
require('./models/index.js');

// Importation des routeurs
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const restaurantRouter = require('./routes/restaurant');
const platRouter = require('./routes/plat');
const orderRouter = require('./routes/order');
const cors = require('cors'); // Importation de cors
const app = express();

app.use(cors()); // Utilisation de cors
app.use(logger('dev'));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/restaurants', restaurantRouter);
app.use('/plats', platRouter);



module.exports = app;
