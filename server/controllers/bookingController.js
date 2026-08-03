const RideRequest = require('../models/RideRequest');
const { bookRide } = require('./rideController');

// Delegate createBooking to canonical bookRide logic in rideController
const createBooking = async (req, res) => {
  return bookRide(req, res);
};

const updateBookingStatus = async (req, res) => {
  try {
    console.log("Incoming PATCH:", req.originalUrl);
    console.log(req.body);

    const { id } = req.params;
    const { status } = req.body;

    const booking = await RideRequest.findByIdAndUpdate(id, { status }, { new: true });

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
