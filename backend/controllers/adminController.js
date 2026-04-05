const DriverSalary = require('../models/DriverSalary');
const FleetNotification = require('../models/FleetNotification');
const User = require('../models/User');

const PAYROLL_ROLES = ['Driver', 'TourManager', 'FleetManager'];

exports.getSalaryCandidates = async (req, res) => {
  try {
    const role = String(req.query.role || '').trim();
    if (!PAYROLL_ROLES.includes(role)) {
      return res.status(400).json({ message: 'role must be Driver, TourManager, or FleetManager.' });
    }

    const users = await User.find({ role }).select('name email phone role managedByFleetManager').sort({ name: 1 });
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching salary candidates.' });
  }
};

exports.createSalaryApprovals = async (req, res) => {
  try {
    const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
    if (!rows.length) {
      return res.status(400).json({ message: 'rows is required and must be a non-empty array.' });
    }

    const results = [];

    for (const row of rows) {
      const driverId = String(row.driverId || '').trim();
      const month = String(row.month || '').trim();
      const baseSalary = Number(row.baseSalary || 0);
      const bonus = Number(row.bonus || 0);
      const deductions = Number(row.deductions || 0);
      const notes = String(row.notes || '').trim();
      const paymentStatus = String(row.paymentStatus || 'Pending');

      if (!driverId || !month) {
        return res.status(400).json({ message: 'Each row requires driverId and month.' });
      }

      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        return res.status(400).json({ message: 'month must follow YYYY-MM format.' });
      }

      if (!['Pending', 'Paid'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'paymentStatus must be Pending or Paid.' });
      }

      const driver = await User.findById(driverId).select('_id role managedByFleetManager');
      if (!driver || driver.role !== 'Driver') {
        return res.status(400).json({ message: 'driverId must reference a Driver user.' });
      }

      const netSalary = baseSalary + bonus - deductions;
      if (netSalary < 0) {
        return res.status(400).json({ message: 'Net salary cannot be negative.' });
      }

      const existing = await DriverSalary.findOne({ driver: driver._id, month });
      const fleetManager = driver.managedByFleetManager || req.user.userId;

      if (existing) {
        existing.fleetManager = fleetManager;
        existing.baseSalary = baseSalary;
        existing.bonus = bonus;
        existing.deductions = deductions;
        existing.netSalary = netSalary;
        existing.notes = notes;
        existing.paymentStatus = paymentStatus;
        if (paymentStatus === 'Paid') {
          existing.paymentDate = existing.paymentDate || new Date();
          existing.paidAt = existing.paidAt || new Date();
        }
        await existing.save();
        results.push(existing);
      } else {
        const created = await DriverSalary.create({
          fleetManager,
          driver: driver._id,
          month,
          baseSalary,
          bonus,
          deductions,
          netSalary,
          paymentStatus,
          paymentDate: paymentStatus === 'Paid' ? new Date() : null,
          paidAt: paymentStatus === 'Paid' ? new Date() : null,
          notes
        });
        results.push(created);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Salary rows saved successfully.',
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error saving salary rows.' });
  }
};

exports.updateSalaryApproval = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { baseSalary, bonus, deductions, notes, paymentDate } = req.body;

    const salary = await DriverSalary.findById(salaryId);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found.' });
    }

    if (baseSalary !== undefined) salary.baseSalary = Number(baseSalary);
    if (bonus !== undefined) salary.bonus = Number(bonus);
    if (deductions !== undefined) salary.deductions = Number(deductions);
    if (notes !== undefined) salary.notes = String(notes || '').trim();

    if ([salary.baseSalary, salary.bonus, salary.deductions].some((n) => Number.isNaN(Number(n)) || Number(n) < 0)) {
      return res.status(400).json({ message: 'baseSalary, bonus, and deductions must be non-negative numbers.' });
    }

    salary.netSalary = Number(salary.baseSalary) + Number(salary.bonus) - Number(salary.deductions);
    if (salary.netSalary < 0) {
      return res.status(400).json({ message: 'Net salary cannot be negative.' });
    }

    if (paymentDate !== undefined) {
      if (!paymentDate) {
        salary.paymentDate = null;
      } else {
        const parsed = new Date(paymentDate);
        if (Number.isNaN(parsed.getTime())) {
          return res.status(400).json({ message: 'paymentDate must be a valid date.' });
        }
        salary.paymentDate = parsed;
      }
    }

    await salary.save();

    const updated = await DriverSalary.findById(salaryId)
      .populate('driver', 'name email phone')
      .populate('fleetManager', 'name email');

    return res.json({
      success: true,
      message: 'Salary row updated successfully.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating salary row.' });
  }
};

exports.getSalaryApprovals = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && ['Pending', 'Paid'].includes(status)) {
      query.paymentStatus = status;
    }

    const salaries = await DriverSalary.find(query)
      .populate('driver', 'name email phone')
      .populate('fleetManager', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching salary approvals.' });
  }
};

exports.updateSalaryApprovalStatus = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { paymentStatus, paymentDate } = req.body;

    if (!['Pending', 'Paid'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'paymentStatus must be Pending or Paid.' });
    }

    let parsedPaymentDate = null;
    if (paymentDate) {
      parsedPaymentDate = new Date(paymentDate);
      if (Number.isNaN(parsedPaymentDate.getTime())) {
        return res.status(400).json({ message: 'paymentDate must be a valid date.' });
      }
    }

    const salary = await DriverSalary.findById(salaryId).populate('driver', 'name');
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found.' });
    }

    salary.paymentStatus = paymentStatus;
    salary.paymentDate = parsedPaymentDate || salary.paymentDate;
    salary.paidAt = paymentStatus === 'Paid' ? (parsedPaymentDate || new Date()) : null;
    await salary.save();

    if (paymentStatus === 'Paid') {
      await FleetNotification.create({
        fleetManager: salary.fleetManager,
        message: `Salary approved by admin: ${salary.driver?.name || 'Driver'} (${salary.month}) is marked as Paid.`,
        type: 'SALARY_PAID'
      });
    }

    const updated = await DriverSalary.findById(salaryId)
      .populate('driver', 'name email phone')
      .populate('fleetManager', 'name email');

    return res.json({
      success: true,
      message: 'Salary status updated successfully.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating salary status.' });
  }
};
