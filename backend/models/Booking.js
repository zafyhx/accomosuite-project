const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Siapa yang pesan? (Relasi ke User)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  
  // Properti apa yang dipesan? (Relasi ke Suite)
  suite: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Suite'
  },

  // Detail Tanggal
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },

  // Detail Harga
  totalPrice: { type: Number, required: true },
  
  // Jumlah Tamu
  guests: { type: Number, required: true, default: 1 },

  // Status Pesanan
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending' // Default: Menunggu konfirmasi admin
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);