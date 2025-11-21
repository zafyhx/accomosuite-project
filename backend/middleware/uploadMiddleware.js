const multer = require('multer');
const path = require('path');

// Konfigurasi Penyimpanan
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Simpan di folder 'uploads'
  },
  filename(req, file, cb) {
    // Nama file unik: fieldname-tanggal-extensi
    // Contoh: image-173849382-jpg
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter File (Hanya boleh gambar)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/; // Format yang diizinkan
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Hanya boleh upload gambar (Images Only)!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;