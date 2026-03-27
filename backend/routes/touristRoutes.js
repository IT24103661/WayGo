const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteProfile,
  getAvailableTours,
  createBooking,
  getMyBookings,
  cancelBooking,
  updateBooking,
  deleteBooking,
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/touristController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// All routes require user to be logged in and typically have 'tourist' role
// For now, protecting all routes. Add restrictTo('tourist') if needed.

router.use(protect);
// Optionally: router.use(restrictTo('tourist')); 

// 1. Profile Routes
router.route('/profile')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

// 2. Tours & Bookings Routes
router.route('/tours')
  .get(getAvailableTours);

router.route('/bookings')
  .get(getMyBookings)
  .post(createBooking);

router.route('/bookings/:id')
  .put(updateBooking)
  .delete(deleteBooking);

router.route('/bookings/:id/cancel')
  .put(cancelBooking);

// 3. Reviews Routes
router.route('/reviews')
  .get(getReviews)
  .post(createReview);

router.route('/reviews/:id')
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;

