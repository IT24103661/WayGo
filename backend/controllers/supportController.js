const SupportRequest = require('../models/SupportRequest');

const ISSUE_TYPES = {
  SYSTEM_SUPPORT: 'SystemSupport',
  URGENT_DISPATCH: 'UrgentDispatch',
  APP_FEEDBACK: 'AppFeedback'
};

exports.createSupportRequest = async (req, res) => {
  try {
    const {
      issueType,
      subject,
      description,
      vehicle,
      currentLocation,
      emergencyType,
      message
    } = req.body;

    if (!Object.values(ISSUE_TYPES).includes(issueType)) {
      return res.status(400).json({
        message: 'Invalid issue type. Use SystemSupport, UrgentDispatch, or AppFeedback.'
      });
    }

    const payload = {
      issueType,
      driver: req.user.userId,
      subject,
      description,
      vehicle,
      currentLocation,
      emergencyType,
      message
    };

    const request = await SupportRequest.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Support request submitted successfully.',
      data: request
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating support request.',
      error: error.message
    });
  }
};

exports.getMySupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find({ driver: req.user.userId })
      .populate('vehicle', 'plateNumber make model category')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching support requests.',
      error: error.message
    });
  }
};
