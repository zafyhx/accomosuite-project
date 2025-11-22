const express = require('express');
const router = express.Router();
const { 
  getAllBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware'); // Pastikan middleware auth Anda ada di sini
const upload = require('../middleware/uploadMiddleware');

// Public Routes (Siapapun bisa lihat)
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Admin Routes (Hanya admin yang bisa Create, Update, Delete)
// Menggunakan upload.single('image') karena form nanti mengirim field bernama 'image'
router.post('/', protect, admin, upload.single('image'), createBlog);
router.put('/:id', protect, admin, upload.single('image'), updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;