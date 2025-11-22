const express = require('express');
const router = express.Router();
const { 
  getSuites, 
  getSuiteById, 
  createSuite, 
  deleteSuite,
  updateSuite
} = require('../controllers/suiteController');

// Import Middleware
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rute Umum (Bisa diakses siapa saja)
router.get('/', getSuites);
router.get('/:id', getSuiteById);

//--- Rute Khusus Admin (Harus Login & Role Admin) ---//
// upload.single('image') artinya mengharapkan input file bernama 'image'
router.post('/', protect, admin, upload.single('image'), createSuite);
// PUT (Edit) - Upload gambar opsional, jadi middleware upload diletakkan sebelum updateSuite
router.put('/:id', protect, admin, upload.single('image'), updateSuite); 

router.delete('/:id', protect, admin, deleteSuite);

module.exports = router;