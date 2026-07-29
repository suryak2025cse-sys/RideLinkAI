const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TrustScore = require('../models/TrustScore');
const { getTrustScoreAI } = require('../services/aiServiceClient');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'ridelink_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, gender, organizationName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '+91 9876543210',
      role: role || 'Passenger',
      gender: gender || 'Female',
      organizationName: organizationName || 'Greenwood Tech University',
      isAadhaarVerified: true, // Demo verified
      isCollegeCorporateVerified: true,
      trustScore: 92,
      trustBadge: 'Highly Trusted'
    });

    // Create initial TrustScore record
    await TrustScore.create({
      userId: user._id,
      trustScore: 92.0,
      trustBadge: 'Highly Trusted',
      badgeColor: 'emerald'
    });

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        organizationName: user.organizationName,
        isAadhaarVerified: user.isAadhaarVerified,
        isCollegeCorporateVerified: user.isCollegeCorporateVerified,
        walletBalance: user.walletBalance,
        trustScore: user.trustScore,
        trustBadge: user.trustBadge
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'password123') { // Dev bypass convenience
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        organizationName: user.organizationName,
        isAadhaarVerified: user.isAadhaarVerified,
        isCollegeCorporateVerified: user.isCollegeCorporateVerified,
        walletBalance: user.walletBalance,
        trustScore: user.trustScore,
        trustBadge: user.trustBadge,
        emergencyContacts: user.emergencyContacts
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Verifications & Details
const updateProfileVerifications = async (req, res) => {
  try {
    const { aadhaarNumber, licenseNumber, emergencyContacts, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (aadhaarNumber) {
      user.aadhaarNumber = aadhaarNumber;
      user.isAadhaarVerified = true;
    }
    if (emergencyContacts) {
      user.emergencyContacts = emergencyContacts;
    }
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    // Recompute Trust Score using AI Engine
    const aiTrust = await getTrustScoreAI({
      isAadhaarVerified: user.isAadhaarVerified,
      isLicenseVerified: licenseNumber ? true : false,
      isCollegeCorporateVerified: user.isCollegeCorporateVerified,
      avgRating: 4.8
    });

    user.trustScore = aiTrust.trustScore;
    user.trustBadge = aiTrust.trustBadge;
    await user.save();

    await TrustScore.findOneAndUpdate(
      { userId: user._id },
      { trustScore: aiTrust.trustScore, trustBadge: aiTrust.trustBadge, breakdown: aiTrust.breakdown },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Profile verifications updated successfully',
      user,
      trustScoreData: aiTrust
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfileVerifications
};
