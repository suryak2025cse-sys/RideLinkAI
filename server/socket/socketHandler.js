const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io Connected]: ${socket.id}`);

    // Join ride room
    socket.on('join_ride_room', ({ rideId, userId, role }) => {
      socket.join(`ride_${rideId}`);
      console.log(`User ${userId} (${role}) joined room: ride_${rideId}`);
    });

    // Real-Time Event Broadcasts
    socket.on('ride_created', (ride) => {
      io.emit('ride_created', ride);
    });

    socket.on('ride_updated', (ride) => {
      io.emit('ride_updated', ride);
    });

    socket.on('ride_deleted', (rideId) => {
      io.emit('ride_deleted', rideId);
    });

    socket.on('ride_request', (booking) => {
      io.emit('ride_request', booking);
    });

    socket.on('ride_accepted', (payload) => {
      io.emit('ride_accepted', payload);
    });

    socket.on('ride_rejected', (payload) => {
      io.emit('ride_rejected', payload);
    });

    socket.on('trip_started', (payload) => {
      io.emit('trip_started', payload);
    });

    socket.on('trip_completed', (payload) => {
      io.emit('trip_completed', payload);
    });

    // Driver Live Location Updates
    socket.on('driver_location', ({ rideId, driverId, lat, lng, speed, heading }) => {
      io.emit('driver_location', {
        rideId,
        driverId,
        lat,
        lng,
        speed: speed || 32.5,
        heading: heading || 180,
        timestamp: new Date().toISOString()
      });
    });

    // Passenger Live Location Updates
    socket.on('passenger_location', ({ rideId, passengerId, lat, lng }) => {
      io.emit('passenger_location', {
        rideId,
        passengerId,
        lat,
        lng,
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

    // Notifications
    socket.on('notification', (notif) => {
      io.emit('notification', notif);
    });

    // Route Guardian Abnormal Behavior / Deviation alert
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
