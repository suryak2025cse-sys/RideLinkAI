const mongoose = require('mongoose');
const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id;
    let query = {};
    if (userId) {
      query = { $or: [{ userId: userId }, { recipientId: userId }, { isGlobal: true }] };
    }
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    console.error('[Get Notifications Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    console.log("Incoming POST:", req.originalUrl);
    console.log(req.body);

    const { recipientId, userId, title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'title and message are required.' });
    }

    const notif = new Notification({
      userId: recipientId || userId || req.user?._id,
      recipientId: recipientId || userId || req.user?._id,
      title,
      message,
      type: type || 'RIDE_ACCEPTED',
      isRead: false
    });

    await notif.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('notification', notif);
    }

    res.status(201).json({ success: true, notification: notif });
  } catch (error) {
    console.error('[Create Notification Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  createNotification
};
