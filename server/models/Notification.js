const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isGlobal: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['RIDE_ACCEPTED', 'RIDE_CANCELLED', 'PAYMENT_SUCCESS', 'SOS_ALERT', 'CHAT_MESSAGE', 'VERIFICATION_UPDATE'],
    default: 'RIDE_ACCEPTED'
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
