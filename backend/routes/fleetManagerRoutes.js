const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { addVehicle, getMaintenanceAlerts, getVehicles } = require('../controllers/fleetController');

router.use(protect);
router.use(authorizeRoles('FleetManager'));

router.post('/vehicles', addVehicle);
router.get('/vehicles', getVehicles);
router.get('/maintenance-alerts', getMaintenanceAlerts);

module.exports = router;
