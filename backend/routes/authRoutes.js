const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, deleteProfile } = require('../controllers/authController');
const { getSalaryApprovals, updateSalaryApprovalStatus } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Protected routes (valid JWT required)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

// Admin salary approval routes
router.get('/admin/salaries', protect, authorizeRoles('SystemAdmin'), getSalaryApprovals);
router.patch('/admin/salaries/:salaryId/status', protect, authorizeRoles('SystemAdmin'), updateSalaryApprovalStatus);

module.exports = router;
