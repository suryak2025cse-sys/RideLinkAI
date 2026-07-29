const Razorpay = require('razorpay');

let razorpayInstance = null;

try {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_ridelink123';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'ridelink_secret_key_456';
  
  razorpayInstance = new Razorpay({
    key_id,
    key_secret
  });
} catch (err) {
  console.log('[Razorpay Warning]: Using mock payment engine fallback');
}

module.exports = razorpayInstance;
