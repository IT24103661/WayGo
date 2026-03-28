const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, deleteProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Protected routes (valid JWT required)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

module.exports = router;
