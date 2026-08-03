const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Fix Windows DNS resolution issue for MongoDB Atlas querySrv ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

dotenv.config();

const User = require('./models/User');
const Ride = require('./models/Ride');
const RideRequest = require('./models/RideRequest');
const Driver = require('./models/Driver');
const Vehicle = require('./models/Vehicle');
const Chat = require('./models/Chat');
const Community = require('./models/Community');
const Notification = require('./models/Notification');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const SOS = require('./models/SOS');

const runTest = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://surya2406:SnxqpyFJDi3RgoOj@suryakavi18.808kvyg.mongodb.net/ridelink_ai?retryWrites=true&w=majority&appName=SURYAKAVI18';
    
    console.log('[Connecting to MongoDB]:', mongoUri.replace(/:([^@]+)@/, ':****@'));
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    console.log('[Connected to MongoDB Atlas Successfully]');

    // 1. User
    const testUser = await User.findOneAndUpdate(
      { email: 'test_audit_user@ridelink.ai' },
      { name: 'Test Audit User', email: 'test_audit_user@ridelink.ai', password: 'hashed_password_123', role: 'Passenger' },
      { upsert: true, new: true }
    );
    console.log('✅ 1. User collection stored ID:', testUser._id);

    // 2. Ride
    const testRide = await Ride.create({
      driverId: testUser._id,
      originName: 'Test Origin Campus Gate',
      originLat: 12.9716,
      originLng: 77.5946,
      destName: 'Test Destination Tech Park',
      destLat: 12.9800,
      destLng: 77.6000,
      departureTime: new Date(),
      totalSeats: 4,
      availableSeats: 4,
      pricePerSeat: 50.0
    });
    console.log('✅ 2. Ride collection stored ID:', testRide._id);

    // 3. RideRequest
    const testRequest = await RideRequest.create({
      rideId: testRide._id,
      passengerId: testUser._id,
      seatsRequested: 1,
      totalFare: 50.0,
      pickupName: 'Test Pickup',
      dropName: 'Test Drop',
      status: 'Accepted'
    });
    console.log('✅ 3. RideRequest collection stored ID:', testRequest._id);

    // 4. Driver
    const testDriver = await Driver.create({
      userId: testUser._id,
      licenseNumber: 'DL-TEST-12345',
      status: 'Approved'
    });
    console.log('✅ 4. Driver collection stored ID:', testDriver._id);

    // 5. Vehicle
    const testVehicle = await Vehicle.create({
      driverId: testDriver._id,
      make: 'Tata',
      model: 'Nexon EV',
      plateNumber: 'KA-01-TEST-99'
    });
    console.log('✅ 5. Vehicle collection stored ID:', testVehicle._id);

    // 6. Chat
    const testChat = await Chat.create({
      rideId: testRide._id,
      senderId: testUser._id,
      senderName: testUser.name,
      senderRole: 'Passenger',
      message: 'Test audit message for real-time MongoDB check'
    });
    console.log('✅ 6. Chat collection stored ID:', testChat._id);

    // 7. Community
    const testCommunity = await Community.create({
      name: 'Test Campus Community ' + Date.now(),
      type: 'Campus Mode'
    });
    console.log('✅ 7. Community collection stored ID:', testCommunity._id);

    // 8. Notification
    const testNotif = await Notification.create({
      userId: testUser._id,
      title: 'Test Audit Notification',
      message: 'Verification notification stored in MongoDB',
      type: 'RIDE_ACCEPTED'
    });
    console.log('✅ 8. Notification collection stored ID:', testNotif._id);

    // 9. Payment
    const testPayment = await Payment.create({
      userId: testUser._id,
      amount: 100.0,
      paymentMethod: 'UPI',
      status: 'Success'
    });
    console.log('✅ 9. Payment collection stored ID:', testPayment._id);

    // 10. Review
    const testReview = await Review.create({
      rideId: testRide._id,
      reviewerId: testUser._id,
      revieweeId: testUser._id,
      rating: 5.0,
      comment: 'Excellent test review'
    });
    console.log('✅ 10. Review collection stored ID:', testReview._id);

    // 11. SOS
    const testSOS = await SOS.create({
      userId: testUser._id,
      location: { lat: 12.9716, lng: 77.5946, addressName: 'Test Emergency Location' },
      triggerReason: 'Test Audit Emergency Trigger'
    });
    console.log('✅ 11. SOS collection stored ID:', testSOS._id);

    console.log('\n🎉 ALL 11 MONGODB COLLECTIONS STORED DOCUMENTS SUCCESSFULLY!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ MONGODB TEST FAILED:', err);
    process.exit(1);
  }
};

runTest();
