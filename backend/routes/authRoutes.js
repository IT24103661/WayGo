const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, changePassword, deleteProfile } = require('../controllers/authController');
const {
	getSalaryApprovals,
	updateSalaryApprovalStatus,
	getSalaryCandidates,
	createSalaryApprovals,
	updateSalaryApproval
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Protected routes (valid JWT required)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/password', protect, changePassword);
router.put('/password', protect, changePassword);
router.delete('/profile', protect, deleteProfile);

// Admin salary approval routes
router.get('/admin/salaries/candidates', protect, authorizeRoles('SystemAdmin'), getSalaryCandidates);
router.get('/admin/salaries', protect, authorizeRoles('SystemAdmin'), getSalaryApprovals);
router.post('/admin/salaries', protect, authorizeRoles('SystemAdmin'), createSalaryApprovals);
router.put('/admin/salaries/:salaryId', protect, authorizeRoles('SystemAdmin'), updateSalaryApproval);
router.patch('/admin/salaries/:salaryId/status', protect, authorizeRoles('SystemAdmin'), updateSalaryApprovalStatus);

module.exports = router;
