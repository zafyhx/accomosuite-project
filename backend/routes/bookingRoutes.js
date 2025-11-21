const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rute User
router.post('/', protect, createBooking); // Buat Pesanan
router.get('/mybookings', protect, getMyBookings); // Lihat Pesanan Sendiri

// Rute Admin
router.get('/', protect, admin, getAllBookings); // Lihat Semua Pesanan Orang

module.exports = router;