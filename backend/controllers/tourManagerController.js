const Tour = require('../models/Tour');
const User = require('../models/User');
const Booking = require('../models/Booking');

// GET ALL TOURS FOR THIS MANAGER
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find({ createdBy: req.user.userId });
    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE NEW TOUR
exports.createTour = async (req, res) => {
  try {
    const {
      title,
      description,
      destination,
      durationDays,
      price,
      maxGroupSize,
      itinerary,
      includes,
      excludes
    } = req.body;

    if (!title || !description || !destination || !durationDays || !price) {
      return res.status(400).json({ message: 'Title, description, destination, duration, and price are required.' });
    }

    const tour = await Tour.create({
      title,
      description,
      destination,
      durationDays,
      price,
      maxGroupSize: maxGroupSize || 10,
      itinerary: itinerary || [],
      includes: includes || [],
      excludes: excludes || [],
      createdBy: req.user.userId,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE TOUR
exports.updateTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    if (tour.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to update this tour' });
    }

    const {
      title,
      description,
      destination,
      durationDays,
      price,
      maxGroupSize,
      itinerary,
      includes,
      excludes,
      isActive
    } = req.body;

    if (title) tour.title = title;
    if (description) tour.description = description;
    if (destination) tour.destination = destination;
    if (durationDays) tour.durationDays = durationDays;
    if (price) tour.price = price;
    if (maxGroupSize) tour.maxGroupSize = maxGroupSize;
    if (itinerary) tour.itinerary = itinerary;
    if (includes) tour.includes = includes;
    if (excludes) tour.excludes = excludes;
    if (typeof isActive === 'boolean') tour.isActive = isActive;

    await tour.save();

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BOOKINGS FOR TOURS
exports.getBookings = async (req, res) => {
  try {
    const tours = await Tour.find({ createdBy: req.user.userId }).select('_id');
    const tourIds = tours.map(t => t._id);

    const bookings = await Booking.find({ tourId: { $in: tourIds } })
      .populate('touristId', 'name email phone')
      .populate('tourId', 'title destination');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET EARNINGS REPORT
exports.getEarnings = async (req, res) => {
  try {
    const tours = await Tour.find({ createdBy: req.user.userId }).select('_id price');
    const tourIds = tours.map(t => t._id);

    const bookings = await Booking.find({
      tourId: { $in: tourIds },
      status: 'Completed'
    });

    const totalEarnings = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const totalBookings = bookings.length;

    res.json({
      success: true,
      data: {
        totalEarnings,
        totalBookings,
        completedBookings: bookings.length,
        averageEarningsPerBooking: totalBookings > 0 ? totalEarnings / totalBookings : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const tours = await Tour.find({ createdBy: req.user.userId });
    const tourIds = tours.map(t => t._id);

    const totalBookings = await Booking.countDocuments({ tourId: { $in: tourIds } });
    const activeTours = tours.filter(t => t.isActive).length;
    const totalReviews = tours.reduce((sum, t) => sum + t.totalReviews, 0);
    const avgRating = tours.length > 0
      ? (tours.reduce((sum, t) => sum + t.rating, 0) / tours.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        totalTours: tours.length,
        activeTours,
        totalBookings,
        avgRating,
        totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
