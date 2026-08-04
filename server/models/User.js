const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['Passenger', 'Driver', 'Admin', 'CampusAdmin'], 
    default: 'Passenger' 
  },
  gender: { type: String, enum: ['Female', 'Male', 'Other'], default: 'Female' },
  profilePicture: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  
  // Verifications
  isAadhaarVerified: { type: Boolean, default: false },
  aadhaarNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  isLicenseVerified: { type: Boolean, default: false },
  licenseNumber: { type: String, default: '' },
  isCollegeCorporateVerified: { type: Boolean, default: false },
  organizationName: { type: String, default: '' },
  organizationIdDoc: { type: String, default: '' },
  
  // Emergency & Preferences
  emergencyContactName: { type: String, default: '' },
  emergencyContactPhone: { type: String, default: '' },
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }],
  preferences: {
    womenOnly: { type: Boolean, default: false },
    allowMusic: { type: Boolean, default: true },
    allowPets: { type: Boolean, default: false },
    quietRide: { type: Boolean, default: false }
  },

  walletBalance: { type: Number, default: 250.0 },
  trustScore: { type: Number, default: 85 },
  trustBadge: { type: String, default: 'Verified Community Member' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
