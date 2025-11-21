const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Registrasi User Baru
// @route   POST /api/auth/register
// @access  Public (Siapa saja bisa akses)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Cek apakah email sudah terdaftar?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar, silakan login.' });
    }

    // 2. Buat user baru di database
    const user = await User.create({
      name,
      email,
      password, // Password akan otomatis di-hash di User.js
      phone
    });

    // 3. Jika sukses, kirim data user + TOKEN ke frontend
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id) // <-- Ini "Gelang" aksesnya
      });
    } else {
      res.status(400).json({ message: 'Data user tidak valid' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login User & Dapat Token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ email }).select('+password'); // Kita perlu password untuk dicocokkan

    // 2. Cek apakah user ada DAN passwordnya cocok
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id) // Berikan token baru
      });
    } else {
      res.status(401).json({ message: 'Email atau Password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };