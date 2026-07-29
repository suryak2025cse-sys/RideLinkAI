const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { matchRidesAI } = require('../services/aiServiceClient');

// Create / Offer a Ride
const createRide = async (req, res) => {
  try {
    const { 
      originName, originLat, originLng,
      destName, destLat, destLng,
      departureTime, totalSeats, pricePerSeat,
      communityType, communityName, isWomenOnly, waypoints
    } = req.body;

    const user = await User.findById(req.user._id);

    const newRide = await Ride.create({
      driverId: req.user._id,
      driverDetails: {
        name: user ? user.name : req.user.name,
        phone: user ? user.phone : '+91 9876543210',
        rating: 4.9,
        trustScore: user ? user.trustScore : 92,
        trustBadge: user ? user.trustBadge : 'Highly Trusted',
        vehicleModel: 'Tata Nexon EV (KA-01-EQ-9021)',
        plateNumber: 'KA-01-EQ-9021'
      },
      originName,
      originLat: parseFloat(originLat) || 12.9716,
      originLng: parseFloat(originLng) || 77.5946,
      destName,
      destLat: parseFloat(destLat) || 12.9800,
      destLng: parseFloat(destLng) || 77.6000,
      departureTime: departureTime ? new Date(departureTime) : new Date(Date.now() + 3600000),
      totalSeats: parseInt(totalSeats) || 3,
      availableSeats: parseInt(totalSeats) || 3,
      pricePerSeat: parseFloat(pricePerSeat) || 65.0,
      communityType: communityType || 'Campus Mode',
      communityName: communityName || 'Greenwood Tech Campus',
      isWomenOnly: !!isWomenOnly,
      waypoints: waypoints || [],
      co2SavedKg: 2.8,
      distanceKm: 14.5
    });

    res.status(201).json({ success: true, ride: newRide });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search & AI Match Rides
const searchAndMatchRides = async (req, res) => {
  try {
    const { 
      pickupLat, pickupLng, 
      dropLat, dropLng, 
      departureTimeMinutes, 
      seats, womenOnly, communityType 
    } = req.query;

    const query = { status: 'Scheduled' };
    if (womenOnly === 'true') {
      query.isWomenOnly = true;
    }
    if (communityType) {
      query.communityType = communityType;
    }

    let candidateRides = await Ride.find(query);

    const passengerRequest = {
      pickupLat: parseFloat(pickupLat) || 12.9716,
      pickupLng: parseFloat(pickupLng) || 77.5946,
      dropLat: parseFloat(dropLat) || 12.9800,
      dropLng: parseFloat(dropLng) || 77.6000,
      departureTimeMinutes: parseInt(departureTimeMinutes) || 540,
      seats: parseInt(seats) || 1,
      womenOnly: womenOnly === 'true',
      communityType: communityType || 'Campus Mode'
    };

    // Run through Python AI Matching Engine
    const aiRecommendations = await matchRidesAI(passengerRequest, candidateRides);

    res.json({
      success: true,
      count: aiRecommendations.length,
      recommendations: aiRecommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book / Join Ride
const bookRide = async (req, res) => {
  try {
    const { rideId, seatsRequested, paymentMethod, pickupName, dropName } = req.body;
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const qty = parseInt(seatsRequested) || 1;
    if (ride.availableSeats < qty) {
      return res.status(400).json({ message: 'Insufficient available seats on this ride' });
    }

    const user = await User.findById(req.user._id);
    const totalFare = ride.pricePerSeat * qty;

    // Check wallet balance if paying via wallet
    if (paymentMethod === 'Wallet' && user && user.walletBalance < totalFare) {
      return res.status(400).json({ message: 'Insufficient wallet balance. Please top up or select UPI/Card.' });
    }

    // Deduct wallet if applicable
    if (paymentMethod === 'Wallet' && user) {
      user.walletBalance -= totalFare;
      await user.save();

      await Payment.create({
        userId: user._id,
        rideId: ride._id,
        amount: totalFare,
        paymentMethod: 'Wallet',
        status: 'Success'
      });
    }

    // Create RideRequest
    const rideRequest = await RideRequest.create({
      rideId: ride._id,
      passengerId: req.user._id,
      passengerDetails: {
        name: user ? user.name : req.user.name,
        phone: user ? user.phone : '+91 9876543210',
        profilePicture: user ? user.profilePicture : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        trustScore: user ? user.trustScore : 88
      },
      seatsRequested: qty,
      totalFare,
      pickupName: pickupName || ride.originName,
      dropName: dropName || ride.destName,
      status: 'Accepted',
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || 'Wallet',
      matchScore: 92.5
    });

    // Update available seats
    ride.availableSeats -= qty;
    ride.passengers.push(req.user._id);
    await ride.save();

    res.status(201).json({
      success: true,
      message: 'Ride booked successfully!',
      booking: rideRequest,
      remainingSeats: ride.availableSeats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User's Ride History (Passenger & Driver)
const getMyRides = async (req, res) => {
  try {
    const userId = req.user._id;

    const offeredRides = await Ride.find({ driverId: userId }).sort({ createdAt: -1 });
    const bookedRequests = await RideRequest.find({ passengerId: userId }).populate('rideId').sort({ createdAt: -1 });

    res.json({
      success: true,
      offeredRides,
      bookedRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Ride Status (Start, Complete, Cancel)
const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.status = status;
    await ride.save();

    res.json({ success: true, message: `Ride status updated to ${status}`, ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRide,
  searchAndMatchRides,
  bookRide,
  getMyRides,
  updateRideStatus
};
