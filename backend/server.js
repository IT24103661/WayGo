const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- NEW: Import your routes here ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/users', authRoutes);
// Now your registration URL will be: http://localhost:5000/api/users/register

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected to WayGo!'))
  .catch(err => console.log('Database Error: ', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});