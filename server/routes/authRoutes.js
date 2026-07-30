const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth, getUserProfile, updateProfileVerifications } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/profile', protect, getUserProfile);
router.put('/verifications', protect, updateProfileVerifications);

module.exports = router;
