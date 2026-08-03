const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverDetails: {
    name: String,
    phone: String,
    rating: Number,
    trustScore: Number,
    trustBadge: String,
    vehicleModel: String,
    plateNumber: String
  },
  
  originName: { type: String, required: true },
  originLat: { type: Number, required: true },
  originLng: { type: Number, required: true },

  destName: { type: String, required: true },
  destLat: { type: Number, required: true },
  destLng: { type: Number, required: true },

  departureTime: { type: mongoose.Schema.Types.Mixed, default: Date.now },
  departureTimeMinutes: { type: Number, default: 540 },

  totalSeats: { type: Number, required: true, default: 3 },
  availableSeats: { type: Number, required: true, default: 3 },
  pricePerSeat: { type: Number, required: true, default: 60.0 },

  communityType: { type: String, enum: ['Open Community', 'Campus Mode', 'Corporate Mode', 'Residential Community'], default: 'Campus Mode' },
  communityName: { type: String, default: 'Greenwood Tech University' },
  organizationName: { type: String, default: '' },

  isWomenOnly: { type: Boolean, default: false },
  
  status: { type: String, enum: ['Scheduled', 'Active', 'Completed', 'Cancelled'], default: 'Scheduled' },
  
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  waypoints: [{
    stopName: String,
    lat: Number,
    lng: Number
  }],

  co2SavedKg: { type: Number, default: 2.4 },
  distanceKm: { type: Number, default: 12.5 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);
