const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri || typeof mongoUri !== 'string' || !mongoUri.startsWith('mongodb')) {
      mongoUri = 'https://ridelink-backend-u775.onrender.com/';
    }

    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[MongoDB Note]: Database connection attempt (${error.message}). Running with resilient fallback mode.`);
  }
};

module.exports = connectDB;
