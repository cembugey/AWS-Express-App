// src/index.js

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Initialize Prisma client
// const { PrismaClient } = require('@prisma/client');
const prisma = require('./config/db');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // your React app origin
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
