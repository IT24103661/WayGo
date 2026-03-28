const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { updateStatus, acceptRide, getAvailableJobs, getMyJobs, updateJobStatus } = require('../controllers/driverController');

router.use(protect);
router.use(authorizeRoles('Driver'));

// Driver Profile / Status
router.patch('/status', updateStatus);

// Jobs / Bookings CRUD
router.get('/jobs/available', getAvailableJobs);
router.get('/jobs/mine', getMyJobs);
router.patch('/bookings/:bookingId/accept', acceptRide);
router.patch('/bookings/:bookingId/status', updateJobStatus);

module.exports = router;
