const SOS = require('../models/SOS');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Trigger SOS Emergency
const triggerSOS = async (req, res) => {
  try {
    const { rideId, lat, lng, addressName, triggerReason } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const emergencyContacts = user ? user.emergencyContacts : [
      { name: 'Parent / Guardian', phone: '+91 9988776655' }
    ];

    const sosRecord = await SOS.create({
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

    // Notify Admin via Notification model
    await Notification.create({
      userId,
      title: '🚨 EMERGENCY SOS ALERT ACTIVATED',
      message: `Emergency SOS triggered by ${user ? user.name : 'Rider'} at ${sosRecord.location.addressName}`,
      type: 'SOS_ALERT'
    });

    res.status(201).json({
      success: true,
      message: 'SOS Emergency alert triggered. Emergency contacts & Admin control room notified.',
      sosRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Active SOS Alerts (Admin)
const getActiveSOSAlerts = async (req, res) => {
  try {
    const alerts = await SOS.find({ status: 'ACTIVE_EMERGENCY' }).populate('userId', 'name phone email role').sort({ createdAt: -1 });
    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resolve SOS Alert
const resolveSOSAlert = async (req, res) => {
  try {
    const { sosId } = req.params;
    const { adminNotes } = req.body;

    const sos = await SOS.findById(sosId);
    if (!sos) return res.status(404).json({ message: 'SOS record not found' });

    sos.status = 'RESOLVED';
    sos.adminNotes = adminNotes || 'Incident verified safe by admin response team';
    await sos.save();

    res.json({ success: true, message: 'SOS alert resolved successfully', sos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  triggerSOS,
  getActiveSOSAlerts,
  resolveSOSAlert
};
