const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    
    // Check if token exists and isn't a dummy string
    if (token && token !== 'null' && token !== 'undefined') {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ridelink_super_secret_jwt_key_2026');

        if (mongoose.connection.readyState === 1) {
          req.user = await User.findById(decoded.id).select('-password');
        }

        if (req.user) {
          return next();
        }
      } catch (error) {
        console.log('[Auth Guard]: Invalid or expired token presented');
      }
    }
  }

  // If endpoint requires strict authentication
  return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
      return res.status(403).json({ success: false, message: `Access denied. Role ${req.user ? req.user.role : 'Guest'} is not authorized.` });
    }
    next();
  };
};

module.exports = { protect, authorize };
