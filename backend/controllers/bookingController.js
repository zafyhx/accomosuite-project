const Booking = require('../models/Booking'); // Import model Booking
const Suite = require('../models/Suite'); // Import model Suite
const { addLog } = require('./logController');

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

        const oldStatus = booking.status;
        // Lakukan update
        booking.status = status;
        const updatedBooking = await booking.save();

        await addLog(
        req.user._id, 
        "UPDATE_BOOKING", 
        `Mengubah status booking #${updatedBooking._id} dari '${oldStatus}' menjadi '${status}'`,
        updatedBooking._id
      );
        
        res.json(updatedBooking);

    } catch (error) {
        // Log error detail untuk debugging server
        console.error("ADMIN STATUS UPDATE FAILED:", error.message); 
        res.status(500).json({ message: error.message || 'Gagal memproses permintaan status.' });
    }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/bookings/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // --- 1. STATISTIK KARTU ---
    
    const incomeResult = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed', 'checked_in'] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

    const pendingCancel = await Booking.countDocuments({ 
      status: 'cancellation_requested' 
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    const totalSuites = await Suite.countDocuments();


    // --- 2. TABEL DATA ---
    const recentTransactions = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('suite', 'name')
      .populate('user', 'name email');

    const recentCancellations = await Booking.find({
        status: { $in: ['cancelled', 'cancellation_requested'] }
      })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('suite', 'name')
      .populate('user', 'name email');


    // --- 3. DATA GRAFIK (UPDATED) ---
    const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));

    // A. Grafik Pendapatan Bulanan
    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // B. Grafik Reservasi Bulanan (Jumlah Booking dibuat)
    const monthlyReservations = await Booking.aggregate([
      { 
        $match: { createdAt: { $gte: sixMonthsAgo } } 
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // C. Grafik Pembatalan Bulanan (Jumlah Booking dibatalkan)
    const monthlyCancellations = await Booking.aggregate([
      { 
        $match: { 
          status: { $in: ['cancelled', 'cancellation_requested'] },
          updatedAt: { $gte: sixMonthsAgo } // Gunakan updatedAt saat status berubah
        } 
      },
      {
        $group: {
          _id: { $month: "$updatedAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // D. Pie Chart
    const suiteDistribution = await Suite.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    res.json({
      cards: {
        totalIncome,
        pendingCancel,
        todayBookings, 
        totalSuites
      },
      recentTransactions,
      recentCancellations,
      charts: {
        monthlyRevenue,
        monthlyReservations, // Data Baru
        monthlyCancellations, // Data Baru
        suiteDistribution
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data statistik" });
  }
};

// @desc    Process Online Check-in (Upload KTP & Arrival Time)
// @route   PUT /api/bookings/:id/check-in
// @access  Private (User Owner)
const onlineCheckIn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    // Validasi: Pastikan yang check-in adalah pemilik booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Tidak diizinkan" });
    }

    // Validasi: Hanya status 'confirmed' yang bisa check-in
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: "Hanya booking berstatus Confirmed yang bisa Check-in" });
    }

    // Ambil data dari form
    const { identityNumber, arrivalTime } = req.body;
    
    // Handle file KTP (jika ada)
    let idCardImage = '';
    if (req.file) {
      idCardImage = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Wajib upload foto identitas (KTP/SIM)" });
    }

    // Update data booking
    booking.checkInDetails = {
      identityNumber,
      arrivalTime,
      idCardImage,
      checkInTime: new Date()
    };
    
    booking.status = 'checked_in'; // Ubah status otomatis

    const updatedBooking = await booking.save();

    res.json({ message: "Check-in berhasil!", data: updatedBooking });

  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ message: "Gagal memproses check-in: " + error.message });
  }
};

module.exports = { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    cancelBooking,
    adminUpdateBookingStatus,
    getDashboardStats,
    onlineCheckIn
};