const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'ridelink_production_jwt_secret_key_v1_secure_2026';

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, gender, phone, organizationName } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'Passenger',
      gender: gender || 'Female',
      phone: phone || '',
      organizationName: organizationName || 'Sri Eshwar College of Engineering',
      isAadhaarVerified: false,
      isLicenseVerified: false,
      walletBalance: 250.0,
      trustScore: 85,
      trustBadge: 'Verified Community Member'
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
        organizationName: user.organizationName,
        walletBalance: user.walletBalance,
        trustScore: user.trustScore,
        trustBadge: user.trustBadge,
        isAadhaarVerified: !!user.isAadhaarVerified,
        isLicenseVerified: !!user.isLicenseVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User account not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
        organizationName: user.organizationName,
        walletBalance: user.walletBalance,
        trustScore: user.trustScore,
        trustBadge: user.trustBadge,
        isAadhaarVerified: !!user.isAadhaarVerified,
        isLicenseVerified: !!user.isLicenseVerified,
        aadhaarNumber: user.aadhaarNumber || '',
        panNumber: user.panNumber || '',
        licenseNumber: user.licenseNumber || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Current User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile Details
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, gender, profilePicture, organizationName } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = profilePicture;
    if (organizationName) user.organizationName = organizationName;

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
        organizationName: user.organizationName,
        walletBalance: user.walletBalance,
        trustScore: user.trustScore,
        trustBadge: user.trustBadge,
        isAadhaarVerified: !!user.isAadhaarVerified,
        isLicenseVerified: !!user.isLicenseVerified,
        aadhaarNumber: user.aadhaarNumber || '',
        panNumber: user.panNumber || '',
        licenseNumber: user.licenseNumber || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Verifications (Explicit User Action Required)
const updateProfileVerifications = async (req, res) => {
  try {
    const { name, email, aadhaarNumber, panNumber, licenseNumber, phone, emergencyContacts, emergencyContactName, emergencyContactPhone, preferences } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (panNumber) user.panNumber = panNumber;

    const isAadhaarGiven = !!(aadhaarNumber && aadhaarNumber.trim().length === 12);
    const isLicenseGiven = !!(licenseNumber && licenseNumber.trim().length >= 13);

    if (isAadhaarGiven) {
      user.aadhaarNumber = aadhaarNumber;
      user.isAadhaarVerified = true;
    }
    if (isLicenseGiven) {
      user.licenseNumber = licenseNumber;
      user.isLicenseVerified = true;
    }
    if (isAadhaarGiven && isLicenseGiven) {
      user.trustScore = 98;
      user.trustBadge = 'Highly Verified Driver';
    }
    if (emergencyContacts) {
      user.emergencyContacts = emergencyContacts;
    }
    if (emergencyContactName) user.emergencyContactName = emergencyContactName;
    if (emergencyContactPhone) user.emergencyContactPhone = emergencyContactPhone;

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile & Trust credentials updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
        organizationName: user.organizationName,
        walletBalance: user.walletBalance,
        trustScore: user.trustScore,
        trustBadge: user.trustBadge,
        isAadhaarVerified: !!user.isAadhaarVerified,
        isLicenseVerified: !!user.isLicenseVerified,
        aadhaarNumber: user.aadhaarNumber || '',
        panNumber: user.panNumber || '',
        licenseNumber: user.licenseNumber || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateProfileVerifications
};
