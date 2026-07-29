const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  reason: { type: String, required: true },
  category: { type: String, enum: ['Unsafe Driving', 'Harassment', 'No Show', 'Route Deviation', 'Other'], default: 'Other' },
  status: { type: String, enum: ['Pending', 'Investigating', 'Resolved', 'Dismissed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
