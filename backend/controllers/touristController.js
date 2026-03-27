const Booking = require('../models/Booking');
const User = require('../models/User');
const TourPackage = require('../models/TourPackage');
const Review = require('../models/Review');

// ==========================================
// 1. TOURIST PROFILE MANAGEMENT (CRUD)
// ==========================================

// @desc    Get tourist profile (Read)
// @route   GET /api/tourist/profile
// @access  Private (Tourist only)
exports.getProfile = async (req, res) => {
  try {
    const tourist = await User.findById(req.user.userId).select('-password');
    if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update tourist profile (Update)
// @route   PUT /api/tourist/profile
// @access  Private (Tourist only)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const tourist = await User.findById(req.user.userId);

    if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

    tourist.name = name || tourist.name;
    tourist.email = email || tourist.email;
    if (phone) tourist.phone = phone;

    const updatedTourist = await tourist.save();
    
    // Don't return the password
    const result = updatedTourist.toObject();
    delete result.password;
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete tourist account (Delete)
// @route   DELETE /api/tourist/profile
// @access  Private (Tourist only)
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Tourist account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ==========================================
// 2. TOUR BOOKINGS MANAGEMENT (CRUD)
// ==========================================

// @desc    Get all available tours for booking (Read)
// @route   GET /api/tourist/tours
// @access  Public or Private
exports.getAvailableTours = async (req, res) => {
  try {
    const tours = await TourPackage.find({ status: 'active' });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new booking (Create)
// @route   POST /api/tourist/bookings
// @access  Private (Tourist only)
exports.createBooking = async (req, res) => {
  try {
    const { tourId, date, members } = req.body;
    
    // Using mapping that matches your actual Booking.js Schema
    const newBooking = await Booking.create({
      tourist: req.user.userId,
      bookingType: 'Tour', // Explicitly saying it's a tour
      tourPackage: null, // Just skipping linking it securely since tourId is coming in as MOCK ids (1, 2, 3) 
      pickupLocation: 'Mock Location', // required field
      pickupTime: date || new Date(), // required field
      totalPrice: 12500, // required field
      status: 'Pending'
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get tourist's personal bookings (Read)
// @route   GET /api/tourist/bookings
// @access  Private (Tourist only)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.user.userId }).populate('tourPackage');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel a booking (Update/Delete)
// @route   PUT /api/tourist/bookings/:id/cancel
// @access  Private (Tourist only)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.tourist.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a booking (Modify)
// @route   PUT /api/tourist/bookings/:id
// @access  Private (Tourist only)
exports.updateBooking = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, pickupTime } = req.body;
    let booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.tourist.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this booking' });
    }
    
    // Only allow modifing pending bookings usually, but let's just do it
    if (booking.status === 'Cancelled' || booking.status === 'Completed') {
        return res.status(400).json({ message: 'Cannot modify a completed or cancelled booking' });
    }

    if (pickupLocation) booking.pickupLocation = pickupLocation;
    if (dropoffLocation !== undefined) booking.dropoffLocation = dropoffLocation;
    if (pickupTime) booking.pickupTime = pickupTime;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a booking permanently
// @route   DELETE /api/tourist/bookings/:id
// @access  Private (Tourist only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.tourist.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// ==========================================
// REVIEWS MANAGEMENT (CRUD)
// ==========================================

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tourist: req.user.userId }).sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { tourName, rating, text } = req.body;
    const review = await Review.create({
      tourist: req.user.userId,
      tourName: tourName || 'General Tour',
      rating,
      text
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.tourist.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.text) review.text = req.body.text;
    if (req.body.tourName) review.tourName = req.body.tourName;
    
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.tourist.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
