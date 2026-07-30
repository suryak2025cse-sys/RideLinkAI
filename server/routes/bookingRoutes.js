const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.patch('/:id', protect, updateBookingStatus);

module.exports = router;
