const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const suiteRoutes = require('./routes/suiteRoutes');
const dirname = path.resolve();

// Load Config dari .env
dotenv.config();

// Connect Database
connectDB();

// Inisialisasi App
const app = express();

// Middleware (Agar bisa baca JSON dari Frontend)
app.use(cors());
app.use(express.json());

// Gunakan Route Auth
app.use('/api/auth', authRoutes);

// Gunakan Route Suite
app.use('/api/suites', suiteRoutes);
app.use('/api/bookings', bookingRoutes);

// Gunakan Route Blog
app.use('/api/blogs', blogRoutes);

// Agar url seperti http://localhost:5000/uploads/gambar.jpg bisa diakses
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

// Folder untuk gambar yang diupload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Percobaan (Test Server)
app.get('/', (req, res) => {
  res.send('API Accomosuite Berjalan Lancar! 🚀');
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});