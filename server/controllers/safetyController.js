const SOS = require('../models/SOS');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Trigger SOS Emergency
const triggerSOS = async (req, res) => {
  try {
    console.log("Incoming POST:", req.originalUrl);
    console.log(req.body);

    const { rideId, lat, lng, addressName, triggerReason } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required for SOS trigger.' });
    }

    const user = await User.findById(userId);
    const emergencyContacts = user?.emergencyContacts?.length ? user.emergencyContacts : [
      { name: user?.emergencyContactName || 'Parent / Guardian', phone: user?.emergencyContactPhone || '+91 9988776655' }
    ];

    const sosRecord = new SOS({
      userId,
      rideId: rideId || null,
      location: {
        lat: parseFloat(lat) || 12.9716,
        lng: parseFloat(lng) || 77.5946,
        addressName: addressName || 'Near MG Road Interchange, Bengaluru'
      },
      triggerReason: triggerReason || 'Emergency SOS Button Activated by Passenger',
      notifiedContacts: emergencyContacts,
      status: 'ACTIVE_EMERGENCY'
    });

    await sosRecord.save();

    // Notify Admin via Notification model
    const notif = new Notification({
      userId,
      recipientId: userId,
      isGlobal: true,
      title: '🚨 EMERGENCY SOS ALERT ACTIVATED',
      message: `Emergency SOS triggered by ${user ? user.name : 'Rider'} at ${sosRecord.location.addressName}`,
      type: 'SOS_ALERT'
    });
    await notif.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('sos_alert', sosRecord);
    }

    res.status(201).json({
      success: true,
      message: 'SOS Emergency alert triggered. Emergency contacts & Admin control room notified.',
      sosRecord
    });
  } catch (error) {
    console.error('[Trigger SOS Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Active SOS Alerts (Admin)
const getActiveSOSAlerts = async (req, res) => {
  try {
    const alerts = await SOS.find({ status: 'ACTIVE_EMERGENCY' }).populate('userId', 'name phone email role').sort({ createdAt: -1 });
    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    console.error('[Get Active SOS Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resolve SOS Alert
const resolveSOSAlert = async (req, res) => {
  try {
    const { sosId } = req.params;
    const { adminNotes } = req.body;

    const sos = await SOS.findById(sosId);
    if (!sos) return res.status(404).json({ success: false, message: 'SOS record not found' });

    sos.status = 'RESOLVED';
    sos.adminNotes = adminNotes || 'Incident verified safe by admin response team';
    await sos.save();

    res.json({ success: true, message: 'SOS alert resolved successfully', sos });
  } catch (error) {
    console.error('[Resolve SOS Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  triggerSOS,
  getActiveSOSAlerts,
  resolveSOSAlert
};
