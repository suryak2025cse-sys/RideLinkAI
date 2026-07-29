const mongoose = require('mongoose');
const User = require('./models/User');
const Ride = require('./models/Ride');
const RideRequest = require('./models/RideRequest');
const SOS = require('./models/SOS');
const Payment = require('./models/Payment');
const TrustScore = require('./models/TrustScore');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ridelink_ai';

const checkDatabaseData = async () => {
  try {
    console.log(`Connecting to database: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log(`==========================================`);
    console.log(`  🔍 RideLink AI Database Stats Summary   `);
    console.log(`==========================================`);

    const usersCount = await User.countDocuments();
    const ridesCount = await Ride.countDocuments();
    const requestsCount = await RideRequest.countDocuments();
    const sosCount = await SOS.countDocuments();
    const paymentsCount = await Payment.countDocuments();
    const trustScoresCount = await TrustScore.countDocuments();

    console.log(`👥 Users Stored: ${usersCount}`);
    console.log(`🚗 Rides Stored: ${ridesCount}`);
    console.log(`📋 Bookings/Requests: ${requestsCount}`);
    console.log(`🚨 SOS Alerts Logged: ${sosCount}`);
    console.log(`💳 Payments Logged: ${paymentsCount}`);
    console.log(`🛡️ Trust Scores: ${trustScoresCount}`);

    if (usersCount > 0) {
      console.log(`\n--- Latest 3 Registered Users ---`);
      const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3).select('name email role trustScore');
      console.table(recentUsers.map(u => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role, trustScore: u.trustScore })));
    }

    if (ridesCount > 0) {
      console.log(`\n--- Latest 3 Offered Rides ---`);
      const recentRides = await Ride.find().sort({ createdAt: -1 }).limit(3).select('originName destName pricePerSeat availableSeats status');
      console.table(recentRides.map(r => ({ id: r._id.toString(), origin: r.originName, destination: r.destName, price: r.pricePerSeat, seats: r.availableSeats, status: r.status })));
    }

    process.exit(0);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

checkDatabaseData();
