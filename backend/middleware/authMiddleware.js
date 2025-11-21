const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Cek apakah user sudah login (Punya Token)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil token dari header (Format: "Bearer koderahasia...")
      token = req.headers.authorization.split(' ')[1];

      // Terjemahkan token menjadi ID user
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cari user di database dan simpan di 'req.user' agar bisa dipakai di controller
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Lanjut ke proses berikutnya
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token tidak valid, gagal otorisasi' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, dilarang masuk' });
  }
};

// 2. Cek apakah user adalah ADMIN
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Boleh lewat
  } else {
    res.status(403).json({ message: 'Akses Ditolak! Hanya Admin yang boleh.' });
  }
};

module.exports = { protect, admin };