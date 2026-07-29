const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: String, default: '2028-12-31' },
  isLicenseVerified: { type: Boolean, default: false },
  licenseDocUrl: { type: String, default: '' },
  
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Suspended'], default: 'Approved' },
  availableSeats: { type: Number, default: 3 },
  totalEarnings: { type: Number, default: 0 },
  completedRidesCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 4.8 },
  
  activeVehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  
  currentLocation: {
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 },
    lastUpdated: { type: Date, default: Date.now }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', driverSchema);
