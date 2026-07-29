const express = require('express');
const router = express.Router();
const { getAdminDashboardAnalytics, getAllUsersAdmin, verifyDriverAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/analytics', protect, authorize('Admin', 'CampusAdmin'), getAdminDashboardAnalytics);
router.get('/users', protect, authorize('Admin', 'CampusAdmin'), getAllUsersAdmin);
router.patch('/driver/:driverId/verify', protect, authorize('Admin', 'CampusAdmin'), verifyDriverAdmin);

module.exports = router;
