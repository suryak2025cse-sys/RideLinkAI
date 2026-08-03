const mongoose = require('mongoose');
const dns = require('dns');

// Fallback Google DNS servers to prevent querySrv ECONNREFUSED on MongoDB Atlas SRV strings
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://surya2406:SnxqpyFJDi3RgoOj@suryakavi18.808kvyg.mongodb.net/ridelink_ai?retryWrites=true&w=majority&appName=SURYAKAVI18';
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    console.log(`[MongoDB Atlas Connected Successfully]: Host=${conn.connection.host}, DB=${conn.connection.name}`);
  } catch (error) {
    console.log(`[MongoDB Connection Warning]: ${error.message}.`);
  }
};

module.exports = connectDB;
