const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load Config dari .env
dotenv.config();

// 2. Connect Database
connectDB();

// 3. Inisialisasi App
const app = express();

// 4. Middleware (Agar bisa baca JSON dari Frontend)
app.use(cors());
app.use(express.json());

// 5. Route Percobaan (Test Server)
app.get('/', (req, res) => {
  res.send('API Accomosuite Berjalan Lancar! 🚀');
});

// 6. Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});