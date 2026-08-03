const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri || typeof mongoUri !== 'string' || !mongoUri.startsWith('mongodb')) {
      console.log('[MongoDB Notice]: MONGODB_URI not configured in environment variables.');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    console.log(`[MongoDB Connected Successfully]: Host=${conn.connection.host}, DB=${conn.connection.name}`);
  } catch (error) {
    console.log(`[MongoDB Connection Warning]: ${error.message}.`);
  }
};

module.exports = connectDB;
