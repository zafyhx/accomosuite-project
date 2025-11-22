const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Pastikan folder 'uploads' ada di root backend
  },
  filename(req, file, cb) {
    // Format nama file: blog-TIMESTAMP.extensi
    cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter tipe file (Hanya gambar)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, jpeg, png, webp) yang diperbolehkan!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter,
});

module.exports = upload;