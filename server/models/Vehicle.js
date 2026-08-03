const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  make: { type: String, default: 'Tata' },
  model: { type: String, default: 'Nexon EV' },
  plateNumber: { type: String, default: 'KA-01-EQ-9021' },
  color: { type: String, default: 'Midnight Dark' },
  vehicleType: { type: String, enum: ['Sedan', 'Hatchback', 'SUV', 'EV / Hybrid', 'Bike'], default: 'EV / Hybrid' },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'CNG'], default: 'Electric' },
  totalCapacity: { type: Number, default: 4 },
  isVerified: { type: Boolean, default: true },
  rcDocumentUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
