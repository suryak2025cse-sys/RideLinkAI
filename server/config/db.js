const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri || typeof mongoUri !== 'string' || !mongoUri.startsWith('mongodb')) {
      mongoUri = 'mongodb+srv://surya2406:SnxqpyFJDi3RgoOj@suryakavi18.808kvyg.mongodb.net/ridelink_ai?retryWrites=true&w=majority&appName=SURYAKAVI18';
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
