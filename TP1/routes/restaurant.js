const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { adminMiddleware, restaurateurMiddleware, userMiddleware } = require('../middlewares/roleMW');
// crud restaurant

router.get('/', async (req, res) => {  
    try {
        const restaurants = await Restaurant.findAll({
            include: {
                model: User, // Inclure l'utilisateur associé
                as: 'user', // Alias utilisé dans la relation belongsTo
                attributes: ['email'], // Limiter les attributs retournés
            },
        });
        res.json(restaurants);
    } catch (error) {
        console.error('Erreur lors de la récupération des restaurants:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

router.get('/restaurant',restaurateurMiddleware, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Vérifiez si le header Authorization est présent
        if (!authHeader) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const token = authHeader.split(' ')[1];

        // Vérifiez si le token est présent
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        // Vérifiez et décodez le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérez le restaurant associé au userId décodé
        const restaurant = await Restaurant.findOne({
            where: { userId: decoded.id },
            include: {
                model: User,
                as: 'user',
                attributes: ['email'], // Inclure l'email de l'utilisateur associé
            },
        });

        // Vérifiez si le restaurant existe
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé pour cet utilisateur' });
        }

        res.json(restaurant);
    } catch (error) {
        console.error('Erreur lors de la récupération du restaurant:', error);

        // Gérer les erreurs spécifiques de JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide' });
        }

        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

router.get('/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    res.json(restaurant);
});

router.post('/', async (req, res) => {
    const restaurant = await Restaurant.create(req.body);
    res.json(restaurant);
});

router.put('/:id',restaurateurMiddleware, async (req, res) => {
    await Restaurant.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
});

router.delete('/:id',adminMiddleware, async (req, res) => {
    await Restaurant.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});





module.exports = router;