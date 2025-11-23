const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); 

const { 
  createBooking, 
  getMyBookings, 
  cancelBooking, 
  getAllBookings, 
  adminUpdateBookingStatus,
  getDashboardStats
} = require('../controllers/bookingController'); 

// Prefix: /api/bookings

// Rute User
router.post('/', protect, createBooking); 
router.get('/my-bookings', protect, getMyBookings); 
router.put('/:id/cancel', protect, cancelBooking); 

// Rute Admin
router.get('/', protect, admin, getAllBookings); 
// Route untuk dashboard
router.get('/admin/stats', protect, admin, getDashboardStats);
// Rute Admin untuk Mengubah Status (Approval)
router.put('/:id/status', protect, admin, adminUpdateBookingStatus);


module.exports = router;