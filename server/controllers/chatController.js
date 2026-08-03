const Chat = require('../models/Chat');

const getRideMessages = async (req, res) => {
  try {
    const { rideId } = req.params;
    const messages = await Chat.find({ rideId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    console.error('[Chat Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendChatMessage = async (req, res) => {
  try {
    console.log("Incoming POST:", req.originalUrl);
    console.log(req.body);

    const { rideId, message, senderRole } = req.body;
    
    if (!rideId || !message) {
      return res.status(400).json({ success: false, message: 'rideId and message are required.' });
    }

    const chatMsg = new Chat({
      rideId,
      senderId: req.user?._id || req.body.senderId,
      senderName: req.user?.name || req.body.senderName || 'Anonymous',
      senderRole: senderRole || req.user?.role || 'Passenger',
      message,
      isRead: false
    });

    await chatMsg.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('chat_message', chatMsg);
    }

    res.status(201).json({ success: true, chatMsg });
  } catch (error) {
    console.error('[Send Chat Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRideMessages, sendChatMessage };
