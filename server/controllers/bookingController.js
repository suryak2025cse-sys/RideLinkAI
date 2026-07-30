const mongoose = require('mongoose');
const RideRequest = require('../models/RideRequest');
const Ride = require('../models/Ride');
const User = require('../models/User');

const createBooking = async (req, res) => {
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
      return res.status(400).json({ success: false, message: 'Insufficient available seats.' });
    }

    const userId = req.user?._id || new mongoose.Types.ObjectId();
    const user = mongoose.connection.readyState === 1 ? await User.findById(userId) : null;
    const totalFare = ride.pricePerSeat * qty;

    const booking = await RideRequest.create({
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

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_updated', ride);
      io.emit('ride_requested', booking);
      io.emit('ride_accepted', booking);
    }

    res.status(201).json({ success: true, booking, remainingSeats: ride.availableSeats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let booking = null;
    if (mongoose.connection.readyState === 1) {
      booking = await RideRequest.findByIdAndUpdate(id, { status }, { new: true });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('ride_updated', booking || { id, status });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  updateBookingStatus
};
