const Community = require('../models/Community');

const getCommunities = async (req, res) => {
  try {
    let communities = await Community.find();
    if (communities.length === 0) {
      // Return default seed communities
      communities = [
        { _id: 'comm1', name: 'Greenwood Tech Campus', type: 'Campus Mode', domainRestriction: '@univ.edu', totalMembers: 340, activeRidesToday: 42 },
        { _id: 'comm2', name: 'CyberPark Tech Hub', type: 'Corporate Mode', domainRestriction: '@techpark.com', totalMembers: 510, activeRidesToday: 68 },
        { _id: 'comm3', name: 'Palm Meadows Gated Community', type: 'Residential Community', domainRestriction: '', totalMembers: 210, activeRidesToday: 24 },
        { _id: 'comm4', name: 'Greater City Commuters', type: 'Open Community', domainRestriction: '', totalMembers: 1200, activeRidesToday: 180 }
      ];
    }
    res.json({ success: true, communities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCommunity = async (req, res) => {
  try {
    const { name, type, domainRestriction } = req.body;
    const community = await Community.create({
      name,
      type,
      domainRestriction,
      adminUserIds: [req.user._id]
    });
    res.status(201).json({ success: true, community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCommunities, createCommunity };
