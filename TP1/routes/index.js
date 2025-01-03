const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMW'); // Correct import

router.get('/', authenticate, (req, res) => {
    const userName = req.user.display_name;
    res.json({ message: `Bonjour ${userName} !` });
});

module.exports = router;
