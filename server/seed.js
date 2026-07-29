const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Driver = require('./models/Driver');
const Vehicle = require('./models/Vehicle');
const Ride = require('./models/Ride');
const TrustScore = require('./models/TrustScore');
const Community = require('./models/Community');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ridelink_ai';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB...');

    await User.deleteMany({});
    await Driver.deleteMany({});
    await Vehicle.deleteMany({});
    await Ride.deleteMany({});
    await TrustScore.deleteMany({});
    await Community.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const passengerUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@univ.edu',
      password: passwordHash,
      phone: '+91 9876543210',
      role: 'Passenger',
      gender: 'Female',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      isAadhaarVerified: true,
      isCollegeCorporateVerified: true,
      organizationName: 'Greenwood Tech University',
      walletBalance: 450.0,
      trustScore: 94,
      trustBadge: 'Highly Trusted',
      emergencyContacts: [
        { name: 'Ramesh Sharma (Father)', phone: '+91 9876500001', relation: 'Parent' }
      ],
      preferences: { womenOnly: true, allowMusic: true, quietRide: false }
    });

    const driverUser = await User.create({
      name: 'Ananya Verma',
      email: 'ananya@univ.edu',
      password: passwordHash,
      phone: '+91 9876543211',
      role: 'Driver',
      gender: 'Female',
      profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
      isAadhaarVerified: true,
      isCollegeCorporateVerified: true,
      organizationName: 'Greenwood Tech University',
      walletBalance: 1200.0,
      trustScore: 96,
      trustBadge: 'Highly Trusted'
    });

    const adminUser = await User.create({
      name: 'Chief Safety Admin',
      email: 'admin@ridelink.ai',
      password: passwordHash,
      phone: '+91 9876543299',
      role: 'Admin',
      gender: 'Male',
      trustScore: 100,
      trustBadge: 'Platform Admin'
    });

    // 2. Driver & Vehicle
    const driverDoc = await Driver.create({
      userId: driverUser._id,
      licenseNumber: 'DL-KA-2023-889021',
      isLicenseVerified: true,
      status: 'Approved',
      availableSeats: 3,
      totalEarnings: 4850.0,
      completedRidesCount: 42,
      averageRating: 4.95
    });

    const vehicleDoc = await Vehicle.create({
      driverId: driverDoc._id,
      make: 'Tata',
      model: 'Nexon EV',
      plateNumber: 'KA-01-EQ-9021',
      color: 'Teal Blue',
      vehicleType: 'EV / Hybrid',
      fuelType: 'Electric',
      totalCapacity: 4,
      isVerified: true
    });

    driverDoc.activeVehicleId = vehicleDoc._id;
    await driverDoc.save();

    // 3. Rides
    const ride1 = await Ride.create({
      driverId: driverUser._id,
      driverDetails: {
        name: driverUser.name,
        phone: driverUser.phone,
        rating: 4.95,
        trustScore: 96,
        trustBadge: 'Highly Trusted',
        vehicleModel: 'Tata Nexon EV',
        plateNumber: 'KA-01-EQ-9021'
      },
      originName: 'Hostel Block C - North Campus Gate',
      originLat: 12.9716,
      originLng: 77.5946,
      destName: 'Cyber Park Building 4 Main Bay',
      destLat: 12.9800,
      destLng: 77.6000,
      departureTime: new Date(Date.now() + 1800000), // 30 mins from now
      departureTimeMinutes: 540,
      totalSeats: 3,
      availableSeats: 2,
      pricePerSeat: 65.0,
      communityType: 'Campus Mode',
      communityName: 'Greenwood Tech University',
      isWomenOnly: true,
      co2SavedKg: 3.2,
      distanceKm: 14.2
    });

    const ride2 = await Ride.create({
      driverId: driverUser._id,
      driverDetails: {
        name: 'Rahul Mehta',
        phone: '+91 9900112233',
        rating: 4.85,
        trustScore: 90,
        trustBadge: 'Verified Community Member',
        vehicleModel: 'Hyundai Verna',
        plateNumber: 'KA-05-MH-4421'
      },
      originName: 'Koramangala 4th Block Hub',
      originLat: 12.9345,
      originLng: 77.6245,
      destName: 'Indiranagar 100ft Road Metro',
      destLat: 12.9784,
      destLng: 77.6408,
      departureTime: new Date(Date.now() + 3600000),
      departureTimeMinutes: 600,
      totalSeats: 3,
      availableSeats: 3,
      pricePerSeat: 50.0,
      communityType: 'Corporate Mode',
      communityName: 'CyberPark Tech Hub',
      isWomenOnly: false,
      co2SavedKg: 2.1,
      distanceKm: 8.5
    });

    // 4. Communities
    await Community.create([
      { name: 'Greenwood Tech University', type: 'Campus Mode', domainRestriction: '@univ.edu', totalMembers: 340, activeRidesToday: 42 },
      { name: 'CyberPark Tech Hub', type: 'Corporate Mode', domainRestriction: '@techpark.com', totalMembers: 510, activeRidesToday: 68 },
      { name: 'Palm Meadows Gated Community', type: 'Residential Community', domainRestriction: '', totalMembers: 210, activeRidesToday: 24 }
    ]);

    // 5. Trust Scores
    await TrustScore.create([
      { userId: passengerUser._id, trustScore: 94, trustBadge: 'Highly Trusted', badgeColor: 'emerald' },
      { userId: driverUser._id, trustScore: 96, trustBadge: 'Highly Trusted', badgeColor: 'emerald' }
    ]);

    console.log('[Seed]: Database successfully populated with initial test data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();
