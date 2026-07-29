const express = require('express');
const router = express.Router();
const { triggerSOS, getActiveSOSAlerts, resolveSOSAlert } = require('../controllers/safetyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/sos', protect, triggerSOS);
router.get('/sos/active', protect, authorize('Admin', 'CampusAdmin'), getActiveSOSAlerts);
router.patch('/sos/:sosId/resolve', protect, authorize('Admin', 'CampusAdmin'), resolveSOSAlert);

module.exports = router;
