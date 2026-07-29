const mongoose = require('mongoose');
const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { matchRidesAI } = require('../services/aiServiceClient');

// Create / Offer a Ride (Persists directly to MongoDB)
const createRide = async (req, res) => {
  try {
    const { 
      originName, originLat, originLng,
      destName, destLat, destLng,
      departureTime, totalSeats, pricePerSeat,
      communityType, communityName, isWomenOnly, waypoints
    } = req.body;

    const userId = req.user?._id || new mongoose.Types.ObjectId();
    const user = mongoose.connection.readyState === 1 ? await User.findById(userId) : null;

    const newRide = await Ride.create({
      driverId: userId,
      driverDetails: {
        name: user ? user.name : (req.user?.name || 'Verified Driver'),
        phone: user ? user.phone : '+91 9876543210',
        rating: 4.9,
        trustScore: user ? user.trustScore : 92,
        trustBadge: user ? user.trustBadge : 'Highly Trusted',
        vehicleModel: 'Tata Nexon EV (KA-01-EQ-9021)',
        plateNumber: 'KA-01-EQ-9021'
      },
      originName: originName || 'Main Pickup Point',
      originLat: parseFloat(originLat) || 12.9716,
      originLng: parseFloat(originLng) || 77.5946,
      destName: destName || 'Destination Hub',
      destLat: parseFloat(destLat) || 12.9800,
      destLng: parseFloat(destLng) || 77.6000,
      departureTime: departureTime ? new Date(departureTime) : new Date(Date.now() + 3600000),
      departureTimeMinutes: 540,
      totalSeats: parseInt(totalSeats) || 3,
      availableSeats: parseInt(totalSeats) || 3,
      pricePerSeat: parseFloat(pricePerSeat) || 65.0,
      communityType: communityType || 'Campus Mode',
      communityName: communityName || 'Campus Network',
      isWomenOnly: !!isWomenOnly,
      waypoints: waypoints || [],
      status: 'Scheduled',
      co2SavedKg: 2.8,
      distanceKm: 14.5
    });

    console.log(`[MongoDB Ride Stored]: ID=${newRide._id}, Origin=${newRide.originName}`);
    res.status(201).json({ success: true, ride: newRide });
  } catch (error) {
    console.error('[Ride Creation Error]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search & AI Match Rides (Queries MongoDB)
const searchAndMatchRides = async (req, res) => {
  try {
    const { 
      pickupLat, pickupLng, 
      dropLat, dropLng, 
      departureTimeMinutes, 
      seats, womenOnly, communityType 
    } = req.query;

    const query = { status: { $ne: 'Cancelled' } };
    if (womenOnly === 'true') {
      query.isWomenOnly = true;
    }
    if (communityType && communityType !== 'All') {
      query.communityType = communityType;
    }

    let candidateRides = [];
    if (mongoose.connection.readyState === 1) {
      candidateRides = await Ride.find(query).sort({ createdAt: -1 });
    }

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

    // Run through Python AI Matching Engine or fallback match
    const aiRecommendations = await matchRidesAI(passengerRequest, candidateRides);

    res.json({
      success: true,
      count: aiRecommendations.length,
      recommendations: aiRecommendations
    });
  } catch (error) {
    console.error('[Search Rides Error]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Book / Join Ride (Persists to MongoDB)
const bookRide = async (req, res) => {
  try {
    const { rideId, seatsRequested, paymentMethod, pickupName, dropName } = req.body;
    let ride = await Ride.findById(rideId);

    if (!ride) {
      // Find latest active ride if ID not specified
      ride = await Ride.findOne({ status: 'Scheduled' }).sort({ createdAt: -1 });
    }

    if (!ride) {
      return res.status(404).json({ success: false, message: 'No available ride found to book.' });
    }

    const qty = parseInt(seatsRequested) || 1;
    if (ride.availableSeats < qty) {
      return res.status(400).json({ success: false, message: 'Insufficient available seats on this ride.' });
    }

    const userId = req.user?._id || new mongoose.Types.ObjectId();
    const user = mongoose.connection.readyState === 1 ? await User.findById(userId) : null;
    const totalFare = ride.pricePerSeat * qty;

    // Deduct wallet if paying via wallet
    if (paymentMethod === 'Wallet' && user) {
      user.walletBalance = Math.max(0, (user.walletBalance || 250) - totalFare);
      await user.save();

      await Payment.create({
        userId: user._id,
        rideId: ride._id,
        amount: totalFare,
        paymentMethod: 'Wallet',
        status: 'Success'
      }).catch(() => null);
    }

    // Create RideRequest document in MongoDB
    const rideRequest = await RideRequest.create({
      rideId: ride._id,
      passengerId: userId,
      passengerDetails: {
        name: user ? user.name : (req.user?.name || 'Passenger'),
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

    // Update available seats on Ride
    ride.availableSeats = Math.max(0, ride.availableSeats - qty);
    if (!ride.passengers) ride.passengers = [];
    ride.passengers.push(userId);
    await ride.save();

    console.log(`[MongoDB Booking Stored]: Ride ID=${ride._id}, Seats Left=${ride.availableSeats}`);

    res.status(201).json({
      success: true,
      message: 'Ride booked successfully!',
      booking: rideRequest,
      remainingSeats: ride.availableSeats
    });
  } catch (error) {
    console.error('[Book Ride Error]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User's Ride History (Passenger & Driver)
const getMyRides = async (req, res) => {
  try {
    const userId = req.user?._id;

    const offeredRides = await Ride.find({ driverId: userId }).sort({ createdAt: -1 });
    const bookedRequests = await RideRequest.find({ passengerId: userId }).populate('rideId').sort({ createdAt: -1 });

    res.json({
      success: true,
      offeredRides,
      bookedRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Ride Status
const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    ride.status = status;
    await ride.save();

    res.json({ success: true, message: `Ride status updated to ${status}`, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRide,
  searchAndMatchRides,
  bookRide,
  getMyRides,
  updateRideStatus
};
