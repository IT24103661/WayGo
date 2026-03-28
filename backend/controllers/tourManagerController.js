const Tour = require('../models/Tour');
const User = require('../models/User');
const Booking = require('../models/Booking');
const TourPackage = require('../models/TourPackage');
const CustomQuote = require('../models/CustomQuote');

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

// DELETE TOUR
exports.deleteTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    if (tour.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this tour' });
    }

    await tour.deleteOne();

    res.json({
      success: true,
      message: 'Tour deleted successfully'
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

    const bookings = await Booking.find({ tourPackage: { $in: tourIds } })
      .populate('tourist', 'name email phone')
      .populate('tourPackage', 'title destination');

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
      tourPackage: { $in: tourIds },
      status: 'Completed'
    });

    const totalEarnings = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
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

    const totalBookings = await Booking.countDocuments({ tourPackage: { $in: tourIds } });
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

// GET TOUR PACKAGES
exports.getTourPackages = async (req, res) => {
  try {
    const packages = await TourPackage.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET CUSTOM QUOTES
exports.getCustomQuotes = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }

    const quotes = await CustomQuote.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: quotes.length,
      data: quotes
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE TOUR PACKAGE
exports.createTourPackage = async (req, res) => {
  try {
    const { title, description, flatPrice, durationDays, itineraryStops, vehicleType } = req.body;

    if (!title || !description || !flatPrice || !durationDays || !vehicleType) {
      return res.status(400).json({ message: 'Title, description, flat price, duration, and vehicle type are required.' });
    }

    const tourPackage = await TourPackage.create({
      title,
      description,
      flatPrice,
      durationDays,
      itineraryStops: itineraryStops || [],
      vehicleType
    });

    return res.status(201).json({
      success: true,
      message: 'Tour package created successfully.',
      data: tourPackage
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE TOUR PACKAGE
exports.updateTourPackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const updateData = req.body;
    
    const tourPackage = await TourPackage.findByIdAndUpdate(
      packageId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!tourPackage) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    res.json({
      success: true,
      message: 'Tour package updated successfully',
      data: tourPackage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE TOUR PACKAGE
exports.deleteTourPackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    
    const tourPackage = await TourPackage.findByIdAndDelete(packageId);

    if (!tourPackage) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    res.json({
      success: true,
      message: 'Tour package deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REVIEW CUSTOM QUOTE
exports.reviewCustomQuote = async (req, res) => {
  try {
    const { quoteId } = req.params;
    const { quotedPrice, status } = req.body;

    const quote = await CustomQuote.findById(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Custom quote not found.' });
    }

    if (quotedPrice !== undefined) {
      quote.quotedPrice = quotedPrice;
    }

    if (status) {
      quote.status = status;
    } else if (quotedPrice !== undefined) {
      quote.status = 'Quoted';
    }

    await quote.save();

    return res.json({
      success: true,
      message: 'Custom quote updated successfully.',
      data: quote
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ASSIGN CERTIFIED DRIVER TO TOUR BOOKING
exports.assignTourDriver = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.bookingType !== 'Tour') {
      return res.status(400).json({ message: 'Only tour bookings can have a tour manager assignment.' });
    }

    const driver = await User.findOne({
      _id: driverId,
      role: 'Driver',
      isTourCertified: true
    });

    if (!driver) {
      return res.status(404).json({ message: 'Certified driver not found.' });
    }

    booking.assignedDriver = driver._id;
    booking.status = 'Accepted';
    await booking.save();

    return res.json({
      success: true,
      message: 'Driver assigned to tour booking.',
      data: booking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
