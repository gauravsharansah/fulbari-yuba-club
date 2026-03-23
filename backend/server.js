const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// --- Security Middleware ---
app.use(helmet());
app.use(morgan('dev'));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// --- CORS ---
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://fyc-jakma.vercel.app',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS not allowed'));
  },
  credentials: true
}));

// --- Body Parser ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/members', require('./routes/members'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'FYC Jakma API is running', timestamp: new Date() });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    // Seed admin on first run
    const { seedAdmin } = require('./config/seed');
    await seedAdmin();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

module.exports = app;
