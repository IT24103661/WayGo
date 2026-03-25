const Vehicle = require('../models/Vehicle');

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;

exports.addVehicle = async (req, res) => {
  try {
    const {
      plateNumber,
      brand,
      make,
      model,
      year,
      category,
      status,
      compliance,
      mileage,
      capacity,
      color,
      type
    } = req.body;

    if (!plateNumber || !model || !year || !category) {
      return res.status(400).json({ message: 'plateNumber, model, year, and category are required.' });
    }

    const vehicle = await Vehicle.create({
      plateNumber,
      brand: brand || make || '',
      make: make || brand || 'Unknown',
      model,
      year,
      category,
      status: status || 'Active',
      compliance: compliance || {},
      mileage: mileage || {},
      capacity: capacity || 4,
      color: color || null,
      type: type || (category === 'Luxury' ? 'Luxury' : category),
      managedBy: req.user.userId
    });

    return res.status(201).json({
      success: true,
      message: 'Vehicle added successfully.',
      data: vehicle
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error adding vehicle.' });
  }
};

exports.getMaintenanceAlerts = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ updatedAt: -1 });
    const now = new Date();
    const soon = new Date(Date.now() + DAYS_30_MS);

    const serviceDue = vehicles.filter((vehicle) => {
      const current = vehicle.mileage?.current ?? 0;
      const lastService = vehicle.mileage?.lastService ?? 0;
      const interval = vehicle.mileage?.serviceInterval ?? 0;
      return interval > 0 && (current - lastService) >= interval;
    });

    const complianceDue = vehicles.filter((vehicle) => {
      const { licenseExpiry, insuranceExpiry, emissionTestExpiry } = vehicle.compliance || {};
      const checks = [licenseExpiry, insuranceExpiry, emissionTestExpiry].filter(Boolean);
      return checks.some((date) => date <= soon);
    });

    return res.json({
      success: true,
      data: {
        serviceDue,
        complianceDue
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching maintenance alerts.' });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ managedBy: req.user.userId }).sort({ updatedAt: -1 });
    return res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching vehicles.' });
  }
};
