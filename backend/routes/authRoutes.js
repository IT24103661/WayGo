const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Bring in the Bouncer!
const { protect } = require('../middleware/authMiddleware');

// Public doorways (Anyone can access these)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private doorway (Only people with a valid token can pass)
router.get('/profile', protect, (req, res) => {
    // If the bouncer lets them through, they will see this message:
    res.json({
        message: 'Welcome to the VIP area!',
        user: req.user // This shows the ID and Role the bouncer extracted from the token
    });
});

module.exports = router;