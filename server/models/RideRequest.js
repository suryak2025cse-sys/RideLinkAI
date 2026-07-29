const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  passengerDetails: {
    name: String,
    phone: String,
    profilePicture: String,
    trustScore: Number
  },
  seatsRequested: { type: Number, default: 1 },
  totalFare: { type: Number, required: true },

  pickupName: { type: String, default: '' },
  pickupLat: { type: Number, default: 0 },
  pickupLng: { type: Number, default: 0 },

  dropName: { type: String, default: '' },
  dropLat: { type: Number, default: 0 },
  dropLng: { type: Number, default: 0 },

  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Wallet', 'Razorpay UPI', 'Card'], default: 'Wallet' },
  
  matchScore: { type: Number, default: 90.0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RideRequest', rideRequestSchema);
