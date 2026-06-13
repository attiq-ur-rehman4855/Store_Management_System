require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Routes import karein
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors()); // Frontend connection ke liye zaroori hai
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Auth routes ko active karein
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
// Basic Testing Route
app.get('/', (req, res) => res.send('Store Management API is Running... 🚀'));

// Port Setting
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));