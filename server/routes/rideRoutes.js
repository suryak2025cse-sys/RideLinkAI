const express = require('express');
const router = express.Router();
const { 
  createRide, 
  searchAndMatchRides, 
  getRideById,
  updateRide,
  deleteRide,
  bookRide, 
  acceptRideRequest,
  rejectRideRequest,
  startTrip,
  completeTrip,
  getMyRides, 
  updateRideStatus 
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

// Ride Offers & Search APIs
router.post('/', protect, createRide);
router.post('/offer', protect, createRide);
router.get('/', searchAndMatchRides);
router.get('/match', searchAndMatchRides);
router.get('/my-rides', protect, getMyRides);
router.get('/:id', getRideById);
router.patch('/:id', protect, updateRide);
router.delete('/:id', protect, deleteRide);

// Ride Request & Booking Lifecycle APIs
router.post('/ride-request', protect, bookRide);
router.post('/book', protect, bookRide);
router.patch('/accept-request', protect, acceptRideRequest);
router.patch('/reject-request', protect, rejectRideRequest);
router.patch('/start-trip', protect, startTrip);
router.patch('/complete-trip', protect, completeTrip);
router.patch('/:rideId/status', protect, updateRideStatus);

module.exports = router;
