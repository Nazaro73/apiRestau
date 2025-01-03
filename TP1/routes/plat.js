const express = require('express');
const router = express.Router();
const Plat = require('../models/Plat');
const Restaurant = require(('../models/Restaurant'))
const { adminMiddleware, restaurateurMiddleware, userMiddleware } = require('../middlewares/roleMW');
router.get('/', async (req, res) => {
    const plats = await Plat.findAll();
    res.json(plats);
});

router.get('/:id', async (req, res) => {
    const plat = await Plat.findByPk(req.params.id);
    res.json(plat);
});

//get des plat d'un restaurant 
router.get('/restaurant/:id', async (req, res) => {
    const plats = await Plat.findAll({where: {restaurant_id: req.params.id}});
    res.json(plats);
});

router.post('/restaurant/',restaurateurMiddleware, async (req, res) => {
    try {
        // Récupérez l'ID du restaurant depuis la query
        const { restaurant_id } = req.query;

        // Vérifiez si l'ID du restaurant est présent
        if (!restaurant_id) {
            return res.status(400).json({ message: "L'ID du restaurant est requis dans la query." });
        }

        // Vérifiez si le restaurant existe
        const restaurant = await Restaurant.findByPk(restaurant_id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé." });
        }

        // Créez le plat en associant l'ID du restaurant
        const plat = await Plat.create({
            ...req.body,
            restaurant_id, // Associez le plat au restaurant
        });

        res.status(201).json(plat);
    } catch (error) {
        console.error("Erreur lors de la création du plat :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});

router.put('/:id',restaurateurMiddleware, async (req, res) => {
    await Plat.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
});

router.delete('/:id',restaurateurMiddleware, async (req, res) => {
    await Plat.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});




module.exports = router;