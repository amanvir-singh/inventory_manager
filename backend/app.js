const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const connectDB = require('./database');
const usersRoutes = require('./routes/users');
const finishesRoutes = require('./routes/finishes');
const logsRoutes = require('./routes/logs');
const materialsRoutes = require('./routes/materials');
const suppliersRoutes = require('./routes/suppliers');
const thicknessesRoutes = require('./routes/thicknessnes');
const warehouseRoutes = require("./routes/warehouseItems");


const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
  

// Middleware
app.use(express.json());

// Routes
app.use('/users', usersRoutes);
app.use('/finishes', finishesRoutes);
app.use('/logs', logsRoutes);
app.use('/materials', materialsRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/thicknesses', thicknessesRoutes);
app.use('/warehouse', warehouseRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




