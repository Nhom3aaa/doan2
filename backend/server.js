require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const setupSocket = require('./src/socket');

// Import routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/orders');
const userRoutes = require('./src/routes/users');
const chatRoutes = require('./src/routes/chat');
const notificationRoutes = require('./src/routes/notifications');
const shipperRoutes = require('./src/routes/shipper.routes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      // Allow all localhost ports
      if (origin.startsWith('http://localhost:')) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
const passport = require('./src/config/passport');
app.use(passport.initialize());

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/shipper', shipperRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Phone Store API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Có lỗi xảy ra!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Setup Socket.IO
setupSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📡 Socket.IO đã sẵn sàng`);
});
