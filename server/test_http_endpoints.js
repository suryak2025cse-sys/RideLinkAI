const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const jwt = require('jsonwebtoken');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

dotenv.config();

const User = require('./models/User');
const Ride = require('./models/Ride');
const RideRequest = require('./models/RideRequest');

const JWT_SECRET = process.env.JWT_SECRET || 'ridelink_production_jwt_secret_key_v1_secure_2026';

const runIntegrationTest = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://surya2406:SnxqpyFJDi3RgoOj@suryakavi18.808kvyg.mongodb.net/ridelink_ai?retryWrites=true&w=majority&appName=SURYAKAVI18';
    
    console.log('[Connecting to MongoDB]:', mongoUri.replace(/:([^@]+)@/, ':****@'));
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas Successfully');

    // 1. Create / find real test driver user
    const driverUser = await User.findOneAndUpdate(
      { email: 'driver_test_live@ridelink.ai' },
      { name: 'Surya K (Test Driver)', email: 'driver_test_live@ridelink.ai', password: 'hashed_password_123', role: 'Driver' },
      { upsert: true, new: true }
    );

    // 2. Create / find real test passenger user
    const passengerUser = await User.findOneAndUpdate(
      { email: 'passenger_test_live@ridelink.ai' },
      { name: 'Ananya (Test Passenger)', email: 'passenger_test_live@ridelink.ai', password: 'hashed_password_123', role: 'Passenger' },
      { upsert: true, new: true }
    );

    // Generate real JWT tokens
    const driverToken = jwt.sign({ id: driverUser._id, name: driverUser.name, email: driverUser.email, role: 'Driver' }, JWT_SECRET, { expiresIn: '1d' });
    const passengerToken = jwt.sign({ id: passengerUser._id, name: passengerUser.name, email: passengerUser.email, role: 'Passenger' }, JWT_SECRET, { expiresIn: '1d' });

    console.log('✅ Real Driver Token generated:', driverToken.slice(0, 20) + '...');
    console.log('✅ Real Passenger Token generated:', passengerToken.slice(0, 20) + '...');

    // 3. Create a real Ride document in MongoDB
    const offeredRide = new Ride({
      driverId: driverUser._id,
      driverDetails: {
        name: driverUser.name,
        phone: '+91 9025953166',
        rating: 4.9,
        trustScore: 98,
        trustBadge: 'Highly Verified Driver',
        vehicleModel: 'Tata Nexon EV (KA-01-EQ-9021)',
        plateNumber: 'KA-01-EQ-9021'
      },
      originName: 'Hostel Block C - North Campus Gate',
      originLat: 12.9716,
      originLng: 77.5946,
      destName: 'Cyber Park Building 4 Main Bay',
      destLat: 12.9800,
      destLng: 77.6000,
      departureTime: new Date(Date.now() + 3600000),
      totalSeats: 4,
      availableSeats: 4,
      pricePerSeat: 60.0,
      communityType: 'Campus Mode',
      organizationName: 'Sri Eshwar College of Engineering',
      status: 'Scheduled'
    });

    await offeredRide.save();
    console.log('🎉 1. RIDES COLLECTION DOCUMENT SAVED SUCCESSFULLY! ID:', offeredRide._id);

    // 4. Book a seat on this real Ride document
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: offeredRide._id, availableSeats: { $gte: 1 } },
      { $inc: { availableSeats: -1 }, $push: { passengers: passengerUser._id } },
      { new: true }
    );

    const bookingRequest = new RideRequest({
      rideId: offeredRide._id,
      passengerId: passengerUser._id,
      passengerDetails: {
        name: passengerUser.name,
        phone: '+91 9876543210',
        trustScore: 94
      },
      seatsRequested: 1,
      totalFare: 60.0,
      pickupName: offeredRide.originName,
      pickupLat: offeredRide.originLat,
      pickupLng: offeredRide.originLng,
      dropName: offeredRide.destName,
      dropLat: offeredRide.destLat,
      dropLng: offeredRide.destLng,
      status: 'Pending',
      paymentStatus: 'Paid',
      paymentMethod: 'Wallet'
    });

    await bookingRequest.save();
    console.log('🎉 2. RIDEREQUESTS COLLECTION DOCUMENT SAVED SUCCESSFULLY! ID:', bookingRequest._id);
    console.log('✅ Remaining seats after atomic decrement:', updatedRide.availableSeats);

    // Verify document queries directly from MongoDB Atlas
    const checkRide = await Ride.findById(offeredRide._id);
    const checkBooking = await RideRequest.findById(bookingRequest._id);

    if (checkRide && checkBooking) {
      console.log('\n🏆 VERIFICATION SUCCESS: Both Rides and RideRequests exist in MongoDB Atlas!');
    } else {
      console.error('❌ Verification failed: Documents could not be retrieved');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Integration Test Failed:', err);
    process.exit(1);
  }
};

runIntegrationTest();
