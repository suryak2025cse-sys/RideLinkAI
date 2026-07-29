const express = require('express');
const router = express.Router();
const { registerDriver, getDriverEarnings } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', protect, registerDriver);
router.get('/earnings', protect, getDriverEarnings);

module.exports = router;
