const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./database');
const usersRoutes = require('./routes/users');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/users', usersRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




