const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const { adminMiddleware, restaurateurMiddleware, userMiddleware } = require('../middlewares/roleMW');
// crud user

router.get('/', async (req, res) => {   
    const users = await User.findAll();
    res.json(users);
});

router.get('/id/', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
});

// post user avec cryptage bcrypt de mot de passe
const validRoles = ['admin', 'user', 'restaurateur'];

router.post('/', async (req, res) => {
    const user = req.body;

    // Vérifiez si le rôle est valide
    if (!validRoles.includes(user.role)) {
        return res.status(400).json({ message: 'Rôle invalide. Les rôles valides sont: admin, user, restaurateur.' });
    }

    // Hash le mot de passe
    user.password = bcrypt.hashSync(user.password, 10);

    // Créez l'utilisateur
    await User.create(user);
    res.json(user);
});

router.post('/restaurateur', async (req, res) => {
    const { email, password, restaurantName, restaurantAddress, restaurantPhone, restaurantImage } = req.body;

    try {
        // Hash le mot de passe
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Créez l'utilisateur
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: "restaurateur",
        });

        // Créez le restaurant associé
        const newRestaurant = await Restaurant.create({
            nom: restaurantName,
            adresse: restaurantAddress,
            telephone: restaurantPhone,
            image: restaurantImage,
            userId: newUser.id, // Association avec l'utilisateur
        });

        res.json({
            user: newUser,
            restaurant: newRestaurant,
        });
    } catch (error) {
        console.error('Erreur lors de la création du restaurateur et du restaurant:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

router.put('/:id', async (req, res) => {
    await User.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
});

router.delete('/:id', async (req, res) => { 
    await User.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifiez si l'email et le mot de passe sont fournis
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe sont requis' });
        }

        const user = await User.findOne({ where: { email } });

        // Vérifiez si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ message: 'Mots de passe ou email incorrect' });
        }

        // Vérifiez si le mot de passe est correct
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Mots de passe ou email incorrect' });
        }

        // Générer un token JWT
        const expirationDate = new Date('2025-03-25T00:00:00Z').getTime() / 1000; // Convertir en secondes UNIX

const token = jwt.sign({ id: user.id, exp: expirationDate }, process.env.JWT_SECRET);
console.log(expirationDate);
        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

// logout user enlevé le token
router.post('/logout', async (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
   

});


// Get role user avec token
router.get('/me', async (req, res) => {
    
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
       
        // Récupérez l'utilisateur à partir de l'ID décodé
        const user = await User.findByPk(decoded.id);

        // Vérifiez si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        console.log(user.role);
        res.json({ role: user.role });
    } catch (error) {
        console.error('Erreur lors de la récupération du rôle utilisateur:', error);

        // Gérer les erreurs spécifiques de JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide' });
        }

        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});







module.exports = router;