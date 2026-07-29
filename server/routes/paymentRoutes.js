const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPaymentAndTopup, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPaymentAndTopup);
router.get('/history', protect, getPaymentHistory);

module.exports = router;
