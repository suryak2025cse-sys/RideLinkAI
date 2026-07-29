const Review = require('../models/Review');
const User = require('../models/User');

const createReview = async (req, res) => {
  try {
    const { rideId, revieweeId, rating, comment, aspects } = req.body;
    const review = await Review.create({
      rideId,
      reviewerId: req.user._id,
      revieweeId,
      rating: parseFloat(rating) || 5.0,
      comment: comment || 'Smooth and pleasant ride! Very polite driver.',
      aspects: aspects || { punctuality: 5, drivingSafety: 5, friendliness: 5 }
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview };
