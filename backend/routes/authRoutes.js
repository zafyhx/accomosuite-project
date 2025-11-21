const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Alamat Pendaftaran: POST /api/auth/register
router.post('/register', registerUser);

// Alamat Login: POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;