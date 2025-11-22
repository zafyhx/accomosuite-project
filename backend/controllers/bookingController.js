const Booking = require('../models/Booking'); // Import model Booking
const Suite = require('../models/Suite'); // Import model Suite

// @desc    Buat Booking Baru (status awal: pending)
// @route   POST /api/bookings
// @access  Private (User Login)
const createBooking = async (req, res) => {
    try {
        const { suiteId, checkIn, checkOut, totalDays, totalPrice, guests } = req.body;

        if (!suiteId || !checkIn || !checkOut || !totalPrice) {
            return res.status(400).json({ message: 'Data booking tidak lengkap' });
        }

        const booking = new Booking({
            user: req.user._id, 
            suite: suiteId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalDays,
            totalPrice,
            guests,
            status: 'pending' // Status awal saat user pesan
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lihat Booking Saya (User)
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('suite', 'name location images price type');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    User mengajukan pembatalan (Mengubah status menjadi 'cancellation_requested')
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Wajib Login)
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking tidak ditemukan' });
        }

        // Cek Keamanan
        if (booking.user.toString() !== req.user._id.toString()) { 
            return res.status(401).json({ message: 'Akses ditolak. Anda bukan pemilik pesanan ini.' });
        }

        // Hanya booking yang 'confirmed' atau 'pending' yang boleh mengajukan pembatalan
        if (booking.status === 'cancelled' || booking.status === 'cancellation_requested' || booking.status === 'completed') {
            return res.status(400).json({ message: `Pesanan sudah berstatus ${booking.status.replace(/_/g, ' ')} dan tidak dapat mengajukan pembatalan.` });
        }

        // PERBAIKAN KRUSIAL: Ubah status menjadi REQUESTED
        booking.status = 'cancellation_requested';
        await booking.save();

        res.json({ message: 'Pengajuan pembatalan berhasil dikirim. Menunggu persetujuan Admin.', booking });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lihat SEMUA Booking (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('suite', 'name')
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update Status Booking oleh Admin
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const adminUpdateBookingStatus = async (req, res) => {
    try {
        // Ambil status dari body request
        const { status } = req.body;
        
        // Cari booking
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking tidak ditemukan' });
        }

        // Validasi Status Baru
        if (!['pending', 'confirmed', 'cancellation_requested', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        // Lakukan update
        booking.status = status;
        const updatedBooking = await booking.save();
        
        res.json(updatedBooking);

    } catch (error) {
        // Log error detail untuk debugging server
        console.error("ADMIN STATUS UPDATE FAILED:", error.message); 
        res.status(500).json({ message: error.message || 'Gagal memproses permintaan status.' });
    }
};


module.exports = { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    cancelBooking,
    adminUpdateBookingStatus
};