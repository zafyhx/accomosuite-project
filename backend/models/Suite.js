const mongoose = require('mongoose');

// Membuat Schema (Cetakan) untuk Data Kamar/Suite
const suiteSchema = new mongoose.Schema({
  
  // 1. NAMA SUITE (Contoh: Royal Ocean View)
  name: {
    type: String,
    required: [true, 'Nama suite wajib diisi'],
    trim: true, // PENTING: Menghapus spasi berlebih. " Deluxe Room " jadi "Deluxe Room"
    maxlength: [100, 'Nama terlalu panjang, maksimal 100 huruf']
  },

  // 2. TIPE KAMAR
  type: {
    type: String,
    required: true,
    // Membatasi input agar data seragam. Tidak boleh ada yang nulis "Deluks" atau "standar" (typo).
    enum: ['Standard', 'Deluxe', 'Suite', 'Family'], 
    default: 'Standard'
  },

  // 3. HARGA PER MALAM
  price: {
    type: Number, // Harus angka, tidak boleh huruf
    required: [true, 'Harga wajib diisi'],
    min: [0, 'Harga tidak boleh minus/negatif'] // Mencegah kesalahan input harga
  },

  // 4. DESKRIPSI LENGKAP
  description: {
    type: String,
    required: [true, 'Deskripsi wajib diisi agar tamu tertarik']
  },

  // 5. FASILITAS (Array of Strings)
  // Tanda [] artinya bisa menampung BANYAK data.
  // Contoh data: ["WiFi Kencang", "Sarapan Gratis", "Kolam Renang"]
  facilities: {
    type: [String], 
    required: false
  },

  // 6. KAPASITAS TAMU
  capacity: {
    type: Number,
    required: true,
    default: 2 // Standar hotel biasanya untuk 2 orang
  },

  // 7. FOTO-FOTO KAMAR
  // Array String: Menyimpan kumpulan link/URL foto
  images: {
    type: [String], 
    default: [] 
  },

  // 8. STATUS KETERSEDIAAN
  // Ini penting untuk filter pencarian. Kamar 'maintenance' tidak boleh muncul di hasil pencarian user.
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  }

}, { 
  timestamps: true // Mencatat kapan kamar ini ditambahkan ke sistem
});

module.exports = mongoose.model('Suite', suiteSchema);