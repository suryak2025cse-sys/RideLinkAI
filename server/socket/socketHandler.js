const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io Connected]: ${socket.id}`);

    // Join ride room
    socket.on('join_ride_room', ({ rideId, userId, role }) => {
      socket.join(`ride_${rideId}`);
      console.log(`User ${userId} (${role}) joined room: ride_${rideId}`);
    });

    // Driver Live Location Updates
    socket.on('update_driver_location', ({ rideId, driverId, lat, lng, speed, heading }) => {
      io.to(`ride_${rideId}`).emit('driver_location_changed', {
        driverId,
        lat,
        lng,
        speed: speed || 32.5,
        heading: heading || 180,
        timestamp: new Date().toISOString()
      });
    });

    // Chat Messages
    socket.on('send_chat_message', (chatMsg) => {
      io.to(`ride_${chatMsg.rideId}`).emit('receive_chat_message', chatMsg);
    });

    // Typing Indicators
    socket.on('typing_status', ({ rideId, senderName, isTyping }) => {
      socket.to(`ride_${rideId}`).emit('user_typing_status', { senderName, isTyping });
    });

    // Ride Guardian Abnormal Behavior / Deviation alert
    socket.on('guardian_deviation_trigger', ({ rideId, driverId, reason, deviationKm }) => {
      io.to(`ride_${rideId}`).emit('guardian_safety_alert', {
        rideId,
        driverId,
        alertType: 'ROUTE_DEVIATION',
        reason: reason || 'Vehicle diverged 500m from AI optimized route',
        deviationKm: deviationKm || 0.6,
        popupAction: 'SHOW_SAFETY_CHECK_MODAL'
      });
    });

    // SOS Emergency Trigger via Socket
    socket.on('trigger_sos_event', (sosPayload) => {
      io.emit('broadcast_sos_alert', sosPayload);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io Disconnected]: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
