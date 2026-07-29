const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateProfileVerifications } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/verifications', protect, updateProfileVerifications);

module.exports = router;
