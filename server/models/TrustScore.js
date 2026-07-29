const mongoose = require('mongoose');

const trustScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  trustScore: { type: Number, default: 85.0 },
  trustBadge: { type: String, default: 'Verified Community Member' },
  badgeColor: { type: String, default: 'cyan' },
  breakdown: {
    verifications: { type: Number, default: 20 },
    ratings: { type: Number, default: 14 },
    completionHistory: { type: Number, default: 13 },
    cancellationPenalty: { type: Number, default: 0 },
    safetyPenalty: { type: Number, default: 0 }
  },
  lastCalculated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrustScore', trustScoreSchema);
