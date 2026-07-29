const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Open Community', 'Campus Mode', 'Corporate Mode', 'Residential Community'], required: true },
  domainRestriction: { type: String, default: '' }, // e.g. @univ.edu or @company.com
  verificationCode: { type: String, default: '' },
  adminUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalMembers: { type: Number, default: 120 },
  activeRidesToday: { type: Number, default: 18 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', communitySchema);
