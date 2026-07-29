const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri || typeof mongoUri !== 'string' || !mongoUri.startsWith('mongodb')) {
      mongoUri = 'mongodb://127.0.0.1:27017/ridelink_ai';
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    console.log(`[MongoDB Connected Successfully]: Host=${conn.connection.host}, DB=${conn.connection.name}`);
  } catch (error) {
    console.log(`[MongoDB Connection Warning]: ${error.message}. Backend operating in resilient mode.`);
  }
};

module.exports = connectDB;
