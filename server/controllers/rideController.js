const mongoose = require('mongoose');
const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { matchRidesAI } = require('../services/aiServiceClient');

// Create / Offer a Ride (Persists directly to MongoDB and emits Socket.IO event)
const createRide = async (req, res) => {
  try {
    const { 
      originName, originLat, originLng,
      destName, destLat, destLng,
      departureTime, totalSeats, pricePerSeat,
      communityType, communityName, isWomenOnly, waypoints, organizationName
    } = req.body;

    const userId = req.user?._id || new mongoose.Types.ObjectId();
    const user = mongoose.connection.readyState === 1 ? await User.findById(userId) : null;

    const newRide = await Ride.create({
      driverId: userId,
      driverDetails: {
        name: user ? user.name : (req.user?.name || 'Surya K'),
        phone: user ? user.phone : '+91 9025953166',
        rating: 4.9,
        trustScore: user ? user.trustScore : 96,
        trustBadge: user ? user.trustBadge : 'Highly Trusted',
        vehicleModel: 'Tata Nexon EV (KA-01-EQ-9021)',
        plateNumber: 'KA-01-EQ-9021'
      },
      originName: originName || 'Hostel Block C - North Campus Gate',
      originLat: parseFloat(originLat) || 12.9716,
      originLng: parseFloat(originLng) || 77.5946,
      destName: destName || 'Cyber Park Building 4 Main Bay',
      destLat: parseFloat(destLat) || 12.9800,
      destLng: parseFloat(destLng) || 77.6000,
      departureTime: departureTime ? new Date(departureTime) : new Date(Date.now() + 3600000),
      departureTimeMinutes: 540,
      totalSeats: parseInt(totalSeats) || 3,
      availableSeats: parseInt(totalSeats) || 3,
      pricePerSeat: parseFloat(pricePerSeat) || 0,
      communityType: communityType || 'Open Community',
      communityName: communityName || 'Community Network',
      organizationName: organizationName || (user ? user.organizationName : 'Sri Eshwar College of Engineering'),
      isWomenOnly: !!isWomenOnly,
      waypoints: waypoints || [],
      status: 'Scheduled',
      co2SavedKg: 2.8,
      distanceKm: 14.5
    });

    console.log(`[MongoDB Ride Stored Successfully]: ID=${newRide._id}, Origin=${newRide.originName}`);

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_created', newRide);
    }

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
      pickupLocation, destination, 
      seats, womenOnly, communityType, organizationName 
    } = req.query;

    const query = { status: { $ne: 'Cancelled' } };
    
    if (womenOnly === 'true') {
      query.isWomenOnly = true;
    }
    
    if (communityType && communityType !== 'All') {
      query.$or = [
        { communityType: communityType },
        { communityType: 'Open Community' }
      ];
    }

    let candidateRides = [];
    if (mongoose.connection.readyState === 1) {
      candidateRides = await Ride.find(query).sort({ createdAt: -1 });
    }

    if (!candidateRides || candidateRides.length === 0) {
      candidateRides = await Ride.find({}).sort({ createdAt: -1 });
    }

    const passengerRequest = {
      pickupLat: 12.9716,
      pickupLng: 77.5946,
      dropLat: 12.9800,
      dropLng: 77.6000,
      seats: parseInt(seats) || 1,
      womenOnly: womenOnly === 'true',
      communityType: communityType || 'All'
    };

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

// Get Ride By ID
const getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    let ride = null;

    if (mongoose.connection.readyState === 1) {
      ride = await Ride.findById(id);
    }

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Ride
const updateRide = async (req, res) => {
  try {
    const { id } = req.params;
    let ride = null;

    if (mongoose.connection.readyState === 1) {
      ride = await Ride.findByIdAndUpdate(id, req.body, { new: true });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_updated', ride || req.body);
    }

    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Ride
const deleteRide = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Ride.findByIdAndDelete(id);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_deleted', id);
    }

    res.json({ success: true, message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Book / Request Seat
const bookRide = async (req, res) => {
  try {
    const { rideId, seatsRequested, paymentMethod, pickupName, dropName } = req.body;
    let ride = await Ride.findById(rideId);

    if (!ride) {
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

    if (user) {
      user.walletBalance = Math.max(0, (user.walletBalance || 250) - totalFare);
      await user.save();
    }

    await Payment.create({
      userId: userId,
      rideId: ride._id,
      amount: totalFare,
      paymentMethod: paymentMethod || 'Wallet',
      status: 'Success'
    }).catch(() => null);

    const rideRequest = await RideRequest.create({
      rideId: ride._id,
      passengerId: userId,
      passengerDetails: {
        name: user ? user.name : (req.user?.name || 'Surya K'),
        phone: user ? user.phone : '+91 9025953166',
        trustScore: user ? user.trustScore : 94
      },
      seatsRequested: qty,
      totalFare,
      pickupName: pickupName || ride.originName,
      dropName: dropName || ride.destName,
      status: 'Accepted',
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || 'Wallet',
      matchScore: 94.5
    });

    ride.availableSeats = Math.max(0, ride.availableSeats - qty);
    if (!ride.passengers) ride.passengers = [];
    ride.passengers.push(userId);
    await ride.save();

    console.log(`[MongoDB Booking Stored]: Ride ID=${ride._id}, Seats Left=${ride.availableSeats}`);

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_updated', ride);
      io.emit('ride_request', rideRequest);
    }

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

// Accept Ride Request
const acceptRideRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    let request = null;

    if (mongoose.connection.readyState === 1) {
      request = await RideRequest.findByIdAndUpdate(requestId, { status: 'Accepted' }, { new: true });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_accepted', request || { requestId, status: 'Accepted' });
    }

    res.json({ success: true, message: 'Ride request accepted', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject Ride Request
const rejectRideRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    let request = null;

    if (mongoose.connection.readyState === 1) {
      request = await RideRequest.findByIdAndUpdate(requestId, { status: 'Rejected' }, { new: true });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_rejected', request || { requestId, status: 'Rejected' });
    }

    res.json({ success: true, message: 'Ride request rejected', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Start Trip
const startTrip = async (req, res) => {
  try {
    const { rideId } = req.body;
    let ride = null;

    if (mongoose.connection.readyState === 1) {
      ride = await Ride.findByIdAndUpdate(rideId, { status: 'Active' }, { new: true });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('trip_started', ride || { rideId, status: 'Active' });
    }

    res.json({ success: true, message: 'Trip started successfully', ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete Trip
const completeTrip = async (req, res) => {
  try {
    const { rideId } = req.body;
    let ride = null;

    if (mongoose.connection.readyState === 1) {
      ride = await Ride.findByIdAndUpdate(rideId, { status: 'Completed' }, { new: true });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('trip_completed', ride || { rideId, status: 'Completed' });
    }

    res.json({ success: true, message: 'Trip completed successfully', ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });

    ride.status = status;
    await ride.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_updated', ride);
    }

    res.json({ success: true, message: `Ride status updated to ${status}`, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
