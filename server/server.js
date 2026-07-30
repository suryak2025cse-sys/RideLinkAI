const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');
const safetyRoutes = require('./routes/safetyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const communityRoutes = require('./routes/communityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  }
});

// Attach Socket.io instance to Express App
app.set('io', io);

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Health check endpoint (Render health check probe)
app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'RideLink AI Express Backend', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'RideLink AI Express Backend', version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Middleware
app.use(errorHandler);

// Attach Socket.io Engine
socketHandler(io);

// Start HTTP Server on 0.0.0.0 immediately for Render / Cloud deployment
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(` 🚗 RideLink AI Express Backend Bound to ${HOST}:${PORT} `);
  console.log(` ⚡ Socket.io Real-time Engine active`);
  console.log(`====================================================`);
  
  // Connect to MongoDB asynchronously after port binding
  connectDB();
});
