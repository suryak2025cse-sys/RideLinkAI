const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const amountInPaise = Math.round((parseFloat(amount) || 100) * 100);

    let order = {
      id: `order_mock_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    if (razorpay) {
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });
    }

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_ridelink123'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Razorpay Payment Signature / Topup Wallet
const verifyPaymentAndTopup = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, amount, paymentMethod } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Verify HMAC signature if Razorpay signature is provided
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature && secret) {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const topupAmount = parseFloat(amount) || 0;
    if (topupAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid topup amount' });
    }

    user.walletBalance += topupAmount;
    await user.save();

    const payment = await Payment.create({
      userId: req.user._id,
      razorpayOrderId: razorpayOrderId || `order_${Date.now()}`,
      razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
      amount: topupAmount,
      paymentMethod: paymentMethod || 'UPI',
      status: 'Success',
      receiptUrl: `https://ridelink.ai/receipts/rec_${Date.now()}.pdf`
    });

    res.json({
      success: true,
      message: `Successfully topped up ₹${topupAmount} to RideLink Wallet`,
      newBalance: user.walletBalance,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Payments History
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentAndTopup,
  getPaymentHistory
};
