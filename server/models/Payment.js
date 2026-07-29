const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  rideRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RideRequest' },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, enum: ['Wallet', 'UPI', 'Card', 'NetBanking'], default: 'Wallet' },
  status: { type: String, enum: ['Success', 'Pending', 'Failed', 'Refunded'], default: 'Success' },
  receiptUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
