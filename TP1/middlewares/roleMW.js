const jwt = require('jsonwebtoken');
const User = require('../models/User');

const extractToken = (authHeader) => {
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1]; // Récupère uniquement la partie JWT
    }
    return null;
};

const adminMiddleware = async (req, res, next) => {
    const token = extractToken(req.header('Authorization'));
    if (!token) {
        return res.status(401).json({ message: 'Authentification refusée' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Authentification refusée' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentification refusée' });
    }
};

const restaurateurMiddleware = async (req, res, next) => {
    const token = extractToken(req.header('Authorization'));
    if (!token) {
        return res.status(401).json({ message: 'Authentification refusée' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Authentification refusée' });
        }
        if (user.role !== 'restaurateur') {
            return res.status(403).json({ message: 'Vous n\'êtes pas un restaurateur' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentification refusée' });
    }
};

const userMiddleware = async (req, res, next) => {
    console.log("blabla");
    const token = extractToken(req.header('Authorization'));
    console.log("token:", token);
    if (!token) {
        console.log(token);
        return res.status(401).json({ message: 'Authentification refusée' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        console.log(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Authentification refusée' });
        }
        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Vous n\'êtes pas un utilisateur' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentification refusée' });
    }
};

module.exports = {
    adminMiddleware,
    restaurateurMiddleware,
    userMiddleware
};
