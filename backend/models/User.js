const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Library untuk mengacak password agar tidak bisa dibaca manusia

// Membuat Schema (Blueprint/Cetakan) untuk Data User
const userSchema = new mongoose.Schema({
  
  // 1. NAMA LENGKAP
  name: {
    type: String, // Tipe data harus huruf/teks
    required: [true, 'Nama wajib diisi'] // Validasi: Kalau kosong, tolak penyimpanan
  },
  
  // 2. EMAIL (Sebagai Username)
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true, // PENTING: Mencegah satu email dipakai mendaftar 2 kali
    // Regex (Regular Expression): Rumus matematika untuk memastikan ada simbol '@' dan '.'
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Format email salah. Harusnya: contoh@email.com'
    ]
  },

  // 3. PASSWORD
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal 6 karakter'], // Mencegah password pendek/lemah
    select: false // KEAMANAN: Saat Admin meminta data user, field password ini JANGAN dikirim/ditampilkan
  },

  // 4. ROLE (Peran Pengguna)
  role: {
    type: String,
    // Enum: Membatasi input. User HANYA boleh punya role yang ada di daftar ini.
    // Mencegah hacker menginput role "SuperAdmin" atau "GodMode".
    enum: ['user', 'admin', 'staff'], 
    default: 'user' // Kalau tidak dipilih, otomatis jadi 'user' biasa
  },

  // 5. NOMOR HP
  phone: {
    type: String,
    required: [true, 'Nomor HP wajib diisi untuk konfirmasi booking']
  },

  // 6. FOTO PROFIL
  avatar: {
    type: String, // Kita simpan URL gambarnya saja (bukan filenya)
    default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' // Gambar default jika user belum upload foto
  }
}, { 
  timestamps: true // OTOMATIS: Membuat kolom 'createdAt' (tgl daftar) dan 'updatedAt' (tgl edit profil)
});

// --- MIDDLEWARE (FUNGSI PENCEGAT) ---

// Pre-Save Hook: Fungsi ini jalan OTOMATIS sesaat SEBELUM data disimpan ke database
userSchema.pre('save', async function(next) {
  // Cek: Apakah user mengubah passwordnya?
  // Kalau user cuma ganti Nama/No HP, maka password jangan di-acak ulang (nanti malah error)
  if (!this.isModified('password')) {
    next(); // Lanjut simpan, jangan lakukan apa-apa
  }

  // PROSES ENKRIPSI (HASHING)
  // Salt: Bumbu rahasia random (10 putaran) agar hasil acakan makin sulit ditebak
  const salt = await bcrypt.genSalt(10);
  
  // Hash: Mengubah "rahasia123" menjadi "$2a$10$X7w..."
  this.password = await bcrypt.hash(this.password, salt);
});

// --- METHOD TAMBAHAN (Bisa dipanggil di controller nanti) ---

// Fungsi untuk mencocokkan password saat Login
// Membandingkan password yg diketik user (enteredPassword) dengan password acak di database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);