const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { updateStatus, acceptRide } = require('../controllers/driverController');

router.use(protect);
router.use(authorizeRoles('Driver'));

router.patch('/status', updateStatus);
router.patch('/bookings/:bookingId/accept', acceptRide);

module.exports = router;
