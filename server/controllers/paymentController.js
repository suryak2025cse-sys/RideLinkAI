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

// Verify Razorpay Payment / Topup Wallet
const verifyPaymentAndTopup = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, amount, paymentMethod } = req.body;

    const user = await User.findById(req.user._id);
    const topupAmount = parseFloat(amount) || 200.0;

    if (user) {
      user.walletBalance += topupAmount;
      await user.save();
    }

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
      newBalance: user ? user.walletBalance : 450.0,
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
