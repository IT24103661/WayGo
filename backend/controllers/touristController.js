const Booking = require('../models/Booking');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const TourPackage = require('../models/TourPackage');
const Tour = require('../models/Tour');
const Review = require('../models/Review');
const FleetNotification = require('../models/FleetNotification');
const TouristNotification = require('../models/TouristNotification');
const { body, validationResult } = require('express-validator');

// ✅ Validation middleware moved to TOP
function validateTouristInput(method) {
  switch (method) {
    case 'updateProfile':
      return [
        body('name').optional().isString().trim().withMessage('Name must be a string.'),
        body('email').optional().isEmail().withMessage('Invalid email address.'),
        body('phone').optional().isMobilePhone().withMessage('Invalid phone number.'),
      ];

    case 'createBooking':
      return [
        body('tourId').optional().isMongoId().withMessage('Invalid tour ID.'),
        body('date').optional().isISO8601().toDate().withMessage('Invalid date format.'),
        body('members').optional().isInt({ min: 1 }).withMessage('Members must be a positive integer.'),
        body('pickupLocation').notEmpty().withMessage('Pickup location is required.').isString().trim(),
        body('dropoffLocation').optional().isString().trim(),
        body('totalPrice').optional().isFloat({ min: 0 }).withMessage('Total price must be a non-negative number.'),
      ];

    case 'createFleetBooking':
      return [
        body('pickupLocation').notEmpty().withMessage('Pickup location is required.').isString().trim(),
        body('dropoffLocation').notEmpty().withMessage('Dropoff location is required.').isString().trim(),
        body('pickupTime').isISO8601().withMessage('Invalid pickup time.'),
        body('totalPrice').isFloat({ min: 0 }).withMessage('Total price must be a valid non-negative number.'),
      ];

    default:
      return [];
  }
}

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const validateDateInFuture = (date) => {
  const now = new Date();
  return date > now;
};

const releaseBookingResources = async (booking) => {
  if (!booking) return;

  if (booking.assignedVehicle) {
    const vehicle = await Vehicle.findById(booking.assignedVehicle);
    if (vehicle) {
      vehicle.assignedDriver = null;
      vehicle.status = 'Available';
      await vehicle.save();
    }
  }

  if (booking.assignedDriver) {
    const driver = await User.findOne({ _id: booking.assignedDriver, role: 'Driver' });
    if (driver) {
      const hasOtherActiveBooking = await Booking.exists({
        _id: { $ne: booking._id },
        assignedDriver: driver._id,
        status: { $in: ['Accepted', 'En Route'] }
      });

      if (!hasOtherActiveBooking) {
        driver.status = 'Online';
        await driver.save();
      }
    }
  }
};

const notifyFleetManagersForBooking = async ({ booking, touristId, message }) => {
  const fleetManagers = await User.find({ role: 'FleetManager' }).select('_id');
  if (fleetManagers.length === 0) return;

  const notifications = fleetManagers.map((manager) => ({
    fleetManager: manager._id,
    booking: booking._id,
    tourist: touristId,
    message,
    type: 'BOOKING_CREATED'
  }));

  await FleetNotification.insertMany(notifications);
};

const sanitizePackageOptions = (packageOptions = {}) => {
  const safeAdults = Number(packageOptions.adults);
  const safeChildren = Number(packageOptions.children);
  const safeNights = Number(packageOptions.nights);
  const safeRoomCount = Number(packageOptions.roomCount);

  return {
    tourTitle: String(packageOptions.tourTitle || '').trim(),
    checkInDate: packageOptions.checkInDate ? new Date(packageOptions.checkInDate) : null,
    checkOutDate: packageOptions.checkOutDate ? new Date(packageOptions.checkOutDate) : null,
    adults: Number.isFinite(safeAdults) && safeAdults > 0 ? safeAdults : 1,
    children: Number.isFinite(safeChildren) && safeChildren >= 0 ? safeChildren : 0,
    nights: Number.isFinite(safeNights) && safeNights > 0 ? safeNights : 1,
    roomType: ['Standard', 'Deluxe', 'Family', 'Suite'].includes(packageOptions.roomType)
      ? packageOptions.roomType
      : 'Standard',
    roomCount: Number.isFinite(safeRoomCount) && safeRoomCount > 0 ? safeRoomCount : 1,
    mealPlan: ['No Meals', 'Breakfast', 'Half Board', 'Full Board'].includes(packageOptions.mealPlan)
      ? packageOptions.mealPlan
      : 'No Meals',
    dietPreference: String(packageOptions.dietPreference || '').trim(),
    extras: {
      airportPickup: Boolean(packageOptions.extras?.airportPickup),
      privateGuide: Boolean(packageOptions.extras?.privateGuide),
      activityAddons: Array.isArray(packageOptions.extras?.activityAddons)
        ? packageOptions.extras.activityAddons.map((item) => String(item || '').trim()).filter(Boolean)
        : []
    },
    pricing: {
      tourBase: Number(packageOptions.pricing?.tourBase) || 0,
      roomCost: Number(packageOptions.pricing?.roomCost) || 0,
      mealCost: Number(packageOptions.pricing?.mealCost) || 0,
      extrasCost: Number(packageOptions.pricing?.extrasCost) || 0,
      finalTotal: Number(packageOptions.pricing?.finalTotal) || 0
    }
  };
};

// Get tourist profile
exports.getProfile = async (req, res) => {
  try {
    const tourist = await User.findById(req.user.userId).select('-password');
    if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update tourist profile
exports.updateProfile = [
  validateTouristInput('updateProfile'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const tourist = await User.findById(req.user.userId);

      if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

      tourist.name = name || tourist.name;
      tourist.email = email || tourist.email;
      if (phone) tourist.phone = phone;

      const updatedTourist = await tourist.save();
      const result = updatedTourist.toObject();
      delete result.password;

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];

// Delete tourist account
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Tourist account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get available tours
exports.getAvailableTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true })
      .select('title description destination durationDays price rating totalReviews images')
      .sort({ createdAt: -1 });

    if (tours.length > 0) return res.json(tours);

    const packages = await TourPackage.find({})
      .select('title description durationDays flatPrice')
      .sort({ createdAt: -1 });

    const mapped = packages.map((pkg) => ({
      _id: pkg._id,
      title: pkg.title,
      description: pkg.description,
      destination: 'Sri Lanka',
      durationDays: pkg.durationDays,
      price: pkg.flatPrice,
      rating: 0,
      totalReviews: 0,
      images: []
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create tour booking
exports.createBooking = [
  validateTouristInput('createBooking'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { tourId, date, members = 1, pickupLocation, dropoffLocation, totalPrice, packageOptions } = req.body;

      let tour = null;
      if (tourId) {
        tour = await Tour.findById(tourId).select('_id price');
      }

      const parsedMembers = Number(members);
      const safeMembers = Number.isFinite(parsedMembers) && parsedMembers > 0 ? parsedMembers : 1;

      const calculatedPrice = tour
        ? Number(tour.price) * safeMembers
        : Number(totalPrice) > 0 ? Number(totalPrice) : 12500;

      const sanitizedOptions = sanitizePackageOptions(packageOptions || {});
      const finalPrice = sanitizedOptions.pricing.finalTotal > 0
        ? sanitizedOptions.pricing.finalTotal
        : calculatedPrice;

      const newBooking = await Booking.create({
        tourist: req.user.userId,
        bookingType: 'Tour',
        tourPackage: tour ? tour._id : null,
        pickupLocation: String(pickupLocation).trim(),
        dropoffLocation: dropoffLocation ? String(dropoffLocation).trim() : null,
        pickupTime: date ? new Date(date) : new Date(),
        totalPrice: finalPrice,
        packageOptions: sanitizedOptions,
        status: 'Pending'
      });

      const tourist = await User.findById(req.user.userId).select('name');
      const fleetManagers = await User.find({ role: 'FleetManager' }).select('_id');

      if (fleetManagers.length > 0) {
        const message = `New booking by ${tourist?.name || 'Tourist'}: ${newBooking.pickupLocation}${newBooking.dropoffLocation ? ` -> ${newBooking.dropoffLocation}` : ''}`;

        const notifications = fleetManagers.map((manager) => ({
          fleetManager: manager._id,
          booking: newBooking._id,
          tourist: req.user.userId,
          message,
          type: 'BOOKING_CREATED'
        }));

        await FleetNotification.insertMany(notifications);
      }

      const populated = await Booking.findById(newBooking._id)
        .populate('tourPackage', 'title destination durationDays price')
        .populate('assignedDriver', 'name email phone')
        .populate('assignedVehicle', 'plateNumber make model');

      res.status(201).json(populated);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];

// Create fleet booking
exports.createFleetBooking = [
  validateTouristInput('createFleetBooking'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { pickupLocation, dropoffLocation, pickupTime, totalPrice } = req.body;

      const parsedPickupTime = new Date(pickupTime);

      if (Number.isNaN(parsedPickupTime.getTime())) {
        return res.status(400).json({ message: "Pickup time must be a valid date." });
      }

      if (!validateDateInFuture(parsedPickupTime)) {
        return res.status(400).json({ message: "Pickup time must be a future date." });
      }

      const newBooking = await Booking.create({
        tourist: req.user.userId,
        bookingType: 'Taxi',
        pickupLocation: String(pickupLocation).trim(),
        dropoffLocation: String(dropoffLocation).trim(),
        pickupTime: parsedPickupTime,
        totalPrice: Number(totalPrice),
        status: 'Pending'
      });

      const tourist = await User.findById(req.user.userId).select('name');

      await notifyFleetManagersForBooking({
        booking: newBooking,
        touristId: req.user.userId,
        message: `New fleet booking by ${tourist?.name || 'Tourist'}: ${newBooking.pickupLocation} -> ${newBooking.dropoffLocation}`
      });

      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];

// Get tourist fleet bookings
exports.getMyFleetBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      tourist: req.user.userId,
      bookingType: 'Taxi'
    })
      .populate('assignedDriver', 'name email phone')
      .populate('assignedVehicle', 'plateNumber make model')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update fleet booking
exports.updateFleetBooking = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, pickupTime, totalPrice } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Fleet booking not found' });
    if (booking.bookingType !== 'Taxi') return res.status(400).json({ message: 'This booking is not a fleet booking.' });
    if (booking.tourist.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this fleet booking' });
    }

    if (pickupLocation) booking.pickupLocation = String(pickupLocation).trim();
    if (dropoffLocation) booking.dropoffLocation = String(dropoffLocation).trim();
    if (pickupTime) {
      const parsedPickupTime = new Date(pickupTime);

      if (Number.isNaN(parsedPickupTime.getTime())) {
        return res.status(400).json({ message: "Pickup time must be a valid date." });
      }

      if (!validateDateInFuture(parsedPickupTime)) {
        return res.status(400).json({ message: "Pickup time must be a future date." });
      }

      booking.pickupTime = parsedPickupTime;
    }
    if (totalPrice !== undefined) booking.totalPrice = Number(totalPrice);

    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Cancel fleet booking
exports.cancelFleetBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Fleet booking not found' });

    booking.status = 'Cancelled';
    await booking.save();
    await releaseBookingResources(booking);

    res.json({ message: 'Fleet booking canceled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete fleet booking
exports.deleteFleetBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Fleet booking not found' });

    await releaseBookingResources(booking);
    await booking.deleteOne();

    res.json({ message: 'Fleet booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Tourist notifications
exports.getTouristNotifications = async (req, res) => {
  try {
    const notifications = await TouristNotification.find({ tourist: req.user.userId })
      .populate({
        path: 'booking',
        select: 'pickupLocation dropoffLocation pickupTime status totalPrice assignedDriver assignedVehicle',
        populate: [
          { path: 'assignedDriver', select: 'name phone email' },
          { path: 'assignedVehicle', select: 'plateNumber make model' }
        ]
      })
      .populate('fleetManager', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.markTouristNotificationRead = async (req, res) => {
  try {
    const notification = await TouristNotification.findOneAndUpdate(
      { _id: req.params.id, tourist: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.markAllTouristNotificationsRead = async (req, res) => {
  try {
    const result = await TouristNotification.updateMany(
      { tourist: req.user.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read.',
      data: { modifiedCount: result.modifiedCount || 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteTouristNotification = async (req, res) => {
  try {
    const notification = await TouristNotification.findOneAndDelete({
      _id: req.params.id,
      tourist: req.user.userId
    });

    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    res.json({
      success: true,
      message: 'Notification deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get my bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.user.userId })
      .populate('tourPackage')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Cancel booking
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

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, pickupTime, totalPrice, packageOptions } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.tourist.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this booking' });
    }

    if (booking.status === 'Cancelled' || booking.status === 'Completed') {
      return res.status(400).json({ message: 'Cannot modify a completed or cancelled booking' });
    }

    if (pickupLocation) booking.pickupLocation = pickupLocation;
    if (dropoffLocation !== undefined) booking.dropoffLocation = dropoffLocation;
    if (pickupTime) {
      const parsedPickupTime = new Date(pickupTime);

      if (Number.isNaN(parsedPickupTime.getTime())) {
        return res.status(400).json({ message: "Pickup time must be a valid date." });
      }

      if (!validateDateInFuture(parsedPickupTime)) {
        return res.status(400).json({ message: "Pickup time must be a future date." });
      }

      booking.pickupTime = parsedPickupTime;
    }
    if (totalPrice !== undefined && Number(totalPrice) > 0) booking.totalPrice = Number(totalPrice);

    if (packageOptions && typeof packageOptions === 'object') {
      booking.packageOptions = sanitizePackageOptions({
        ...(booking.packageOptions || {}),
        ...packageOptions,
        extras: {
          ...((booking.packageOptions && booking.packageOptions.extras) || {}),
          ...(packageOptions.extras || {})
        },
        pricing: {
          ...((booking.packageOptions && booking.packageOptions.pricing) || {}),
          ...(packageOptions.pricing || {})
        }
      });
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete booking
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

// Reviews
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