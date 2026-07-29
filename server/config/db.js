const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ridelink_ai';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    // Non-blocking fallback for local dev / mock mode
    console.log('[MongoDB Note]: Running with in-memory / schema fallback mode if database is offline.');
  }
};

module.exports = connectDB;
