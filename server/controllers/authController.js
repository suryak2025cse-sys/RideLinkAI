const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const TrustScore = require('../models/TrustScore');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'ridelink_production_jwt_secret_key_v1_secure_2026',
    { expiresIn: '30d' }
  );
};

// Google OAuth Authentication Handler
const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, picture, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google email is required.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: '',
        role: role || 'Passenger',
        gender: 'Male',
        organizationName: 'Sri Eshwar College of Engineering',
        profilePicture: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        isAadhaarVerified: false,
        isLicenseVerified: false,
        trustScore: 90,
        trustBadge: 'Google Verified User'
      });

      await TrustScore.create({
        userId: user._id,
        trustScore: 90.0,
        trustBadge: 'Google Verified User',
        badgeColor: 'emerald'
      }).catch(() => null);
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Google Sign-In successful!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isAadhaarVerified: !!user.isAadhaarVerified,
        isLicenseVerified: !!user.isLicenseVerified,
        walletBalance: user.walletBalance || 250.0,
        trustScore: user.trustScore || 90,
        trustBadge: user.trustBadge || 'Google Verified User'
      },
      token
    });
  } catch (error) {
    console.error('[Google Auth Error]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, gender, organizationName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: role || 'Passenger',
      gender: gender || 'Male',
      organizationName: organizationName || 'Sri Eshwar College of Engineering',
      isAadhaarVerified: false,
      isLicenseVerified: false,
      trustScore: 80,
      trustBadge: 'New Member'
    });

    await TrustScore.create({
      userId: user._id,
      trustScore: 80.0,
      trustBadge: 'New Member',
      badgeColor: 'amber'
    }).catch(() => null);

    const token = generateToken(user);
    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        organizationName: user.organizationName,
        isAadhaarVerified: false,
        isLicenseVerified: false,
        walletBalance: user.walletBalance || 0,
        trustScore: user.trustScore || 80,
        trustBadge: user.trustBadge || 'New Member'
      },
      token
    });
  } catch (error) {
    console.error('[Register Error]:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// Login User - Strict Authentication (No backdoor, no fake user generation)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
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
        isAadhaarVerified: !!user.isAadhaarVerified,
        isLicenseVerified: !!user.isLicenseVerified,
        walletBalance: user.walletBalance || 0,
        trustScore: user.trustScore || 80,
        trustBadge: user.trustBadge || 'New Member',
        emergencyContactName: user.emergencyContactName || (user.emergencyContacts?.[0]?.name || ''),
        emergencyContactPhone: user.emergencyContactPhone || (user.emergencyContacts?.[0]?.phone || '')
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Verifications (Explicit User Action Required)
const updateProfileVerifications = async (req, res) => {
  try {
    const { aadhaarNumber, licenseNumber, emergencyContacts, emergencyContactName, emergencyContactPhone, preferences } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isAadhaarGiven = !!(aadhaarNumber && aadhaarNumber.trim().length > 5);
    const isLicenseGiven = !!(licenseNumber && licenseNumber.trim().length > 5);

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
      message: 'Profile verifications updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  googleAuth,
  registerUser,
  loginUser,
  getUserProfile,
  updateProfileVerifications
};
