const express = require('express');
const router = express.Router();
const { 
  createRide, 
  searchAndMatchRides, 
  bookRide, 
  getMyRides, 
  updateRideStatus 
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.post('/offer', protect, createRide);
router.get('/match', searchAndMatchRides);
router.post('/book', protect, bookRide);
router.get('/my-rides', protect, getMyRides);
router.patch('/:rideId/status', protect, updateRideStatus);

module.exports = router;
