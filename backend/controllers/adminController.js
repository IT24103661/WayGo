const DriverSalary = require('../models/DriverSalary');
const FleetNotification = require('../models/FleetNotification');

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
