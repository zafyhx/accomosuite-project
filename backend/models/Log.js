const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  actor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Siapa yang melakukan aksi (Admin)
    required: true 
  },
  action: { 
    type: String, 
    required: true // Contoh: "DELETE_USER", "APPROVE_BOOKING"
  },
  description: { 
    type: String, 
    required: true // Detail: "Menghapus user Aditya"
  },
  entityId: {
    type: String, // ID dari objek yang diedit (opsional)
  }
}, {
  timestamps: true // Otomatis catat waktu kejadian
});

module.exports = mongoose.model('Log', logSchema);