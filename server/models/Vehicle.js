const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  plateNumber: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  vehicleType: { type: String, enum: ['Sedan', 'Hatchback', 'SUV', 'EV / Hybrid', 'Bike'], default: 'Sedan' },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'CNG'], default: 'Electric' },
  totalCapacity: { type: Number, default: 4 },
  isVerified: { type: Boolean, default: true },
  rcDocumentUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
