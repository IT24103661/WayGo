const Booking = require('../models/Booking');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const VALID_STATUSES = ['Online', 'Offline', 'On Trip'];

exports.updateStatus = async (req, res) => {
  try {
    const { status, location } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updates = {};
    if (status) {
      updates.status = status;
    }

    if (location) {
      const { coordinates, type } = location;
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        return res.status(400).json({ message: 'Location coordinates must be [lng, lat].' });
      }
      updates.location = {
        type: type || 'Point',
        coordinates
      };
    }

    const driver = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    return res.json({
      message: 'Driver status updated.',
      data: driver
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating driver status.' });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: 'This booking is no longer available.' });
    }

    const driver = await User.findById(req.user.userId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    if (driver.status !== 'Online') {
      return res.status(400).json({ message: 'You must be online to accept a job.' });
    }

    if (booking.bookingType === 'Tour' && !driver.isTourCertified) {
      return res.status(403).json({ message: 'Tour certification is required to accept this trip.' });
    }

    booking.status = 'Accepted';
    booking.assignedDriver = driver._id;

    if (!booking.assignedVehicle) {
      const vehicle = await Vehicle.findOne({
        assignedDriver: driver._id,
        status: 'Available'
      });

      if (vehicle) {
        booking.assignedVehicle = vehicle._id;
        vehicle.status = 'On Trip';
        await vehicle.save();
      }
    }

    await booking.save();

    driver.status = 'On Trip';
    await driver.save();

    return res.json({
      message: 'Booking accepted.',
      data: booking
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error accepting booking.' });
  }
};
