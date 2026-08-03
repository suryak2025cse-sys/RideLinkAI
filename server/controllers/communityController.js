const Community = require('../models/Community');

const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json({ success: true, communities });
  } catch (error) {
    console.error('[Get Communities Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCommunity = async (req, res) => {
  try {
    console.log("Incoming POST:", req.originalUrl);
    console.log(req.body);

    const { name, type, domainRestriction } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Community name is required.' });
    }

    const community = new Community({
      name,
      type: type || 'Open Community',
      domainRestriction: domainRestriction || '',
      adminUserIds: req.user?._id ? [req.user._id] : []
    });

    await community.save();
    res.status(201).json({ success: true, community });
  } catch (error) {
    console.error('[Create Community Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCommunities, createCommunity };
