const Review = require('../models/Review');
const User = require('../models/User');

const createReview = async (req, res) => {
  try {
    console.log("Incoming POST:", req.originalUrl);
    console.log(req.body);

    const { rideId, revieweeId, rating, comment, aspects } = req.body;
    
    if (!rideId || !revieweeId) {
      return res.status(400).json({ success: false, message: 'rideId and revieweeId are required.' });
    }

    const review = new Review({
      rideId,
      reviewerId: req.user?._id || req.body.reviewerId,
      revieweeId,
      rating: parseFloat(rating) || 5.0,
      comment: comment || 'Smooth and pleasant ride! Very polite driver.',
      aspects: aspects || { punctuality: 5, drivingSafety: 5, friendliness: 5 }
    });

    await review.save();

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('[Create Review Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ revieweeId: userId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('[Get Reviews Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getReviewsForUser };
