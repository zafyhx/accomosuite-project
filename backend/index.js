const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import Routes
const bookingRoutes = require("./routes/bookingRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const suiteRoutes = require("./routes/suiteRoutes");
const userRoutes = require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes");

// Load Config dari .env
dotenv.config();

// Connect Database
connectDB();

// Inisialisasi App
const app = express();

// Middleware agar backend bisa baca JSON dari Frontend
app.use(express.json()); 

// Middleware CORS
app.use(cors({
  origin: [
    "http://localhost:5173",            
    "https://accomosuite.vercel.app", 
    "https://accomosuite-project.vercel.app" // Jaga-jaga variasi nama
  ],
  credentials: true
}));

// Gunakan Route Auth
app.use("/api/auth", authRoutes);

// Gunakan Route Suite & Booking
app.use("/api/suites", suiteRoutes);
app.use("/api/bookings", bookingRoutes);

// Gunakan Route Blog
app.use("/api/blogs", blogRoutes);

// Gunakan Route Users
app.use("/api/users", userRoutes);

// Gunakan Route Logs
app.use("/api/logs", logRoutes);

// Folder untuk gambar yang diupload (Static Folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route Percobaan (Test Server)
app.get("/", (req, res) => {
  res.send("API Accomosuite Berjalan Lancar! 🚀");
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});