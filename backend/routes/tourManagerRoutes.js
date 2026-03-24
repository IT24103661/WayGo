const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTours,
  createTour,
  updateTour,
  getBookings,
  getEarnings,
  getDashboardStats
} = require('../controllers/tourManagerController');

// All routes require authentication
router.use(protect);

// Tours
router.get('/tours', getTours);
router.post('/tours', createTour);
router.put('/tours/:tourId', updateTour);

// Bookings
router.get('/bookings', getBookings);

// Revenue & Stats
router.get('/earnings', getEarnings);
router.get('/stats', getDashboardStats);

module.exports = router;
