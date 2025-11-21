const mongoose = require('mongoose');

const suiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Judul properti wajib diisi'], // Ganti istilah "Nama Kamar" jadi "Judul Properti"
    trim: true,
    maxlength: [100, 'Nama tidak boleh lebih dari 100 karakter']
  },
  
  // BARU: Lokasi Properti 
  location: {
    type: String,
    required: [true, 'Lokasi properti wajib diisi (Misal: Bali, Jakarta)'],
    trim: true
  },

  type: {
    type: String,
    required: true,
    // BARU: Tipe Akomodasi ala Airbnb
    enum: ['Apartment', 'Villa', 'House', 'Hotel', 'Resort', 'Glamping'], 
    default: 'Hotel'
  },
  
  price: {
    type: Number,
    required: [true, 'Harga per malam wajib diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi wajib diisi']
  },
  facilities: {
    type: [String],
    required: false
  },
  capacity: {
    type: Number,
    required: true,
    default: 2
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Suite', suiteSchema);