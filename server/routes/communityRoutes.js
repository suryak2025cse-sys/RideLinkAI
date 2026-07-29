const express = require('express');
const router = express.Router();
const { getCommunities, createCommunity } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCommunities);
router.post('/create', protect, createCommunity);

module.exports = router;
