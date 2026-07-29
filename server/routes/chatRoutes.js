const express = require('express');
const router = express.Router();
const { getRideMessages, sendChatMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:rideId', protect, getRideMessages);
router.post('/send', protect, sendChatMessage);

module.exports = router;
