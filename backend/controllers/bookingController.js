const Booking = require('../models/Booking');

// @desc    Buat Booking Baru
// @route   POST /api/bookings
// @access  Private (User Login)
const createBooking = async (req, res) => {
  try {
    const { suiteId, checkIn, checkOut, totalDays, totalPrice, guests } = req.body;

    if (!suiteId || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ message: 'Data booking tidak lengkap' });
    }

    const booking = new Booking({
      user: req.user._id, // Ambil ID user dari token login
      suite: suiteId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalDays,
      totalPrice,
      guests
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lihat Booking Saya (User)
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    // Cari booking yang user-nya adalah SAYA, lalu tampilkan detail 'suite'-nya juga
    const bookings = await Booking.find({ user: req.user._id }).populate('suite', 'name location images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lihat SEMUA Booking (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    // Tampilkan detail User (nama email) dan Suite (nama)
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('suite', 'name');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings };