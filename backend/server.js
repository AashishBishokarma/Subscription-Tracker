require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI); // Debug log
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Import routes
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Routes
app.use('/api/v1/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => {
  res.send('Subscription Tracker Backend API');
});

// Start the server only if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  });
}
