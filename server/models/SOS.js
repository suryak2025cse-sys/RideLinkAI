const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    addressName: { type: String, default: 'Current GPS Location' }
  },
  triggerReason: { type: String, default: 'Manual SOS Emergency Button Pressed' },
  notifiedContacts: [{ name: String, phone: String }],
  status: { type: String, enum: ['ACTIVE_EMERGENCY', 'DISPATCHED', 'RESOLVED'], default: 'ACTIVE_EMERGENCY' },
  adminNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SOS', sosSchema, 'sos');
