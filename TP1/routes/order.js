// routes/order.js
const express = require('express');
const router = express.Router();
const { Order, Plat, OrderPlats, User } = require('../models'); // Import des modèles
const Restaurant = require('../models/Restaurant');
const jwt = require('jsonwebtoken'); // Assurez-vous que ce module est inclus
const { adminMiddleware, restaurateurMiddleware, userMiddleware } = require('../middlewares/roleMW');

router.post('/',userMiddleware, async (req, res) => {
    try {
        const { userId, plats } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Grouper les plats par restaurant_id
        const platsWithDetails = await Plat.findAll({
            where: { id: plats },
            include: { model: Restaurant, as: 'restaurant' },
        });

        const platsByRestaurant = platsWithDetails.reduce((acc, plat) => {
            const restaurantId = plat.restaurant_id;

            if (!acc[restaurantId]) {
                acc[restaurantId] = [];
            }
            acc[restaurantId].push(plat);
            return acc;
        }, {});

        const orders = [];

        // Créer une commande pour chaque restaurant
        for (const [restaurantId, plats] of Object.entries(platsByRestaurant)) {
            const total = plats.reduce((sum, plat) => sum + plat.prix, 0);

            // Créer l'ordre
            const order = await Order.create({
                userId,
                restaurantId,
                status: 'en cours',
                total,
            });

            // Associer les plats à l'ordre
            for (const plat of plats) {
                await order.addPlat(plat, { through: { quantity: 1 } });
            }

            orders.push(order);
        }

        res.status(201).json({
            message: 'Commandes créées avec succès.',
            orders,
        });
    } catch (error) {
        console.error("Erreur lors de la création des commandes :", error);
        res.status(500).json({ message: 'Erreur lors de la création des commandes.', error });
    }
});


router.get('/user/orders',userMiddleware, async (req, res) => {
    try {
        // Extraire le token de l'en-tête
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing.' });
        }

        const token = authHeader.split(' ')[1]; // Supposons que le format est "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: 'Token not provided.' });
        }

        // Décoder le token pour obtenir l'ID de l'utilisateur
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Récupérer les commandes avec les plats associés
        const orders = await Order.findAll({
            where: { userId },
            include: {
                model: Plat,
                through: {
                    attributes: ['quantity'], // Inclure la quantité depuis la table pivot
                },
            },
        });

        // Formater les résultats
        const formattedOrders = orders.map(order => ({
            total: order.total,
            plats: order.Plats.map(plat => ({
                id: plat.id,
                name: plat.name,
                price: plat.price,
                description: plat.description,
                quantity: plat.OrderPlats.quantity,
            })),
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes.', error });
    }
});

router.get('/restaurant/:id',restaurateurMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer toutes les commandes pour le restaurant donné
        const orders = await Order.findAll({
            where: { restaurantId: id },
            include: [
                {
                    model: Plat,
                    as: 'Plats',
                    through: { attributes: ['quantity'] }, // Inclure les quantités si besoin
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email'], // Récupérer les infos utilisateur associées
                },
            ],
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Aucune commande trouvée pour ce restaurant.' });
        }

        res.json(orders);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes.', error });
    }
});

router.put('/:orderId',restaurateurMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Vérifier que le statut est fourni
        if (!status) {
            return res.status(400).json({ message: 'Le statut est requis.' });
        }

        // Récupérer la commande existante
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée.' });
        }

        // Mettre à jour le statut
        order.status = status;

        // Sauvegarder la commande
        await order.save();

        res.status(200).json({
            message: 'Statut de la commande mis à jour avec succès.',
            order,
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la commande :", error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.', error });
    }
});
module.exports = router;
