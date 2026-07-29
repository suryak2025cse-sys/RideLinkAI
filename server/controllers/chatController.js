const Chat = require('../models/Chat');

const getRideMessages = async (req, res) => {
  try {
    const { rideId } = req.params;
    let messages = await Chat.find({ rideId }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      // Seed default welcome message
      messages = [
        {
          _id: 'chat_seed_1',
          rideId,
          senderId: '660a1234567890abcdef1234',
          senderName: 'Ananya Sharma (Driver)',
          senderRole: 'Driver',
          message: 'Hello! I am on my way to the pickup spot. I will arrive in ~4 minutes.',
          isRead: true,
          createdAt: new Date(Date.now() - 300000)
        }
      ];
    }
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendChatMessage = async (req, res) => {
  try {
    const { rideId, message, senderRole } = req.body;
    const chatMsg = await Chat.create({
      rideId,
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: senderRole || req.user.role,
      message,
      isRead: false
    });
    res.status(201).json({ success: true, chatMsg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRideMessages, sendChatMessage };
