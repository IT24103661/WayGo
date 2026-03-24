const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register all models FIRST before routes
require('./models/User');
require('./models/Tour');
require('./models/Vehicle');
require('./models/Booking');

// Routes
const authRoutes = require('./routes/authRoutes');
const tourManagerRoutes = require('./routes/tourManagerRoutes');
const driverRoutes = require('./routes/driverRoutes');
app.use('/api/users', authRoutes);
app.use('/api/tourmanager', tourManagerRoutes);
app.use('/api/driver', driverRoutes);

// Connect to DB — only start the server after a successful connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    console.log(`   Database: ${mongoose.connection.name}`);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected',  () => console.log('🔄 MongoDB reconnected'));