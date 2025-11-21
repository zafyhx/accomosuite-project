const jwt = require('jsonwebtoken');

// Fungsi untuk mencetak "Gelang Akses" (Token)
const generateToken = (id) => {
  // Kita bungkus ID user ke dalam token
  // Token ini akan kadaluarsa dalam 30 hari
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;