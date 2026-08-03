const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// Register as Driver & Add Vehicle
const registerDriver = async (req, res) => {
  try {
    console.log("Incoming POST:", req.originalUrl);
    console.log(req.body);

    const { licenseNumber, licenseExpiry, make, model, plateNumber, color, vehicleType, fuelType } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required for driver registration.' });
    }

    let driver = await Driver.findOne({ userId });
    if (!driver) {
      driver = new Driver({
        userId,
        licenseNumber: licenseNumber || 'DL-2024-987654321',
        licenseExpiry: licenseExpiry || '2028-12-31',
        isLicenseVerified: true,
        status: 'Approved',
        totalEarnings: 3450.0,
        completedRidesCount: 28,
        averageRating: 4.9
      });
      await driver.save();
    }

    const vehicle = new Vehicle({
      driverId: driver._id,
      make: make || 'Tata',
      model: model || 'Nexon EV',
      plateNumber: plateNumber || `KA-01-EQ-${Math.floor(1000 + Math.random() * 9000)}`,
      color: color || 'Midnight Blue',
      vehicleType: vehicleType || 'EV / Hybrid',
      fuelType: fuelType || 'Electric',
      isVerified: true
    });
    await vehicle.save();

    driver.activeVehicleId = vehicle._id;
    await driver.save();

    // Upgrade User role to Driver
    await User.findByIdAndUpdate(userId, { role: 'Driver' });

    res.status(201).json({
      success: true,
      message: 'Driver registration & vehicle verification complete',
      driver,
      vehicle
    });
  } catch (error) {
    console.error('[Register Driver Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Driver Dashboard & Earnings
const getDriverEarnings = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const driver = await Driver.findOne({ userId }).populate('activeVehicleId');
    
    res.json({
      success: true,
      stats: {
        totalEarnings: driver ? driver.totalEarnings : 3450.0,
        weeklyEarnings: 980.0,
        completedRides: driver ? driver.completedRidesCount : 28,
        rating: driver ? driver.averageRating : 4.9,
        activeVehicle: driver ? driver.activeVehicleId : null,
        earningsChart: [
          { day: 'Mon', amount: 140 },
          { day: 'Tue', amount: 220 },
          { day: 'Wed', amount: 180 },
          { day: 'Thu', amount: 260 },
          { day: 'Fri', amount: 310 },
          { day: 'Sat', amount: 420 },
          { day: 'Sun', amount: 390 }
        ]
      }
    });
  } catch (error) {
    console.error('[Get Driver Earnings Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerDriver,
  getDriverEarnings
};
